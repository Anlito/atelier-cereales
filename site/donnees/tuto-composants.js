// Tutoriel de câblage, rubrique « 6. Les composants » : fiche de chaque composant et son branchement.
// Le professeur peut ajouter ou modifier des composants ici. « couleur » : couleur du fil sur la fiche.
definirComposantsTuto([
  { "id": "led", "nom": "LED / DEL", "type": "Actionneur", "photo": "img/tuto/led.webp",
    "branchement": [
      { "couleur": "#F2C94C", "texte": "Fil de couleur (jaune, rouge, vert, bleu) → sortie numérique (D2 à D13)" },
      { "couleur": "#5B4636", "texte": "Fil noir ou marron → GND (−)" }
    ],
    "note": "Sans câble : la patte courte va au GND, la patte longue à la sortie numérique." },
  { "id": "bouton", "nom": "Bouton poussoir", "type": "Capteur", "photo": "img/tuto/bouton.png",
    "branchement": [
      { "couleur": "#F2C94C", "texte": "Fil de couleur → entrée numérique (D2 à D13)" },
      { "couleur": "#5B4636", "texte": "Fil noir, marron ou gris → GND (−)" }
    ],
    "note": "Dans les blocs, « état sur la broche = HAUT » veut dire « le bouton est appuyé »." },
  { "id": "led-rgb", "nom": "LED multicolore", "type": "Actionneur", "photo": "img/tuto/led-rgb.webp",
    "branchement": [
      { "couleur": "#EB5757", "texte": "Fils rouge, vert, bleu → sorties numériques (D2 à D13)" },
      { "couleur": "#5B4636", "texte": "Fil noir ou marron → GND (−)" }
    ] },
  { "id": "buzzer", "nom": "Buzzer", "type": "Actionneur", "photo": "img/tuto/buzzer.png",
    "branchement": [
      { "couleur": "#F2994A", "texte": "Fil orange ou gris → sortie numérique (D2 à D13)" },
      { "couleur": "#EB5757", "texte": "Fil rouge ou blanc → 5V" },
      { "couleur": "#5B4636", "texte": "Fil noir ou marron → GND (−)" }
    ] },
  { "id": "servo", "nom": "Servo-moteur", "type": "Actionneur", "photo": "img/tuto/servo.png",
    "branchement": [
      { "couleur": "#F2994A", "texte": "Fil orange → sortie numérique (D2 à D13)" },
      { "couleur": "#EB5757", "texte": "Fil rouge → 5V" },
      { "couleur": "#5B4636", "texte": "Fil marron → GND (−)" }
    ],
    "note": "C'est le moteur de la trappe du distributeur : 90° = trappe fermée, 0° = trappe ouverte." },
  { "id": "ultrason", "nom": "Capteur à ultrasons", "type": "Capteur", "photo": "img/tuto/ultrason.png",
    "branchement": [
      { "couleur": "#F2994A", "texte": "Orange / broche TRIG → entrée numérique (D2 à D13)" },
      { "couleur": "#F2C94C", "texte": "Jaune / broche ECHO → entrée numérique (D2 à D13)" },
      { "couleur": "#EB5757", "texte": "Rouge ou blanc / broche VCC → 5V" },
      { "couleur": "#5B4636", "texte": "Marron ou noir / broche GND → GND (−)" }
    ],
    "note": "Il mesure la distance d'un obstacle." },
  { "id": "afficheur", "nom": "Afficheur à chiffres", "type": "Actionneur", "photo": "img/tuto/afficheur.png",
    "branchement": [
      { "couleur": "#9B51E0", "texte": "Violet / broche CLK → broche numérique (D2 à D13)" },
      { "couleur": "#828282", "texte": "Gris / broche DIO → broche numérique (D2 à D13)" },
      { "couleur": "#EB5757", "texte": "Rouge ou blanc / broche VCC → 5V" },
      { "couleur": "#5B4636", "texte": "Marron ou noir / broche GND → GND (−)" }
    ] },
  { "id": "pir", "nom": "Détecteur de mouvement", "type": "Capteur", "photo": "img/tuto/pir.png",
    "branchement": [
      { "couleur": "#F2994A", "texte": "Orange ou gris / broche OUT → entrée numérique (D2 à D13)" },
      { "couleur": "#EB5757", "texte": "Rouge ou blanc / broche VCC → 5V" },
      { "couleur": "#5B4636", "texte": "Marron ou noir / broche GND → GND (−)" }
    ] },
  { "id": "i2c", "nom": "Écran I2C", "type": "Actionneur", "photo": "img/tuto/i2c.png",
    "branchement": [
      { "couleur": "#2F80ED", "texte": "Broche SDA → broche SDA de la carte (ou A4)" },
      { "couleur": "#56CCF2", "texte": "Broche SCL → broche SCL de la carte (ou A5)" },
      { "couleur": "#EB5757", "texte": "Rouge ou blanc / broche VCC → 5V" },
      { "couleur": "#5B4636", "texte": "Marron ou noir / broche GND → GND (−)" }
    ] }
]);
