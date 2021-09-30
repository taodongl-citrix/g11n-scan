FROM node:lts

RUN apt-get install -y openjdk-11-jre

ADD tool /opt/radar
