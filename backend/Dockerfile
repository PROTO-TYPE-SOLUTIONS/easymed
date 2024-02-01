# syntax=docker/dockerfile:1

FROM python:3.7-slim-buster
ENV PYTHONDONTWRITEBTYECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update \
  && apt-get install -y --no-install-recommends build-essential \
  && apt-get install -y libreoffice libreoffice-java-common unoconv \
  && apt-get install -y libpq-dev \
  && apt-get install -y gfortran libopenblas-dev liblapack-dev \
  && apt-get install -y libfreetype6-dev libpng-dev \
  && apt-get install -y r-base r-cran-robustbase \
  && apt-get install -y gettext \
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt /requirements.txt
RUN pip3 install --upgrade setuptools wheel Cython pip
RUN pip3 install -r requirements.txt
WORKDIR /code
COPY . /code/