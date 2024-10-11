from sql_alchemy import db
from datetime import datetime
# from models.product import ProductModel
class DocumentModel(db.Model):
    __tablename__ = 'document'

    document_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    description = db.Column(db.String(80), nullable=True)
    fees = db.Column(db.String(80))
    dsign_id = db.Column(db.String(120), nullable=True)
    generated_at =  db.Column(db.DateTime, default=datetime.utcnow)
    signed_at = db.Column(db.DateTime, nullable=True)
    clients = db.relationship('ClientModel')

    def __init__(self, name, description, dsign_id, signed_at, fees):
        self.name = name
        self.description = description
        self.dsign_id = dsign_id
        self.signed_at = signed_at
        self.fees = fees

    def json(self):
        document_json = {
            'document_id': self.document_id,
            'name': self.name,
            'description': self.description,
            'fees': self.fees,
            'dsign_id': self.dsign_id,
            'quantity_parts': len(self.clients),
            'parts':  [client.json() for client in self.clients]
        }

        return document_json

    @classmethod
    def find_document(cls, document_id):
        document =  cls.query.filter_by(document_id=document_id).first()
        if document:
            return document
        return None
    
    @classmethod
    def find_dsign_id_document(cls, dsign_id):
        document =  cls.query.filter_by(url=dsign_id).first()
        if document:
            return document
        return None

    def save_document(self):
        db.session.add(self)
        db.session.commit()
    
    def delete_document(self):
        parts_to_delete = DocumentModel.query.filter_by(document_id=self.document_id).all()
       
        if (parts_to_delete  != []) or (len(self.clients) > 0):
            return False
        db.session.delete(self)
        db.session.commit()
        return True

    def update_document(self, name, description, dsign_id, signed_at,fees):
        self.name = name
        self.description = description
        self.dsign_id = dsign_id
        self.signed_at = signed_at
        self.fees = fees

