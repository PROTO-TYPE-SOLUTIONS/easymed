FROM python:3.11-alpine

RUN apk update && apk add python3-dev gcc libc-dev weasyprint

WORKDIR /app

RUN pip install --upgrade pip
RUN pip install uvicorn
ADD ./requirements.txt /app/
RUN pip install -r requirements.txt

# ADD  ./docker /app/backend/docker
ADD . /app

EXPOSE 8080

RUN chmod 777 ./backend-entrypoint.sh
RUN chmod +x ./backend-entrypoint.sh

RUN chmod 777 ./backend-entrypoint.sh
RUN chmod +x ./worker-entrypoint.sh


