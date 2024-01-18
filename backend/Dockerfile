# pull official base image
FROM python:3.11-slim-bullseye as builder

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apt-get update \
    && apt-get install -y postgresql-client gcc python3-dev musl-dev \
    && apt-get install -y netcat

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /usr/src/app/wheels -r requirements.txt


# pull official base image
FROM python:3.11-slim-bullseye

# create directory for the app user
RUN mkdir -p /home/app

# create the app user
RUN groupadd app && useradd -m -g app app

# create the appropriate directories
ENV HOME=/home/app
ENV APP_HOME=/home/app/web

ENV DJANGO_SETTINGS_MODULE=makeeasyhmis.settings.base

RUN mkdir $APP_HOME
WORKDIR $APP_HOME


RUN mkdir $APP_HOME/staticfiles
RUN mkdir $APP_HOME/mediafiles

# install dependencies
RUN apt-get update && apt-get install -y libpq-dev
COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --no-cache /wheels/*

# copy entrypoint.sh
COPY ./entrypoint.sh $APP_HOME

# copy project
COPY . $APP_HOME

# chown all the files to the app user
RUN chown -R app:app $APP_HOME

# change to the app user
USER app

# run entrypoint.sh
ENTRYPOINT ["/home/app/web/entrypoint.sh"]
RUN chmod +x /home/app/web/entrypoint.sh
