from sql_alchemy import db
from sqlalchemy import Boolean
from sqlalchemy.orm import relationship, backref
class ClientModel(db.Model):
    __tablename__ = 'client'

    client_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    cpf_cnpj = db.Column(db.String(150))
    address = db.Column(db.String(150))
    email = db.Column(db.String(150))
    phone = db.Column(db.String(150))
    is_responsible = db.Column(Boolean, default=False)
    responsible_id = db.Column(db.Integer, db.ForeignKey('client.client_id', ondelete='SET NULL'), nullable=True)
    responsible = db.relationship('ClientModel', remote_side=[client_id],  backref=db.backref('dependents', cascade='all, delete', passive_deletes=True))
    contract_id = db.Column(db.Integer, db.ForeignKey('contract.contract_id'))
    document_signatures = relationship('DocumentClientSign', backref='client', cascade='all, delete')

    def __init__(self, name, cpf_cnpj, address, email, phone, contract_id, is_responsible=False, responsible_id=None):
        self.name = name
        self.cpf_cnpj = cpf_cnpj.strip()
        self.address = address
        self.email = email.strip()
        self.phone = phone.strip()
        self.contract_id = contract_id
        self.responsible_id = responsible_id
        self.is_responsible = is_responsible

    def json(self):
        return {
            'client_id': self.client_id,
            'name': self.name,
            'cpf_cnpj': self.cpf_cnpj,
            'address': self.address,
            'email': self.email,
            'phone': self.phone,
            'contract_id': self.contract_id,
            'is_responsible': self.is_responsible,
            'responsible_id': self.responsible_id,
            'responsible': self.responsible.json() if self.responsible else None,
        }

    @classmethod
    def find_client(cls, client_id):
        client =  cls.query.filter_by(client_id=client_id).first()
        if client:
            return client
        return None

    def save_client(self):
        db.session.add(self)
        db.session.commit()

    def delete_client(self):
        db.session.delete(self)
        db.session.commit()

    def update_client(self, name, cpf_cnpj, address, email, phone, contract_id, is_responsible=False, responsible_id=None):
        self.name = name
        self.cpf_cnpj = cpf_cnpj
        self.address = address
        self.email = email
        self.phone = phone
        self.contract_id = contract_id
        self.responsible_id = responsible_id
        self.is_responsible = is_responsible

        db.session.commit()