FROM python:3.10.11
WORKDIR /app
COPY back_flask/ /app
RUN  pip install --upgrade pip
RUN pip install https://github.com/explosion/spacy-models/releases/download/pt_core_news_lg-3.6.0/pt_core_news_lg-3.6.0-py3-none-any.whl
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 5000
CMD ["python", "app.py"]