import logging
import serial

class Arduino:
    def __init__(self, serialPort):
        self.serial = serial.Serial(serialPort, 9600, timeout=2)
        logging.info("connected to arduino on " + serialPort)

    def send(self, msg):
        return

    def read(self):
        logging.info("waiting for serial msg")
        while True:
            line = self.serial.readline()
            try:
                return int(line)
            except:
                continue
                
    def clear(self):
        self.serial.reset_input_buffer()
        return

class ArduinoDummy:

    def __init__(self):
        return

    def send(self, msg):
        logging.info("send to arduino: " + msg)

    def read(self):
        return int(input("select button: "))

    def clear(self):
        return
