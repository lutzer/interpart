import random
import logging
import json
import time
from os import system
from subprocess import call, check_output

#from .keyboardinput import KeyGrabber 
from .voiceinput import VoiceInput 
from .statemachine import StateMachine, Action, State
from .restclient import RestClient
from .audio.speak import speak
from .hardware.arduino import Arduino,ArduinoDummy

logging.basicConfig(level=logging.INFO)

running = True

def run(config):
    global running

    #initialize
    logging.info("started script")
    state = StateMachine(State.WAITING_FOR_KEY)
    restClient = RestClient(config['API_ADRESS'])

    try:
        arduino = Arduino(config['SERIAL_PORT'])
    except:
        logging.warning("Cannot connect to arduino on " + config.SERIAL_PORT)
        arduino = ArduinoDummy()

    while running:
        if (state.status == State.WAITING_FOR_KEY):
            try:
                # clear input buffer
                arduino.clear()
                # wait for serial msg from arduino
                buttonNumber = arduino.read()
                
                # get settings from server
                settings = restClient.getSettings()
                language = settings['buttons'][buttonNumber]['language']
                logging.info("selected language: " + language)
                state.consumeAction(Action.SET_LANGUAGE, language = language)
            except:
                state.consumeAction(Action.THROW_ERROR, error = "Could not fetch language for selected button. Server not running?")

        elif state.status == State.SAY_GREETING:
            logging.info("fetching greeting")
            try:
                # get greeting instead of name question
                greeting = restClient.getGreeting(state.language)
                arduino.send("speak")
                speakText(greeting["text"], state.language)
                arduino.send("done")
                state.consumeAction(Action.DONE)
            except:
                state.consumeAction(Action.THROW_ERROR, error = "Failed fetching or speaking question")

        elif state.status == State.LISTENING_FOR_NAME:
            logging.info("listening for name")
            try:
                voiceInput = VoiceInput(state.language, config["SUPPORTED_LANGUAGES"])
                arduino.send("listen")
                answer = voiceInput.listenToMic(silenceTimeout = 1.0)
                arduino.send("done")
                logging.info("user name is: " + answer )
                state.consumeAction(Action.SET_NAME, name = answer)
            except Exception as error:
                state.consumeAction(Action.THROW_ERROR, error = str(error))

        elif state.status == State.FETCH_QUESTION:
            logging.info("fetching question...")
            try:
                 # fetch question from database
                question = restClient.getQuestion(state.language)
                # put in name
                question["text"] = question["text"].replace("{{NAME}}", state.author)
                state.consumeAction(Action.SET_QUESTION, question = question)
            except Exception as error:
                state.consumeAction(Action.THROW_ERROR, error = str(error))

        elif state.status == State.ASKING_QUESTION:
            logging.info("asking question: " + str(state.question))
            arduino.send("speak")
            speakText(state.question["text"], state.language)
            arduino.send("done")
            state.consumeAction(Action.DONE)

        elif state.status == State.LISTENING:
            logging.info("listening for voice input")
            try:
                voiceInput = VoiceInput(state.language, config["SUPPORTED_LANGUAGES"])
                arduino.send("listen")
                answer = voiceInput.listenToMic(silenceTimeout = config["SPEAKING_ANSWER_TIMEOUT"])
                arduino.send("done")
                state.consumeAction(Action.SET_ANSWER, answer = answer)
            except Exception as error:
                state.consumeAction(Action.THROW_ERROR, error = str(error))
            
        elif state.status == State.SAY_GOODBYE:
            if not state.answer:
                state.consumeAction(Action.THROW_ERROR, error = "Answer is empty")
            else:
                goodbye = restClient.getGoodbye(state.language)
                
                # speak goodbye
                arduino.send("speak")
                speakText( goodbye["text"].replace("{{NAME}}", state.author), state.language )
                arduino.send("done")
                state.consumeAction(Action.DONE)

        elif state.status == State.SENDING:
            logging.info("answer: " + str(state.answer))
            try:
                submission = {
                    "text" : state.answer,
                    "author" : state.author,
                    "language" : state.language,
                    "question" : state.question
                }
                arduino.send("busy")

                response = restClient.postAnswer(submission)
                logging.info("answer got posted to server. ")
 
                #fetch question
                question = restClient.getQuestion()

                # print answer
                printSubmission(response['data'], question, config["PRINTED_LANGUAGES"])
                logging.info("answer got printed. ")
                
                time.sleep(3.0)
                arduino.send("done")
                state.consumeAction(Action.DONE)
            except Exception as error:
                state.consumeAction(Action.THROW_ERROR, error = str(error))

        elif state.status == State.ERROR:
            logging.error(state.error)
            time.sleep(5.0)
            state.consumeAction(Action.TIMEOUT)

    logging.info("stopped loop")

def stop():
    global running
    running = False

def speakText(text, language):
    speak(text, language)
    # call('../speak/.venv/bin/python ../speak/speak.py \"{}\" --lang {}'.format(text, language), shell=True)

def toAscii(string):
    return str(string.encode('ascii', 'backslashreplace'))

def printSubmission(submission, question, languages = []):
    # generate pdf
    jsonString = json.dumps(submission, separators=(',', ':')).replace('"', '\\"')
    questionString = json.dumps(question, separators=(',', ':')).replace('"', '\\"')
    languages = ",".join(languages) 
    filePath = check_output(['interpart-pdf --submission \"{}\" --question \"{}\" --languages \"{}\"'.format(jsonString, questionString, languages)], shell=True)

    #encode as string and remove line ending
    filePath = filePath.decode("utf-8").rstrip("\n\r")

    # send file to printer
    system('lp -o media=A5 {}'.format(filePath))