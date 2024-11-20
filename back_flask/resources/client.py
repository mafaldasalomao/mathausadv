from flask_restful import Resource, reqparse, request
from math import ceil
from models.client import ClientModel
from models.contract import ContractModel
from flask_jwt_extended import jwt_required
from sqlalchemy import func, desc, cast, Date
import re
from resources.document_utils.documentos_html.drive_utils import create_folder
from validate_docbr import CPF, CNPJ

class Clients(Resource):
    

    def get(self, contract_id):
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        offset = (page - 1) * per_page

        total_clients = ClientModel.query.filter_by(contract_id=contract_id).count()

        # Calcular o total de páginas
        total_pages = ceil(total_clients / per_page)
        clients = ClientModel.query.filter_by(contract_id=contract_id, is_responsible=False).offset(offset).limit(per_page).all()

        return {
            'clients': [client.json() for client in clients],
            'page': page,
            'per_page': per_page,
            'total_pages': total_pages
        }
    

    @jwt_required()
    def post(self, contract_id):
        contract = ContractModel.find_contract(contract_id)
        if not contract:
            return {'message': 'Contract not found'}, 404
        data = Client.parser.parse_args()
        data['cpf_cnpj'] = re.sub(r'\D', '', data['cpf_cnpj'])
        data['contract_id'] = contract_id
        if data['name'] is None or data['cpf_cnpj'] is None or data['address'] is None or data['email'] is None or data['phone'] is None:
            return {'message': 'Client data not valid'}, 500

        validator = CNPJ() if len(data['cpf_cnpj']) == 14 else CPF()
        if len(data['cpf_cnpj']) == 11:  # CPF tem 11 dígitos
            if not validator.validate(data['cpf_cnpj']):
                return {'message': 'Invalid CPF'}, 400
        elif len(data['cpf_cnpj']) == 14:  # CNPJ tem 14 dígitos
            if not validator.validate(data['cpf_cnpj']):
                return {'message': 'Invalid CNPJ'}, 400
        else:
            return {'message': 'cpf_cnpj must be either 11 or 14 digits long'}, 400
        try:   
            client = ClientModel(**data)
            client.save_client()
        except Exception as e:
            return {'message': f'An error occurred inserting the client {e}'}, 500
        return client.json(), 201
class Client(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('name', type=str, required=True, help="The field 'name' cannot be left blank")
    parser.add_argument('cpf_cnpj', type=str, required=True, help="The field 'cpf_cnpj' cannot be left blank")
    parser.add_argument('address', type=str, required=True, help="The field 'address' cannot be left blank")
    parser.add_argument('email', type=str, required=True, help="The field 'email' cannot be left blank")
    parser.add_argument('phone', type=str, required=True, help="The field 'phone' cannot be left blank")

   


    def get(self, client_id):
        client = ClientModel.find_client(client_id)
        if client:
            return client.json()
        return {'message': 'Client not found'}, 404
    

    @jwt_required()
    def delete(self, client_id):
        client = ClientModel.find_client(client_id)
        if client:
            try:
                responsible_client = ClientModel.find_client(client.responsible_id)
                if responsible_client:
                    responsible_client.delete_client()
                client.delete_client()
                return {'message': 'Client deleted'}
            except:
                return {'message': 'Cannot delete client'}, 400
        return {'message': 'Client not found'}, 404
    


class Responsable(Resource):
    @jwt_required()
    def post(self, client_id, contract_id):
        
        contract = ContractModel.find_contract(contract_id)
        if not contract:
            return {'message': 'Contract not found'}, 404
        data = Client.parser.parse_args()
        data['cpf_cnpj'] = re.sub(r'\D', '', data['cpf_cnpj'])
        data['contract_id'] = contract_id
        if data['name'] is None or data['cpf_cnpj'] is None or data['address'] is None or data['email'] is None or data['phone'] is None:
            return {'message': 'Client data not valid'}, 500

        validator = CNPJ() if len(data['cpf_cnpj']) == 14 else CPF()
        if len(data['cpf_cnpj']) == 11:  # CPF tem 11 dígitos
            if not validator.validate(data['cpf_cnpj']):
                return {'message': 'Invalid CPF'}, 400
        elif len(data['cpf_cnpj']) == 14:  # CNPJ tem 14 dígitos
            if not validator.validate(data['cpf_cnpj']):
                return {'message': 'Invalid CNPJ'}, 400
        else:
            return {'message': 'cpf_cnpj must be either 11 or 14 digits long'}, 400
        
        client = ClientModel.find_client(client_id)
        if not client:
            return {'message': 'Client not found'}, 404

        try:
            data['is_responsible'] = True   
            responsible = ClientModel(**data)
            responsible.save_client()
            client.responsible_id = responsible.client_id
            client.save_client()
        except Exception as e:
            return {'message': f'An error occurred inserting the client {e}'}, 500
        return client.json(), 201
    

class AllClients(Resource):
    @jwt_required()
    def get(self):
        # Parâmetros de paginação
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        offset = (page - 1) * per_page

        # Parâmetros de filtragem
        name = request.args.get('name', type=str)
        email = request.args.get('email', type=str)
        cpf_cnpj = request.args.get('cpf_cnpj', type=str)
        phone = request.args.get('phone', type=str)

        # Construir a query inicial
        query = ClientModel.query

        # Adicionar filtros dinamicamente
        if name:
            query = query.filter(ClientModel.name.ilike(f"%{name}%"))
        if email:
            query = query.filter(ClientModel.email.ilike(f"%{email}%"))
        if cpf_cnpj:
            query = query.filter(ClientModel.cpf_cnpj.ilike(f"%{cpf_cnpj}%"))
        if phone:
            query = query.filter(ClientModel.phone.ilike(f"%{phone}%"))

        # Contar o total após filtros
        total_clients = query.count()

        # Calcular o total de páginas
        total_pages = ceil(total_clients / per_page)

        # Adicionar ordenação e paginação
        clients = (query
                     .order_by(desc(ClientModel.name))
                     .offset(offset)
                     .limit(per_page)
                     .all())

        # Retornar os resultados paginados
        return {
            'clients': [client.json() for client in clients],
            'page': page,
            'per_page': per_page,
            'total_pages': total_pages,
            'total_clients': total_clients
        }