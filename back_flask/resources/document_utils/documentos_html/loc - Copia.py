import fitz  # PyMuPDF
import re

# Abra o PDF
pdf_document = "documentos/contrato.pdf"
doc = fitz.open(pdf_document)

# Padrão para detectar a palavra "Assin." seguida pelo nome
signature_pattern = r"Assin\.\s*([A-Za-zÀ-ÿ\s]+)"

# Loop através das páginas do PDF
for page_num in range(doc.page_count):
    page = doc.load_page(page_num)
    
    # Extraia o texto e a posição de cada item na página
    text_instances = page.search_for("Assin.")  # Procurando pela palavra "Assin."

    for inst in text_instances:
        # Extrair a região ao redor do texto "Assin."
        x0, y0, x1, y1 = inst  # Coordenadas onde "Assin." foi encontrado
        # Pegar o texto ao redor da palavra "Assin."
        text_nearby = page.get_text("text", clip=(x0, y0 - 20, x1 + 200, y1 + 20))  # Ajuste a largura e altura conforme necessário

        # Usar expressão regular para identificar o nome próximo à palavra "Assin."
        match = re.search(signature_pattern, text_nearby)
        
        if match:
            name = match.group(1)
            print(f"Assinatura encontrada na página {page_num + 1}:")
            print(f"Nome: {name}")
            print(f"Localização: (x0: {x0}, y0: {y0}), (x1: {x1}, y1: {y1})")

            # Opcional: se precisar de mais precisão, ajuste as coordenadas do bounding box
