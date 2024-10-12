from flask_restful import Resource, reqparse, request
from math import ceil
from models.contract import ContractModel
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from resources.document_utils.drive_utils import create_folder
import time

class Contracts(Resource):
    

    def get(self):
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        offset = (page - 1) * per_page

        total_contracts = ContractModel.query.all().count()

        # Calcular o total de páginas
        total_pages = ceil(total_contracts / per_page)


        return {'contracts':  [contract.json() for contract in ContractModel.query.offset(offset).limit(per_page).all()], 'page': page, 'per_page': per_page, 'total_pages': total_pages}

    

    @jwt_required()
    def post(self):
        data = Contract.parser.parse_args()
        if data['name'] is None or data['description'] is None:
            return {'message': 'Contract data not valid'}, 500
        
        try:
            #create drive folder
            timestamp_unix = int(time.time())
            folder_id = create_folder(data['name'] + str(timestamp_unix))
            data['drive_folder_id'] = folder_id
            contract = ContractModel(**data)
            contract.save_contract()
        except:
            return {'message': 'An error occurred inserting the contract'}, 500
        return contract.json(), 201

class Contract(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('name', type=str, required=True, help="The field 'name' cannot be left blank")
    parser.add_argument('description', type=str, required=True, help="The field 'description' cannot be left blank")
   


    def get(self, contract_id):
        contract = ContractModel.find_contract(contract_id)
        if contract:
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