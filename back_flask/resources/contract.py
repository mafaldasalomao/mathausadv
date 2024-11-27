from flask_restful import Resource, reqparse, request
from math import ceil
from sqlalchemy import desc, cast, Date
from models.contract import ContractModel
from models.document_client_sign import DocumentClientSign
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from resources.document_utils.documentos_html.drive_utils import create_folder, create_workflow_assine_online, get_status_workflow_assine_online, get_signed_pdf_assine_online, upload_new_version_to_drive
import time
from datetime import datetime, timedelta

class Contracts(Resource):
    

    def get(self):
        # Parâmetros de paginação
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        offset = (page - 1) * per_page

        # Parâmetros de filtragem
        name = request.args.get('name', type=str)
        description = request.args.get('description', type=str)
        status = request.args.get('status', type=str)
        created_at = request.args.get('created_at', type=str)

        # Construir a query inicial
        query = ContractModel.query

        # Adicionar filtros dinamicamente
        if name:
            query = query.filter(ContractModel.name.ilike(f"%{name}%"))
        if description:
            query = query.filter(ContractModel.description.ilike(f"%{description}%"))
        if status:
            query = query.filter(ContractModel.status == status)
        if created_at:
            query = query.filter(cast(ContractModel.created_at, Date) == datetime.strptime(created_at, '%Y-%m-%d').date())

        # Contar o total após filtros
        total_contracts = query.count()

        # Calcular o total de páginas
        total_pages = ceil(total_contracts / per_page)

        # Adicionar ordenação e paginação
        contracts = (query
                     .order_by(desc(ContractModel.created_at))
                     .offset(offset)
                     .limit(per_page)
                     .all())

        # Retornar os resultados paginados
        return {
            'contracts': [contract.json() for contract in contracts],
            'page': page,
            'per_page': per_page,
            'total_pages': total_pages,
            'total_contracts': total_contracts
        }

    

    @jwt_required()
    def post(self):
        data = Contract.parser.parse_args()
        if data['name'] is None or data['description'] is None:
            return {'message': 'Contract data not valid'}, 500
        
        try:
            #create drive folder
            timestamp_unix = int(time.time())
            folder_id = create_folder(data['name'] + "-" + str(timestamp_unix), '13DTt3-WM7yzVjELGaJPML7XsVB_40RFz')
            data['drive_folder_id'] = folder_id
            contract = ContractModel(**data)
            contract.save_contract()
        except Exception as e:
            return {'message': f'An error occurred inserting the contract {e}'}, 500
        return contract.json(), 201

class Contract(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('name', type=str, required=True, help="The field 'name' cannot be left blank")
    parser.add_argument('description', type=str, required=True, help="The field 'description' cannot be left blank")
    parser.add_argument('status', type=str, required=True, help="The field 'status' cannot be left blank")
   


    def get(self, contract_id):
        contract = ContractModel.find_contract(contract_id)
        if contract:
            return contract.json()
        return {'message': 'Contract not found'}, 404
    
    @jwt_required()
    def put(self, contract_id):
        contract = ContractModel.find_contract(contract_id)
        if contract:
            data = Contract.parser.parse_args()
            contract.name = data['name']
            contract.description = data['description']
            contract.status = data['status']
            contract.save_contract()
            return contract.json()
        return {'message': 'Contract not found'}, 404
    

    @jwt_required()
    def delete(self, contract_id):
        contract = ContractModel.find_document(contract_id)
        if contract:
            if contract.delete_document():
                return {'message': 'Contract deleted'}
            else:
                return {'message': 'Cannot delete contract'}, 400
        return {'message': 'Contract not found'}, 404
    

class SendToSigner(Resource):
    @jwt_required()
    def post(self, contract_id):
        contract = ContractModel.find_contract(contract_id)
        
        if not contract:
            return {'message': 'Contract not found'}, 404
        if not contract.clients or not contract.documents:
            return {'message': 'Contract has no clients or documents'}, 500
        data_atual = datetime.now()
        nova_data = data_atual + timedelta(days=30)
        data_formatada = nova_data.strftime("%Y-%m-%d %H:%M:%S")
        workflow_data = {
            "autoRemind": 1, # email notifications
            "autoInitiate": 1, #auto send to signer
            "dueDate": data_formatada,
            "message": "Olá, assine os documentos relacionados ao seu contrato",
            "priority": 0,
            "sla": 1
        }

        files = []

        for document in contract.documents:
            file = {
                "idFile": document.assine_online_id,
                "name": document.name,
                "specialFields": []
            }
            workflowSteps = []

            for client in contract.clients:
                if client.is_responsible:
                    continue

                client_signatures = DocumentClientSign.query.filter_by(
                    document_id=document.document_id, 
                    client_id=client.client_id
                ).all()

                # Monta a lista de campos de assinatura para o cliente
                fields = [
                    {
                        "type": 8,  # Ou qualquer tipo de assinatura que você precise
                        "x": signature.x,
                        "y": signature.y,
                        "height": signature.height,
                        "width": signature.width,
                        "page": signature.page
                    }
                    for signature in client_signatures
                ]
                workflowStep = {
                    "user": {
                        "name": client.name,
                        "email": client.responsible.email if client.responsible else client.email
                    },
                    "action": 0,  # Defina a ação conforme necessário
                    "signatureType": 0,  # Defina o tipo de assinatura conforme necessário
                    "fields": fields
                }

                workflowSteps.append(workflowStep)

            file["workflowSteps"] = workflowSteps
            files.append(file)

        workflow_data["files"] = files
        workflow_id = create_workflow_assine_online(workflow_data)

        contract.workflow_assine_id = workflow_id
        contract.status = "PRÉ-EXECUÇÃO"
        contract.save_contract()
        return contract.json(), 200
    

class CheckStatusSignature(Resource):
    def get(self):
        #get all contracts
        contracts = ContractModel.query.filter(ContractModel.status == 'PRÉ-EXECUÇÃO').all()
        for c in contracts:
            if c.workflow_assine_id is None:
                continue
            status = get_status_workflow_assine_online(c.workflow_assine_id)
            if status == 6:
                for document in c.documents:
                    signed_pdf_path = get_signed_pdf_assine_online(document.assine_online_uuid, f'{document.name}.pdf')
                    upload_new_version_to_drive(document.gdrive_id, signed_pdf_path)
                    document.signed_at = datetime.now()
                    document.save_document()
                c.status = "EXECUÇÃO DO SERVIÇO"
                c.save_contract()
            if status == 5 or status == 3 or status == 2:
                c.status = "CANCELADO"
                c.save_contract()
        return {'message': 'check status signature done'}, 200