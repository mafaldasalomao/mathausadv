from sql_alchemy import db
from datetime import datetime
from sqlalchemy.orm import relationship, backref
# from models.product import ProductModel
class DocumentModel(db.Model):
    __tablename__ = 'document'

    document_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    fees = db.Column(db.Text, nullable=True)
    service = db.Column(db.Text, nullable=True)
    assine_online_id = db.Column(db.String(120), nullable=True)
    assine_online_uuid = db.Column(db.Text, nullable=True)
    gdrive_id = db.Column(db.String(120), nullable=True)
    generated_at =  db.Column(db.DateTime, default=datetime.utcnow)
    signed_at = db.Column(db.DateTime, nullable=True)
    contract_id = db.Column(db.Integer, db.ForeignKey('contract.contract_id'))

    client_signatures = relationship('DocumentClientSign', backref='document', cascade='all, delete')

    def __init__(self, name, assine_online_id, gdrive_id, signed_at, fees, assine_online_uuid, service, contract_id, generated_at=None):
        self.name = name
        self.assine_online_id = assine_online_id
        self.assine_online_uuid = assine_online_uuid
        self.gdrive_id = gdrive_id
        self.signed_at = signed_at
        self.fees = fees
        self.service = service
        self.contract_id = contract_id
        self.generated_at = generated_at or datetime.utcnow()

    def json(self):
        document_json = {
            'document_id': self.document_id,
            'name': self.name,
            'fees': self.fees,
            'service': self.service,
            'signed_at': self.signed_at.isoformat() if self.signed_at else None,
            'assine_online_id': self.assine_online_id,
            'assine_online_uuid': self.assine_online_uuid,
            'gdrive_id': self.gdrive_id,
            'contract_id': self.contract_id
        }

        return document_json

    @classmethod
    def find_document(cls, document_id):
        document =  cls.query.filter_by(document_id=document_id).first()
        if document:
            return document
        return None
    
    @classmethod
    def find_assine_online_id_document(cls, assine_online_id):
        document =  cls.query.filter_by(assine_online_id=assine_online_id).first()
        if document:
            return document
        return None

    def save_document(self):
        db.session.add(self)
        db.session.commit()
    
    def delete_document(self):
        db.session.delete(self)
        db.session.commit()
        return True

    def update_document(self, name, assine_online_id, gdrive_id, signed_at, assine_online_uuid, fees, service):
        self.name = name
        self.assine_online_id = assine_online_id
        self.assine_online_uuid = assine_online_uuid
        self.gdrive_id = gdrive_id
        self.signed_at = signed_at
        self.fees = fees
        self.service = service
        db.session.commit()

