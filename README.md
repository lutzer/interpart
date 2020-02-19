# interpart
speech interface / multi-language installation for interpart project

## Setup

Each of these modules has to be setup by following its README.md:

* [modules/translate/README.md](modules/translate/README.md)
* [modules/server/README.md](modules/server/README.md)
* [modules/voice_interface/README.md](modules/voice_interface/README.md)
* [modules/pdf_creator/README.md](modules/pdf_creator/README.md)

## Run as Services

* install supervisor `sudo apt-install supervisor`
* run at startup with `sudo systemctl enable supervisor`

### Server Service

* create supervisor script in */etc/supervisor/conf.d/interpart.conf*
    ```
    [program:interpart_server]
    directory = /home/pi/interpart/modules/database
    command = node index.js
    user = pi
    environment = GOOGLE_APPLICATION_CREDENTIALS="/home/pi/.interpart-translations.json"

    [program:interpart_client]
    directory = /home/pi/interpart/modules/voice_interface
    command = .venv/bin/python run.py
    user = pi
    environment = GOOGLE_APPLICATION_CREDENTIALS="/home/pi/.interpart-translations.json"
  ```
* read config with `sudo supervisorctl reread; sudo supervisorctl update`
* control service with `sudo supervisorctl status | stop | start | tail`

## Usage

* Connect to the same wifi as the raspberry pi
* Open Admin interface on http://raspi-ip-address:3030
