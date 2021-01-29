# interpart
speech interface / multi-language installation for interpart project

## Setup
* setup raspberry pi system using an image from here: https://github.com/google/aiyprojects-raspbian/releases

### With docker

*Docker currently not working*

* install server
```
# build docker container
docker build -t drl/interpart .
# start docker container
docker run -dt --privileged --name interpart -p 3030:3030 --restart unless-stopped drl/interpart
# enter docker shell
docker exec -it interpart /bin/sh
```
* voice interface has currently to be installed manually

### Without docker

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
environment = GOOGLE_APPLICATION_CREDENTIALS="/home/pi/interpart/google_certificate.json"

#[program:interpart_client]
#directory = /home/pi/interpart/modules/voice_interface
#command = /home/pi/interpart/modules/voice_interface/.venv/bin/python run.py
#user = pi
#environment = GOOGLE_APPLICATION_CREDENTIALS="/home/pi/interpart/google_certificate.json"
#stdout_logfile =/tmp/interpart_client.log

[program:interpart_client]
directory = /home/pi/interpart/modules/voice_interface
command = interpart_voice_interface
user = pi
environment = GOOGLE_APPLICATION_CREDENTIALS="/home/pi/interpart/google_certificate.json",PATH="/home/pi/.local/bin/":%(ENV_PATH)s
stdout_logfile = /tmp/interpart_client.log
redirect_stderr=true
```
    
* update config with `sudo supervisorctl reread; sudo supervisorctl update`
* control service with `sudo supervisorctl status | stop | start | tail`
* see all running processes: `sudo supervisorctl status all`

## Usage

* Connect to the same wifi as the raspberry pi
* Open Admin interface on `http://raspberrypi.local:3030`  or `http://<ip-adress>:3030`

## Update procedure

* go to interpart directory and run `git pull`
* delete db und settings: `rm /home/pi/interpart/modules/server/data/*`

