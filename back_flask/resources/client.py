from flask_restful import Resource, reqparse, request
from math import ceil
from models.client import ClientModel
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from resources.document_utils.drive_utils import create_folder
import time

class Clients(Resource):
    

    def get(self):
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        offset = (page - 1) * per_page

        total_clients = ClientModel.query.all().count()

        # Calcular o total de páginas
        total_pages = ceil(total_clients / per_page)


        return {'clients':  [client.json() for client in ClientModel.query.offset(offset).limit(per_page).all()], 'page': page, 'per_page': per_page, 'total_pages': total_pages}

    

    @jwt_required()
    def post(self):
        data = Client.parser.parse_args()
        if data['name'] is None or data['cpf'] is None or data['address'] is None or data['email'] is None or data['phone'] is None or data['signer_type'] is None or data['contract_id'] is None:
            return {'message': 'Client data not valid'}, 500
        
        try:   
            client = ClientModel(**data)
            client.save_client()
        except:
            return {'message': 'An error occurred inserting the contract'}, 500
        return client.json(), 201
class Client(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('name', type=str, required=True, help="The field 'name' cannot be left blank")
    parser.add_argument('cpf', type=str, required=True, help="The field 'cpf' cannot be left blank")
    parser.add_argument('address', type=str, required=True, help="The field 'address' cannot be left blank")
    parser.add_argument('email', type=str, required=True, help="The field 'email' cannot be left blank")
    parser.add_argument('phone', type=str, required=True, help="The field 'phone' cannot be left blank")
    parser.add_argument('signer_type', type=str, required=True, help="The field 'signer_type' cannot be left blank")
    parser.add_argument('contract_id', type=int, required=True, help="The field 'contract_id' cannot be left blank")  

   


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