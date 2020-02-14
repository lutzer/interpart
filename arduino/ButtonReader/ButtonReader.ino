/*
  AnalogReadSerial

  Reads an analog input on pin 0, prints the result to the Serial Monitor.
  Graphical representation is available using Serial Plotter (Tools > Serial Plotter menu).
  Attach the center pin of a potentiometer to pin A0, and the outside pins to +5V and ground.

  This example code is in the public domain.

  http://www.arduino.cc/en/Tutorial/AnalogReadSerial
*/

#define BUTTON_PIN 8

void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);

  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

// the loop routine runs over and over again forever:
void loop() {
  if (!digitalRead(BUTTON_PIN)) {
    Serial.write("1\n");
    delay(500);
  }
}
