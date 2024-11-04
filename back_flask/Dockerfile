FROM python:3.10.11
WORKDIR /app
COPY . /app
RUN  pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 5000
CMD ["python", "app.py"]