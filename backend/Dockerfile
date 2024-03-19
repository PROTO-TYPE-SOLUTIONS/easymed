FROM python:3.11-alpine

RUN apk update && apk add python3-dev gcc libc-dev

WORKDIR /app

RUN pip install --upgrade pip
RUN pip install gunicorn
ADD ./requirements.txt /app/
RUN pip install -r requirements.txt

ADD  ./docker /app/backend/docker
ADD . /app/backend


RUN chmod +x /app/backend/docker/backend-entrypoint.sh
RUN chmod +x /app/backend/docker/worker-entrypoint.sh