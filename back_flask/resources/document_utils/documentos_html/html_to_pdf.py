from weasyprint import HTML
import os
from jinja2 import Environment, FileSystemLoader

# Caminho para o diretório dos templates
# Define o diretório do template usando um caminho absoluto
template_dir = os.path.abspath('./resources/document_utils/documentos_html')
css_dir = os.path.abspath('./resources/document_utils/documentos_html/styles.css')

# Cria o ambiente Jinja2
env = Environment(loader=FileSystemLoader(template_dir))

# Configuraçõe
html_file = os.path.join(template_dir, 'dh.html')
pdf_file = os.path.join(template_dir, 'dh.pdf')



def gerar_documento(document_type, data):
    # Define o nome do template e do arquivo PDF com base no tipo de documento
    template_nome = f"{document_type.lower()}.html"
    pdf_file = os.path.join(template_dir, f"{document_type.lower()}.pdf")


    # Carrega o template pelo nome do arquivo
    template = env.get_template(template_nome)


    html_renderizado = template.render(data)

    # Gerar PDF
    HTML(string=html_renderizado).write_pdf(pdf_file, 
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
    
    print(f"{document_type} gerado com sucesso: {pdf_file}")