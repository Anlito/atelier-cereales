// Distributeur de céréales — exercice 13A (Le distributeur complet) — généré par l'atelier du distributeur de céréales.
// LED : HAUT = allumée. Bouton (module) : HAUT = appuyé. Servo : 0° à 180°.
#include <Servo.h>

Servo servo6;
float CHOIX = 0;

// « attendre » en secondes (les nombres à virgule sont acceptés).
void attendre(float secondes) {
  if (secondes > 0) delay((unsigned long)(secondes * 1000.0));
}

void setup() {
  pinMode(9, OUTPUT);
  digitalWrite(9, LOW);
  pinMode(10, OUTPUT);
  digitalWrite(10, LOW);
  pinMode(11, OUTPUT);
  digitalWrite(11, LOW);
  pinMode(3, INPUT);
  pinMode(4, INPUT);
  pinMode(5, INPUT);
  servo6.write(90);
  servo6.attach(6);
  CHOIX = 0;
  servo6.write(constrain((int)(90), 0, 180));
}

void loop() {
  if ((digitalRead(3) == HIGH)) {
    digitalWrite(9, HIGH);
    digitalWrite(10, LOW);
    CHOIX = 3;
  }
  if ((digitalRead(4) == HIGH)) {
    digitalWrite(9, LOW);
    digitalWrite(10, HIGH);
    CHOIX = 7;
  }
  if ((digitalRead(5) == HIGH)) {
    digitalWrite(9, LOW);
    digitalWrite(10, LOW);
    digitalWrite(11, HIGH);
    servo6.write(constrain((int)(0), 0, 180));
    attendre(CHOIX);
    digitalWrite(11, LOW);
    servo6.write(constrain((int)(90), 0, 180));
  }
  delay(1);
}
