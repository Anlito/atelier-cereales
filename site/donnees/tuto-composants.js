// Tutoriel de câblage, rubrique « 6. Les composants » : fiche de chaque composant et son branchement.
// Le professeur peut ajouter ou modifier des composants ici. « couleur » : couleur du fil sur la fiche.
definirComposantsTuto([
  { "id": "led", "nom": "LED / DEL", "type": "Actionneur", "photo": "img/tuto/led.webp",
    "branchement": [
      { "couleur": "#F2C94C", "texte": "Fil de couleur (rouge, jaune, vert ou bleu) → sortie numérique (D2 à D13)" },
      { "couleur": "#5B4636", "texte": "Fil noir ou marron → GND (−)" }
    ],
    "note": "Sans câble : la patte courte va au GND, la patte longue à la sortie numérique." },
  { "id": "bouton", "nom": "Bouton poussoir", "type": "Capteur", "photo": "img/tuto/bouton.png",
    "branchement": [
      { "couleur": "#F2C94C", "texte": "Fil de couleur (rouge, jaune, vert, bleu ou blanc) → entrée numérique (D2 à D13)" },
      { "couleur": "#5B4636", "texte": "Fil noir ou marron → GND (−)" }
    ],
    "note": "Dans les blocs, « état sur la broche = HAUT » veut dire « le bouton est appuyé »." },
  { "id": "servo", "nom": "Servo-moteur", "type": "Actionneur", "photo": "img/tuto/servo.png",
    "branchement": [
      { "couleur": "#F2994A", "texte": "Fil orange → sortie numérique (D2 à D13)" },
      { "couleur": "#EB5757", "texte": "Fil rouge → 5V" },
      { "couleur": "#5B4636", "texte": "Fil marron → GND (−)" }
    ],
    "note": "C'est le moteur de la trappe du distributeur : 90° = trappe fermée, 0° = trappe ouverte." }
]);
