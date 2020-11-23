FROM python:3.6-alpine

# install node
RUN apk add --update nodejs npm

# install gcc
RUN apk add gcc

WORKDIR /usr/src/app

# copy certificate
COPY google_certificate.json .
ENV GOOGLE_APPLICATION_CREDENTIALS="/usr/src/app/google_certificate.json"

# install translate module
COPY modules/translate modules/translate
RUN (cd modules/translate && npm install && npm link)

# install print module
RUN apk --update --upgrade add gcc musl-dev jpeg-dev zlib-dev libffi-dev cairo-dev pango-dev gdk-pixbuf
RUN pip install weasyprint
COPY modules/pdf_creator modules/pdf_creator
RUN (cd modules/pdf_creator && npm install && npm link)

# install server
COPY modules/server modules/server
RUN (cd modules/server && cp config.default.js config.js && npm install)

# install voice interface
COPY modules/voice_interface modules/voice_interface
RUN apk add portaudio portaudio-dev
RUN apk add build-base
RUN (cd modules/voice_interface && pip install -r requirements.txt)
RUN export LANGUAGE=en_US.UTF-8 && export LANG=en_US.UTF-8 && export LC_ALL=en_US.UTF-8

# run voice interface
WORKDIR /usr/src/app/modules/voice_interface
CMD ["python","run.py"]