// Carnet de projet (ancien « document élève ») : contenus et réponses attendues.
// Le professeur peut modifier ce fichier (textes, éléments à classer, étapes des algorigrammes).
// Le tableau de câblage n'est pas ici : il est construit à partir des composants de l'exercice 13A,
// pour que le câblage et les programmes utilisent toujours les mêmes broches.
definirCarnet({
  "problematique": "Comment faire pour me servir des céréales le matin au petit déj, sans en mettre partout, en évitant de mettre les mains dedans pour des raisons d'hygiène ?",
  "nombreIdees": 4,
  "questionObjet": "Un objet ou système technique, c'est quoi ? Écris la définition avec tes propres mots.",

  // Classement : les trois colonnes (avec l'explication du « ? ») et chaque élément, son image et sa bonne colonne.
  "colonnes": [
    { "cle": "capteur", "titre": "Capteurs", "aide": "Reçoivent une information",
      "explication": "Un capteur prend une information dans le monde réel (un appui, une distance, la lumière, un son…) et l'envoie à la carte programmable. Exemples : un bouton, un micro." },
    { "cle": "carte", "titre": "Carte programmable", "aide": "Traite et décide",
      "explication": "La carte programmable reçoit les informations des capteurs, exécute le programme et décide quoi faire. Exemples : la carte Arduino de notre distributeur, un Raspberry Pi." },
    { "cle": "actionneur", "titre": "Actionneurs", "aide": "Agissent sur le monde",
      "explication": "Un actionneur agit sur le monde réel quand la carte le lui demande : il bouge, éclaire ou fait du bruit. Exemples : un moteur, une LED, une enceinte." }
  ],
  "classement": [
    { "nom": "Capteur de distance", "image": "img/objets/distance.png", "place": "capteur" },
    { "nom": "Clavier", "image": "img/objets/clavier.png", "place": "capteur" },
    { "nom": "Bouton", "image": "img/objets/bouton.png", "place": "capteur" },
    { "nom": "Carte Arduino", "image": "img/objets/arduino.png", "place": "carte" },
    { "nom": "Ampoule", "image": "img/objets/ampoule.png", "place": "actionneur" },
    { "nom": "Unité centrale", "image": "img/objets/unite-centrale.png", "place": "carte" },
    { "nom": "Micro", "image": "img/objets/micro.png", "place": "capteur" },
    { "nom": "Souris", "image": "img/objets/souris.png", "place": "capteur" },
    { "nom": "Raspberry Pi", "image": "img/objets/raspberry.png", "place": "carte" },
    { "nom": "Pompe à eau", "image": "img/objets/pompe-a-eau.png", "place": "actionneur" },
    { "nom": "Écran", "image": "img/objets/ecran.png", "place": "actionneur" },
    { "nom": "Enceinte", "image": "img/objets/enceinte.png", "place": "actionneur" },
    { "nom": "Capteur d'humidité", "image": "img/objets/humidite.png", "place": "capteur" },
    { "nom": "Moteur", "image": "img/objets/moteur.png", "place": "actionneur" },
    { "nom": "Photorésistance", "image": "img/objets/photoresistance.png", "place": "capteur" }
  ],

  // Petits algorigrammes d'entraînement : les étapes dans le bon ordre (de haut en bas).
  // « forme » : "action" (rectangle) ou "question" (losange, avec OUI / NON).
  "algorigrammes": [
    { "id": "mouvement", "titre": "Exercice 1 — Capteur de mouvement",
      "consigne": "Par défaut, la lumière est éteinte. Un mouvement est détecté : elle s'allume. Plus de mouvement : elle s'éteint.",
      "etapes": [
        { "texte": "Lumière éteinte", "forme": "action" },
        { "texte": "Mouvement détecté ?", "forme": "question" },
        { "texte": "Lumière allumée", "forme": "action" },
        { "texte": "Plus de mouvement ?", "forme": "question" },
        { "texte": "Lumière éteinte", "forme": "action" }
      ] },
    { "id": "trappe", "titre": "Exercice 2 — Servo-moteur (trappe)",
      "consigne": "La trappe est à 0°. On appuie sur le bouton : elle passe à 90° pendant 10 secondes, puis revient à 0°.",
      "etapes": [
        { "texte": "Trappe à 0°", "forme": "action" },
        { "texte": "Bouton appuyé ?", "forme": "question" },
        { "texte": "Trappe à 90°", "forme": "action" },
        { "texte": "10 s écoulées ?", "forme": "question" },
        { "texte": "Trappe à 0°", "forme": "action" }
      ] }
  ],

  // Algorigramme du distributeur : texte attendu dans chaque case.
  // « groupes » : cases dont l'ordre est libre (ex. les 4 actions du début).
  "algoFinal": {
    "titre": "Algorigramme du distributeur de céréales",
    "consigne": "Place les étapes du programme du distributeur. À gauche : la petite dose. À droite : la grande dose.",
    "cases": {
      "s1": "LED Petite dose éteinte", "s2": "LED Grande dose éteinte", "s3": "LED Trappe éteinte", "s4": "Trappe fermée",
      "s5L": "Bouton Petite dose appuyé ?", "s6L": "LED Petite dose allumée", "s7L": "LED Grande dose éteinte",
      "s8L": "Bouton Trappe appuyé ?", "s9L": "LED Trappe allumée", "s10L": "Trappe ouverte", "s11L": "3 secondes écoulées ?",
      "s5R": "Bouton Grande dose appuyé ?", "s6R": "LED Grande dose allumée", "s7R": "LED Petite dose éteinte",
      "s8R": "Bouton Trappe appuyé ?", "s9R": "LED Trappe allumée", "s10R": "Trappe ouverte", "s11R": "7 secondes écoulées ?"
    },
    "groupes": [["s1", "s2", "s3", "s4"], ["s6L", "s7L"], ["s9L", "s10L"], ["s6R", "s7R"], ["s9R", "s10R"]]
  },

  // Câblage : couleurs proposées pour le câble de signal (le câble GND est toujours marron ou noir).
  "couleursCables": [
    { "nom": "rouge", "code": "#E53935" }, { "nom": "vert", "code": "#2E7D32" }, { "nom": "bleu", "code": "#1E88E5" },
    { "nom": "jaune", "code": "#FDD835" }, { "nom": "blanc", "code": "#F5F5F5" }, { "nom": "violet", "code": "#7B1FA2" }
  ],
  "couleurServo": { "nom": "orange", "code": "#F07020" }
});
