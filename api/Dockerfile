# image
FROM python:3.8

# directory for the app
WORKDIR /usr/src/app

# copy all files
COPY . .

# install dependencies
RUN python -m venv venv
RUN . venv/bin/activate
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# permission
RUN chmod -R 775 ./api.py

# expose port
EXPOSE 8000

# run app
CMD ["python", "./api.py"]