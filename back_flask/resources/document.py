from flask_restful import Resource, reqparse, request
from math import ceil
from models.document import DocumentModel
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
        if data['name'] is None or data['service'] is None or data['fees'] is None or data['contratantes'] is None:
            return {'message': 'Document not valid'}, 500
        document = DocumentModel(**data)

        for part in data['parts']:
            if not part["name"] or not part["cpf"] or not part["address"] or not part["email"] or not part["phone"]:
                return {'message': 'Document not valid'}, 500

        for part in data['representative']:
            if not part["name"] or not part["cpf"] or not part["address"] or not part["email"] or not part["phone"]:
                return {'message': 'Document not valid'}, 500
            

        

        try:
            document.save_document() #document.document_id
        except:
            return {'message': 'An error occurred inserting the document'}, 500
        return document.json(), 201
class Document(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('name', type=str, required=True, help="The field 'name' cannot be left blank")
    parser.add_argument('description', type=str, required=True, help="The field 'description' cannot be left blank")
    parser.add_argument('service', type=str, required=True, help="The field 'service' cannot be left blank")
    parser.add_argument('fees', type=str, required=True, help="The field 'fees' cannot be left blank") #honorarios
    parser.add_argument('parts', type=str, required=True, help="The field 'parts' cannot be left blank")
    parser.add_argument('representative', type=str)


    def get(self, document_id):
        document = DocumentModel.find_document(document_id)
        if document:
            return document.json()
        return {'message': 'Document not found'}, 404
    

    @jwt_required()
    def delete(self, document_id):
        document = DocumentModel.find_document(document_id)
        if document:
            if document.delete_document():
                return {'message': 'Document deleted'}
            else:
                return {'message': 'Cannot delete document'}, 400
        return {'message': 'Document not found'}, 404