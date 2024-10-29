from weasyprint import HTML

# Configurações
html_file = 'dh.html'
pdf_file = 'dh.pdf'

# Gerar PDF
HTML(html_file).write_pdf(pdf_file, 
    presentational_hints=True,  # Para permitir dicas de apresentação no HTML
    zoom=1.0,  # Para ajuste de zoom
    stylesheets=['styles.css'],
    options={
        'page-size': 'A4',  # Tamanho da página
        'orientation': 'Portrait',  # Orientação da página
        'margin-top': 5,  # Margem superior em mm
        'margin-right': 5,  # Margem direita em mm
        'margin-bottom': 5,  # Margem inferior em mm
        'margin-left': 5,  # Margem esquerda em mm
        'dpi': 300  # Resolução
    }
)
