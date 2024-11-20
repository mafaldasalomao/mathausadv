from models.contract import ContractModel
from flask_restful import Resource, reqparse, request
from math import ceil
from models.document import DocumentModel
from models.document_client_sign import DocumentClientSign
from resources.document_utils.documentos_html.formata_dados import (gerar_div_partes, gerar_div_assinaturas, gerar_lista_contatos)
from resources.document_utils.documentos_html.html_to_pdf import gerar_documento
from resources.document_utils.documentos_html.drive_utils import delete_document_google_drive
from datetime import datetime
from babel.dates import format_date
from flask_jwt_extended import jwt_required
from sqlalchemy import func



class Documents(Resource):
    

    def get(self):
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        offset = (page - 1) * per_page

        total_documents = DocumentModel.query.filter(DocumentModel.parent_id == None).count()

        # Calcular o total de páginas
        total_pages = ceil(total_documents / per_page)


        return {'documents': [document.json() for document in DocumentModel.query.filter(DocumentModel.parent_id == None).offset(offset).limit(per_page).all()], 'page': page, 'per_page': per_page, 'total_pages': total_pages}

    

    @jwt_required()
    def post(self):
        data = Document.parser.parse_args()
        if (not data['document_type'] or
            not data['service'] or
            not data['fees'] or
            not data['contract_id']):
            return {'message': 'Document not valid'}, 500
        #check if has parts on contract_id
        contract = ContractModel.find_contract(data['contract_id'])
        if not contract:
            return {'message': 'Contract not found'}, 404
        if not contract.clients:
            return {'message': 'Contract has no clients'}, 500
        
        if contract.documents:
            for document in contract.documents:
                if document.name.lower() == data['document_type'].lower():
                    delete_document_google_drive(document.gdrive_id)
                    document.delete_document()
        
        all_clients = []
        non_responsible_clients = []
        def add_client(client):
            client.type = "Representante" if client.is_responsible else "Contratante"
            if client not in all_clients:
                all_clients.append(client)
                if not client.is_responsible:
                    non_responsible_clients.append(client)

        for client in contract.clients:
            add_client(client)
            if client.responsible is not None:
                add_client(client.responsible)

        all_clients.sort(key=lambda client: client.type == "Representante")
        div_parts = gerar_div_partes(all_clients)
        div_assinaturas = gerar_div_assinaturas(non_responsible_clients)
        div_contatos = gerar_lista_contatos(non_responsible_clients)
        
        data.update({
            'type': 'Avulso',
            'origin': 'Sede',
            'date': datetime.now().strftime("%d/%m/%Y"),
            "extense_date": format_date(datetime.now(), format='long', locale='pt_BR'),
            'div_contatos': div_contatos, 
            'div_partes': div_parts,
            'div_assinaturas': div_assinaturas
        })
            
        
        file_id, assine_online_id, assine_online_uuid, assinaturas = gerar_documento(data['document_type'], data, contract.drive_folder_id, non_responsible_clients)
        document = {
                    'name': data['document_type'].capitalize(),
                    'service': data['service'],
                    'fees': data['fees'],
                    'contract_id': contract.contract_id,
                    'assine_online_uuid': assine_online_uuid,
                    'signed_at': None,
                    'assine_online_id': assine_online_id,
                    'gdrive_id': file_id
                }
        document = DocumentModel(**document)
        
        
        
        try:
            document.save_document()
            for assinatura in assinaturas:
                assinatura_db = DocumentClientSign(
                    document_id=document.document_id,  # Certifique-se de que `document` é uma instância do modelo DocumentModel
                    client_id=assinatura["client_id"],
                    action=assinatura["action"],
                    signature_type=assinatura["signature_type"],
                    x=assinatura["x"],
                    y=assinatura["y"],
                    height=assinatura["height"],
                    width=assinatura["width"],
                    page=assinatura["page"]
                )
                DocumentClientSign.save_document_client_sign(assinatura_db)
        except Exception as e:
            return {'message': e}, 500
        return document.json(), 201
class Document(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('document_type', type=str, required=True, help="The field 'document_type' cannot be left blank")
    parser.add_argument('description', type=str, required=True, help="The field 'description' cannot be left blank")
    parser.add_argument('service', type=str, required=True, help="The field 'service' cannot be left blank")
    parser.add_argument('fees', type=str, required=True, help="The field 'fees' cannot be left blank")
    parser.add_argument('contract_id', type=int, required=True, help="The field 'contract_id' cannot be left blank")


    def get(self, document_id):
        document = DocumentModel.find_document(document_id)
        if document:
            return document.json()
        return {'message': 'Document not found'}, 404
    

    @jwt_required()
    def delete(self, document_id):
        document = DocumentModel.find_document(document_id)
        
        if document:
            delete_document_google_drive(document.gdrive_id)
            signatures = DocumentClientSign.query.filter_by(document_id=document_id).all()
            for signature in signatures:
                signature.delete_document_client_sign()
            if document.delete_document():
                return {'message': 'Document deleted'}
            else:
                return {'message': 'Cannot delete document'}, 400
        return {'message': 'Document not found'}, 404