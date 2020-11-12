FROM mhart/alpine-node:14

# install python
# RUN apt update || : && apt install python3.5 -y

WORKDIR /usr/src/app

# copy certificate
COPY google_certificate.json .
ENV GOOGLE_APPLICATION_CREDENTIALS="/usr/src/app/google_certificate.json"

# install translate module
COPY modules/translate/ modules/translate/
RUN (cd modules/translate && npm install && cp config.default.js config.js && npm link)