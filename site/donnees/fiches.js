// Fiches « À savoir » : une par exercice (le numéro correspond au champ « aSavoir » de l'exercice).
// Chaque fiche : un titre, 4 à 6 lignes courtes, un schéma. Première version rédigée par Claude,
// à relire par le professeur.
//
// Schémas possibles :
//   { "type": "led" }                                   LED éteinte (BAS) et allumée (HAUT)
//   { "type": "chronogramme", "series": [ { "nom": "LED D3", "etats": [[2, "HAUT"], [2, "BAS"]] } ] }
//   { "type": "blocs", "programme": { ... } }           petits blocs, comme dans l'éditeur
//   { "type": "fourche" }                               si … alors … sinon
//   { "type": "servo" }                                 demi-cercle 0°, 90°, 180°
//   { "type": "angles", "angles": [0, 90, 180, 90, 0] } suite de positions du servo
//   { "type": "capteur-actionneur" }                    bouton → carte → moteur
//   { "type": "variable", "nom": "CHOIX", "valeur": 3 } une boîte avec une étiquette
// Une fiche peut aussi avoir des « etapes » (construction pas à pas avec Précédent / Suivant).
definirFiches({
  "demarrage-boucle": {
    "titre": "« Au démarrage » et « Répéter indéfiniment »",
    "lignes": [
      "« Au démarrage » : les blocs placés dedans s'exécutent une seule fois, quand la carte s'allume.",
      "« Répéter indéfiniment » : les blocs placés dedans s'exécutent de haut en bas, puis tout recommence au début, sans fin.",
      "La carte fait d'abord « Au démarrage », puis « Répéter indéfiniment » pour toujours.",
      "Exemple : pour allumer une LED et la laisser allumée, « Au démarrage » suffit. Pour la faire clignoter, il faut « Répéter indéfiniment »."
    ],
    "schema": { "type": "deroulement" }
  },
  "1": {
    "titre": "La LED et la broche",
    "lignes": [
      "Une LED est une petite lampe branchée sur une broche de la carte.",
      "HAUT (1) : la broche envoie du courant, la LED s'allume.",
      "BAS (0) : plus de courant, la LED s'éteint.",
      "« Au démarrage » s'exécute une seule fois.",
      "« Répéter indéfiniment » recommence sans fin."
    ],
    "schema": { "type": "led" }
  },
  "2": {
    "titre": "Attendre",
    "lignes": [
      "La carte travaille très vite.",
      "Sans « attendre », la LED change des milliers de fois par seconde : on ne voit rien.",
      "« attendre 2 seconde(s) » garde la LED dans son état pendant 2 secondes.",
      "Pour clignoter : allumer, attendre, éteindre, attendre."
    ],
    "schema": { "type": "chronogramme", "series": [
      { "nom": "LED D3", "etats": [[2, "HAUT"], [2, "BAS"], [2, "HAUT"], [2, "BAS"]] }
    ] }
  },
  "3": {
    "titre": "Alterner",
    "lignes": [
      "Deux LED qui font l'inverse : quand l'une est HAUT, l'autre est BAS.",
      "Les blocs s'exécutent de haut en bas, dans l'ordre.",
      "Deux blocs placés l'un sous l'autre, sans « attendre » entre eux, se font en même temps pour nos yeux."
    ],
    "schema": { "type": "chronogramme", "series": [
      { "nom": "LED D3", "etats": [[2, "HAUT"], [2, "BAS"], [2, "HAUT"], [2, "BAS"]] },
      { "nom": "LED D4", "etats": [[2, "BAS"], [2, "HAUT"], [2, "BAS"], [2, "HAUT"]] }
    ] }
  },
  "4": {
    "titre": "Le bouton et « si… alors »",
    "lignes": [
      "Le bouton est un capteur : il dit à la carte s'il est appuyé.",
      "Pour un bouton, HAUT veut dire « appuyé ».",
      "Une condition est une règle : SI c'est vrai, ALORS on agit.",
      "On construit le bloc en 3 étapes :"
    ],
    "etapes": [
      { "texte": "1. Pose le bloc « si … alors ». La case de la condition est vide.",
        "programme": { "boucle": [ { "bloc": "si_alors", "condition": null, "alors": [] } ] } },
      { "texte": "2. Fabrique la condition « état sur la broche D8 = HAUT » et glisse-la dans la case.",
        "programme": { "boucle": [ { "bloc": "si_alors",
          "condition": { "bloc": "comparaison", "op": "=", "a": { "bloc": "bouton_etat", "broche": "D8" }, "b": { "bloc": "valeur_haut_bas", "valeur": 1 } },
          "alors": [] } ] } },
      { "texte": "3. Mets l'action dans « alors » : elle se fait seulement quand le bouton est appuyé.",
        "programme": { "boucle": [ { "bloc": "si_alors",
          "condition": { "bloc": "comparaison", "op": "=", "a": { "bloc": "bouton_etat", "broche": "D8" }, "b": { "bloc": "valeur_haut_bas", "valeur": 1 } },
          "alors": [ { "bloc": "led_etat", "broche": "D3", "etat": 1 } ] } ] } }
    ]
  },
  "5": {
    "titre": "« Sinon »",
    "lignes": [
      "« si … alors … sinon » est une fourche : le programme prend un chemin ou l'autre.",
      "« alors » : ce qui se passe quand la condition est vraie (bouton appuyé).",
      "« sinon » : ce qui se passe quand elle n'est pas vraie (bouton relâché)."
    ],
    "schema": { "type": "fourche" }
  },
  "6": {
    "titre": "Plusieurs actions",
    "lignes": [
      "On peut empiler plusieurs blocs dans « alors » et dans « sinon ».",
      "Ils s'exécutent de haut en bas, l'un après l'autre.",
      "Exemple : une LED s'allume et l'autre s'éteint."
    ],
    "schema": { "type": "blocs", "programme": { "boucle": [
      { "bloc": "si_sinon",
        "condition": { "bloc": "comparaison", "op": "=", "a": { "bloc": "bouton_etat", "broche": "D8" }, "b": { "bloc": "valeur_haut_bas", "valeur": 1 } },
        "alors": [ { "bloc": "led_etat", "broche": "D3", "etat": 1 }, { "bloc": "led_etat", "broche": "D4", "etat": 0 } ],
        "sinon": [ { "bloc": "led_etat", "broche": "D3", "etat": 0 }, { "bloc": "led_etat", "broche": "D4", "etat": 1 } ] }
    ] } }
  },
  "7": {
    "titre": "Deux boutons",
    "lignes": [
      "Deux « si » placés l'un sous l'autre.",
      "À chaque tour de boucle, la carte regarde le premier bouton, puis le deuxième.",
      "Chaque « si » a sa propre condition et ses propres actions."
    ],
    "schema": { "type": "blocs", "programme": { "boucle": [
      { "bloc": "si_alors",
        "condition": { "bloc": "comparaison", "op": "=", "a": { "bloc": "bouton_etat", "broche": "D8" }, "b": { "bloc": "valeur_haut_bas", "valeur": 1 } },
        "alors": [ { "bloc": "led_etat", "broche": "D3", "etat": 1 } ] },
      { "bloc": "si_alors",
        "condition": { "bloc": "comparaison", "op": "=", "a": { "bloc": "bouton_etat", "broche": "D9" }, "b": { "bloc": "valeur_haut_bas", "valeur": 1 } },
        "alors": [ { "bloc": "led_etat", "broche": "D4", "etat": 1 } ] }
    ] } }
  },
  "8": {
    "titre": "La trappe",
    "lignes": [
      "La machine a trois boutons : PetiteDose, GrandeDose et Trappe.",
      "Un « attendre » placé dans un « si » : la LED Trappe reste allumée le temps de l'attente.",
      "Pendant l'attente, la carte ne fait rien d'autre."
    ],
    "schema": { "type": "chronogramme", "series": [
      { "nom": "Bouton Trappe", "etats": [[1, "BAS"], [0.4, "HAUT"], [6.6, "BAS"]] },
      { "nom": "LED Trappe", "etats": [[1, "BAS"], [5, "HAUT"], [2, "BAS"]] }
    ] }
  },
  "9": {
    "titre": "Le servo-moteur",
    "lignes": [
      "Un servo-moteur est un moteur qui se place à un angle précis, entre 0° et 180°.",
      "C'est un actionneur : il agit sur le monde réel, comme la LED.",
      "0° : bras à droite. 90° : bras en haut. 180° : bras à gauche."
    ],
    "schema": { "type": "servo" }
  },
  "10": {
    "titre": "Aller-retour",
    "lignes": [
      "Même idée que le clignotement, avec des angles.",
      "Sans « attendre », le moteur n'a pas le temps de finir son mouvement.",
      "Angle, attendre, autre angle, attendre… et la boucle recommence."
    ],
    "schema": { "type": "chronogramme", "series": [
      { "nom": "Moteur D6", "etats": [[2, "0°"], [2, "90°"], [2, "0°"], [2, "90°"]] }
    ] }
  },
  "11": {
    "titre": "Une séquence",
    "lignes": [
      "Cinq positions dans l'ordre : 0°, 90°, 180°, 90°, 0°.",
      "Entre deux positions : « attendre 2 seconde(s) ».",
      "La boucle recommence ensuite."
    ],
    "schema": { "type": "angles", "angles": [0, 90, 180, 90, 0] }
  },
  "12": {
    "titre": "Bouton et moteur",
    "lignes": [
      "Le capteur (le bouton) décide de ce que fait l'actionneur (le servo-moteur).",
      "C'est le principe de toute la machine.",
      "Attention à la broche du moteur : regarde bien la consigne."
    ],
    "schema": { "type": "capteur-actionneur" }
  },
  "13": {
    "titre": "La variable",
    "lignes": [
      "Une variable est une boîte avec une étiquette (son nom : CHOIX) qui garde une valeur.",
      "« affecter » met une valeur dans la boîte.",
      "Elle sert à se souvenir de la dose choisie jusqu'à l'appui sur le bouton Trappe.",
      "On peut l'utiliser dans « attendre » : attendre CHOIX secondes.",
      "« ≠ » veut dire « est différent de »."
    ],
    "schema": { "type": "variable", "nom": "CHOIX", "valeur": 3 }
  }
});
