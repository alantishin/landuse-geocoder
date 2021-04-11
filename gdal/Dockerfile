FROM ubuntu:20.04

ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /home/app

RUN apt-get update
RUN apt-get install build-essential -y
RUN apt-get install gdal-bin -y