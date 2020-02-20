#define BUTTON_PIN 8

void setup() {
  Serial.begin(9600);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

void loop() {
  static String messageBuffer;

  // example button, needs to be replicated for each button
  if (!digitalRead(BUTTON_PIN)) {
    Serial.write("1\n");
  }

  // read incoming serial msg
  boolean msgComplete = false;
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') {
      msgComplete = true;
    } else {
      messageBuffer.concat(c);
    }
  }

  /*
  class ArduinoStatus(Enum):
    IDLE = "idle"
    INPUT = "input"
    SPEAK = "speak"
    LISTEN = "listen"
    WORKING = "working"
    ERROR = "error"
  */
  if (msgComplete) {
    // need to handle status message here for led stripe
    messageBuffer = "";
  }
}
