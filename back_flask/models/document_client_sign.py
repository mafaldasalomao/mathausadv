from datetime import datetime
from sqlalchemy import Boolean
from sqlalchemy.orm import relationship, backref
from sql_alchemy import db

class DocumentClientSign(db.Model):
    __tablename__ = 'document_client_sign'

    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.document_id'))
    client_id = db.Column(db.Integer, db.ForeignKey('client.client_id'))
    action = db.Column(db.Integer, nullable=False, default=0)
    signature_type = db.Column(db.String, nullable=False, default=0)

    # Campos para posição e dimensões da assinatura
    x = db.Column(db.String, nullable=False)
    y = db.Column(db.String, nullable=False)
    height = db.Column(db.String, nullable=False)
    width = db.Column(db.String, nullable=False)
    page = db.Column(db.String, nullable=False)
    has_photo_sign = db.Column(db.Boolean, default=False)

    def __init__(self, document_id, client_id, action, signature_type, x, y, height, width, page, has_photo_sign=False):
        self.document_id = document_id
        self.client_id = client_id  
        self.action = action
        self.signature_type = signature_type
        self.x = x
        self.y = y
        self.height = height
        self.width = width
        self.page = page
        self.has_photo_sign = has_photo_sign

    def json(self):
        return {
            'id': self.id,
            'document_id': self.document_id,
            'client_id': self.client_id,
            'action': self.action,
            'signature_type': self.signature_type,
            'x': self.x,
            'y': self.y,
            'height': self.height,
            'width': self.width,
            'has_photo_sign': self.has_photo_sign,
            'page': self.page
        }
    
    @classmethod
    def find_by_id(cls, id):
        return cls.query.filter_by(id=id).first()   
    
    @classmethod
    def find_by_document_id(cls, document_id):
        return cls.query.filter_by(document_id=document_id).all()
    
    @classmethod
    def find_by_client_id(cls, client_id):
        return cls.query.filter_by(client_id=client_id).all()

    def save_document_client_sign(self):
        db.session.add(self)
        db.session.commit()

    def delete_document_client_sign(self):
        db.session.delete(self)
        db.session.commit()

    def update_document_client_sign(self, document_id, client_id, action, signature_type, x, y, height, width, page, has_photo_sign=False):
        self.document_id = document_id
        self.client_id = client_id
        self.action = action
        self.signature_type = signature_type
        self.x = x
        self.y = y
        self.height = height
        self.width = width
        self.page = page
        self.has_photo_sign = has_photo_sign

        db.session.commit()

    