FROM python:3.11-alpine

EXPOSE 8080

RUN apk update && apk add python3-dev gcc libc-dev weasyprint

WORKDIR /app

RUN pip install --upgrade pip
RUN pip install uvicorn
ADD ./requirements.txt /app/
RUN pip install -r requirements.txt

# ADD  ./docker /app/backend/docker
ADD . /app

RUN chmod 777 ./backend-entrypoint.sh
RUN chmod +x ./backend-entrypoint.sh

RUN chmod 777 ./worker-entrypoint.sh
RUN chmod +x ./worker-entrypoint.sh


