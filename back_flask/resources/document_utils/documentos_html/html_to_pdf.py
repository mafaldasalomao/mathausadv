from weasyprint import HTML
import os
from jinja2 import Environment, FileSystemLoader
import tempfile
from resources.document_utils.documentos_html.drive_utils import upload_to_google_drive, upload_to_assine_online
from resources.document_utils.documentos_html.localize_signature import localizar_assinaturas
# Caminho para o diretório dos templates
# Define o diretório do template usando um caminho absoluto
template_dir = os.path.abspath('./resources/document_utils/documentos_html')
css_dir = os.path.abspath('./resources/document_utils/documentos_html/styles.css')

# Cria o ambiente Jinja2
env = Environment(loader=FileSystemLoader(template_dir))

# Configuraçõe
html_file = os.path.join(template_dir, 'dh.html')
pdf_file = os.path.join(template_dir, 'dh.pdf')



def gerar_documento(document_type, data, drive_folder_id, non_responsible_clients):
    # Define o nome do template e do arquivo PDF com base no tipo de documento
    template_nome = f"{document_type.lower()}.html"
    template = env.get_template(template_nome)


    html_renderizado = template.render(data)
    temp_dir = os.path.abspath('./temp')
    os.makedirs(temp_dir, exist_ok=True)
    # Gerar PDF
    pdf_path = os.path.join(temp_dir, f"{document_type.lower()}.pdf")
    HTML(string=html_renderizado).write_pdf(pdf_path, 
            presentational_hints=True,  
            zoom=1.0,
            stylesheets=[css_dir],
            options={
                'page-size': 'A4',
                'orientation': 'Portrait',
                'margin-top': 5,
                'margin-right': 5,
                'margin-bottom': 5,
                'margin-left': 5,
                'dpi': 300
            }
        )
    if os.path.exists(pdf_path):
        file_id = upload_to_google_drive(pdf_path, f"{document_type.lower()}", drive_folder_id)
        assine_online_id, assine_online_uuid = upload_to_assine_online(pdf_path, f"{document_type.lower()}")
        assinaturas = localizar_assinaturas(pdf_path, non_responsible_clients)
        print(f"{document_type} gerado com sucesso: {pdf_path}")
        os.remove(pdf_path)
        return file_id, assine_online_id, assine_online_uuid, assinaturas
    else:
        print(f"Erro ao gerar {document_type}")
    return None, None, None, None