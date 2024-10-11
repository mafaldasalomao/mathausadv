from generate_doc import cadastrar_signatarios, generate_document, preprocess_data, send_document, send_document_to_signer

contratantes = [
    {
        "name": "Salomão Machado Mafalda", 
        "cpf": "123.456.789-00",
        "address": "Rodovia AC40, 8266, KM12, Vila Acre, Santa Maria, 69909788, Rio Branco, Acre, Brasil",
        "email": "salomaomachadon@gmail.com",
        "phone": "(68) 9999-9999"
    },
        {
        "name": "Daniel Mathaus", 
        "cpf": "987.654.321-11",
        "address": "Rua do Comércio, 100, Centro, Rio Branco, AC, Brasil",
        "email": "danielmathaus@hotmail.com",
        "phone": "(68) 8888-8888"
    }
]
responsaveis = [
    # {
    #     "name": "Daniel Mathaus", 
    #     "cpf": "987.654.321-11",
    #     "address": "Rua do Comércio, 100, Centro, Rio Branco, AC, Brasil",
    #     "email": "danielmathaus@hotmail.com",
    #     "phone": "(68) 8888-8888"
    # }
]


# Caminhos do template e do arquivo de saída
template_path = "CPSJ-PARTESEMREPRESENTANTE V1.1.docx"  # Template já existente com placeholders

# Gera o documento substituindo as variáveis no template
context = preprocess_data(contratantes, responsaveis, "teste servocçççç ", "honorarios iodaodwkadawodawdada")
print(context)
pdf_path = generate_document(template_path, context)
print(pdf_path)
document_id = send_document(pdf_path) #7d09a61b-3fff-4e22-9dc6-1e1559f8c91f
print(document_id)
cadastrar_signatarios(contratantes, document_id=document_id)
response = send_document_to_signer(
        document_id=document_id,
        skip_email="false",
        workflow="processo_assinatura",
        message="Por favor, assine este documento."
)

print(response)  
