# interpart
speech interface / multi-language installation for interpart project

## Setup

### With docker
```
# build docker container
docker build -t drl/interpart .
# start docker container
docker run -dt --name <containername> drl/interpart
# enter docker shell
docker exec -it <containername> /bin/sh
```

Each of these modules has to be setup by following its README.md:

* [modules/translate/README.md](modules/translate/README.md)
* [modules/server/README.md](modules/server/README.md)
* [modules/voice_interface/README.md](modules/voice_interface/README.md)
* [modules/pdf_creator/README.md](modules/pdf_creator/README.md)

## Run as Services

* install supervisor `sudo apt-install supervisor`
* run at startup with `sudo systemctl enable supervisor`

### Server Services

* create supervisor script in */etc/supervisor/conf.d/interpart.conf*
    ```
    [program:interpart_server]
    directory = /home/pi/interpart/modules/server
    command = node index.js
    user = pi
    environment = GOOGLE_APPLICATION_CREDENTIALS="/home/pi/.interpart-translations.json"
    
    [program:interpart_client]
    directory = /home/pi/interpart/modules/voice_interface
    command = /home/pi/interpart/modules//voice_interface/.venv/bin/python run.py
    user = pi
    environment = GOOGLE_APPLICATION_CREDENTIALS="/home/pi/.interpart-translations.json"
    ```
    
* update config with `sudo supervisorctl reread; sudo supervisorctl update`
* control service with `sudo supervisorctl status | stop | start | tail`
* see all running processes: `sudo supervisorctl status all`
* to debug voice_interface stop service with `sudo supervisorctl stop interpart_client` and run `.venv/bin/python run.py` in `~/interpart/modules/voice_interface$`

## Usage

* Connect to the same wifi as the raspberry pi
* Open Admin interface on `http://raspberrypi.local:3030`  or `http://<ip-adress>:3030`

## Update procedure

* go to interpart directory and run `git pull`
* delete db und settings: `rm /home/pi/interpart/modules/server/data/*`

