from flask_restful import Resource, reqparse, request
from math import ceil
from models.client import ClientModel
from models.contract import ContractModel
from flask_jwt_extended import jwt_required
from sqlalchemy import func
import re
from resources.document_utils.drive_utils import create_folder
from validate_docbr import CPF, CNPJ

class Clients(Resource):
    

    def get(self, contract_id):
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        offset = (page - 1) * per_page

        total_clients = ClientModel.query.filter_by(contract_id=contract_id).count()

        # Calcular o total de páginas
        total_pages = ceil(total_clients / per_page)
        clients = ClientModel.query.filter_by(contract_id=contract_id).offset(offset).limit(per_page).all()

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
        if data['name'] is None or data['cpf_cnpj'] is None or data['address'] is None or data['email'] is None or data['phone'] is None or data['signer_type'] is None:
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
    parser.add_argument('signer_type', type=str, required=True, help="The field 'signer_type' cannot be left blank")

   


    def get(self, client_id):
        client = ClientModel.find_contract(client_id)
        if client:
            return client.json()
        return {'message': 'Client not found'}, 404
    

    @jwt_required()
    def delete(self, client_id):
        client = ClientModel.find_document(client_id)
        if client:
            if client.delete_client():
                return {'message': 'Client deleted'}
            else:
                return {'message': 'Cannot delete client'}, 400
        return {'message': 'Client not found'}, 404