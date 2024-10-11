import fitz  # PyMuPDF
import re

# Abra o PDF
pdf_document = "templates\output.pdf"
doc = fitz.open(pdf_document)

# Padrão para detectar linha sublinhada seguida por nome
signature_pattern = r"_{10,}\s*\n([A-Za-zÀ-ÿ\s]+)"

# Loop através das páginas do PDF
for page_num in range(doc.page_count):
    page = doc.load_page(page_num)
    
    # Extraia o texto e a posição de cada item na página
    text_instances = page.search_for("_" * 10)  # Procurando linhas sublinhadas

    for inst in text_instances:
        # Extrair a região ao redor da linha sublinhada
        x0, y0, x1, y1 = inst  # Coordenadas da linha sublinhada
        # Pegar o texto ao redor da linha sublinhada (nome da assinatura)
        text_nearby = page.get_text("text", clip=(x0, y0 - 50, x1, y1 + 50))  # Ajuste essa margem conforme necessário

        # Usar expressão regular para identificar o nome próximo à linha sublinhada
        match = re.search(signature_pattern, text_nearby)
        
        if match:
            name = match.group(1)
            print(f"Assinatura encontrada na página {page_num + 1}:")
            print(f"Nome: {name}")
            print(f"Localização: (x0: {x0}, y0: {y0}), (x1: {x1}, y1: {y1})")

            # Opcional: se precisar de mais precisão, ajuste as coordenadas do bounding box