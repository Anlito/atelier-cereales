// Distributeur de céréales — exercice 13A (Le distributeur complet) — généré par l'atelier du distributeur de céréales.
// LED : HAUT = allumée. Bouton poussoir (signal + GND) : HAUT = appuyé. Servo : 0° à 180°.
#include <Servo.h>

Servo servo6;
float CHOIX = 0;

// « attendre » en secondes (les nombres à virgule sont acceptés).
void attendre(float secondes) {
  if (secondes > 0) delay((unsigned long)(secondes * 1000.0));
}

// État du bouton : HAUT quand il est appuyé (il relie alors la broche à la masse).
int bouton(int broche) {
  return digitalRead(broche) == LOW ? HIGH : LOW;
}

void setup() {
  pinMode(9, OUTPUT);
  digitalWrite(9, LOW);
  pinMode(10, OUTPUT);
  digitalWrite(10, LOW);
  pinMode(11, OUTPUT);
  digitalWrite(11, LOW);
  pinMode(3, INPUT_PULLUP);
  pinMode(4, INPUT_PULLUP);
  pinMode(5, INPUT_PULLUP);
  servo6.write(90);
  servo6.attach(6);
  CHOIX = 0;
  servo6.write(constrain((int)(90), 0, 180));
}

void loop() {
  if ((bouton(3) == HIGH)) {
    digitalWrite(9, HIGH);
    digitalWrite(10, LOW);
    CHOIX = 3;
  }
  if ((bouton(4) == HIGH)) {
    digitalWrite(9, LOW);
    digitalWrite(10, HIGH);
    CHOIX = 7;
  }
  if ((bouton(5) == HIGH)) {
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
