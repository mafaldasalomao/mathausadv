from sql_alchemy import db

class ClientModel(db.Model):
    __tablename__ = 'client'

    client_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    cpf_cnpj = db.Column(db.String(150))
    address = db.Column(db.String(150))
    email = db.Column(db.String(150))
    phone = db.Column(db.String(150))
    signer_type = db.Column(db.String(50))


    contract_id = db.Column(db.Integer, db.ForeignKey('contract.contract_id'))
    
    def __init__(self, name, cpf_cnpj, address, email, phone, signer_type, contract_id):
        self.name = name
        self.cpf_cnpj = cpf_cnpj
        self.address = address
        self.email = email
        self.phone = phone
        self.signer_type = signer_type
        self.contract_id = contract_id

    def json(self):
        return {
            'client_id': self.client_id,
            'name': self.name,
            'cpf_cnpj': self.cpf_cnpj,
            'address': self.address,
            'email': self.email,
            'phone': self.phone,
            'signer_type': self.signer_type,
            'contract_id': self.contract_id
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

    def update_client(self, name, cpf_cnpj, address, email, phone, signer_type, contract_id):
        self.name = name
        self.cpf_cnpj = cpf_cnpj
        self.address = address
        self.email = email
        self.phone = phone
        self.signer_type = signer_type
        self.contract_id = contract_id