from sql_alchemy import db

class ClientModel(db.Model):
    __tablename__ = 'product_client'

    client_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    cpf = db.Column(db.String(150))
    address = db.Column(db.String(150))
    email = db.Column(db.String(150))
    phone = db.Column(db.String(150))
    document_id = db.Column(db.Integer, db.ForeignKey('document.document_id'))
    
    def __init__(self, name, cpf, address, email, phone, document_id):
        self.name = name
        self.cpf = cpf
        self.address = address
        self.email = email
        self.phone = phone
        self.document_id = document_id

    def json(self):
        return {
            'client_id': self.client_id,
            'name': self.name,
            'cpf': self.cpf,
            'address': self.address,
            'email': self.email,
            'phone': self.phone,
            'document_id': self.document_id
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

    def update_client(self, name, cpf, address, email, phone, document_id):
        self.name = name
        self.cpf = cpf
        self.address = address
        self.email = email
        self.phone = phone
        self.document_id = document_id