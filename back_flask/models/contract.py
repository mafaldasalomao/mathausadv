from sql_alchemy import db
from datetime import datetime, timezone
# from models.product import ProductModel
class ContractModel(db.Model):
    __tablename__ = 'contract'

    contract_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    description = db.Column(db.String(80), nullable=True)
    drive_folder_id = db.Column(db.String(80))
    status = db.Column(db.String(80), default='CONTRATAÇÃO')
    workflow_assine_id = db.Column(db.String(80), nullable=True, default=None)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    clients = db.relationship('ClientModel')
    documents = db.relationship('DocumentModel')

    def __init__(self, name, description, drive_folder_id, status):
        self.name = name
        self.description = description
        self.drive_folder_id = drive_folder_id
        self.status = status

    def json(self):
        document_json = {
            'contract_id': self.contract_id,
            'name': self.name,
            'description': self.description,
            'drive_folder_id': self.drive_folder_id,
            'status': self.status,
            'workflow_assine_id': self.workflow_assine_id,
            'created_at': self.created_at.strftime('%d/%m/%Y'),
            'updated_at': self.updated_at.strftime('%d/%m/%Y'),
            'clients':  [client.json() for client in self.clients if client.is_responsible == False],
            'documents':  [document.json() for document in self.documents]
        }

        return document_json

    @classmethod
    def find_contract(cls, contract_id):
        contract =  cls.query.filter_by(contract_id=contract_id).first()
        if contract:
            return contract
        return None
    


    def save_contract(self):
        db.session.add(self)
        db.session.commit()
    
    # def delete_document(self):
    #     parts_to_delete = DocumentModel.query.filter_by(document_id=self.document_id).all()
       
    #     if (parts_to_delete  != []) or (len(self.clients) > 0):
    #         return False
    #     db.session.delete(self)
    #     db.session.commit()
    #     return True

    # def update_document(self, name, description, dsign_id, signed_at,fees):
    #     self.name = name
    #     self.description = description
    #     self.dsign_id = dsign_id
    #     self.signed_at = signed_at
    #     self.fees = fees

