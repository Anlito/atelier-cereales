definirExercice({
  "id": "3",
  "titre": "Deux LED en alternance",
  "consigne": "Faire clignoter la LED de la broche D3 et la LED de la broche D4, en alternance, toutes les 2 secondes.",
  "composants": [
    { "type": "led", "broche": "D3" },
    { "type": "led", "broche": "D4" }
  ],
  "blocsAutorises": ["led_etat", "attendre"],
  "blocsDepart": null,
  "scenarios": [
    { "nom": "La LED D3 clignote", "etapes": [
      { "sequence": "D3", "valeurs": [1, 0], "intervalle": 2, "duree": 10, "changements": 4 }
    ] },
    { "nom": "Les deux LED font l'inverse", "etapes": [
      { "opposees": ["D3", "D4"], "duree": 10 }
    ] }
  ],
  "aSavoir": "3",
  "solutionReference": {
    "demarrage": [],
    "boucle": [
      { "bloc": "led_etat", "broche": "D3", "etat": 1 },
      { "bloc": "led_etat", "broche": "D4", "etat": 0 },
      { "bloc": "attendre", "duree": 2 },
      { "bloc": "led_etat", "broche": "D3", "etat": 0 },
      { "bloc": "led_etat", "broche": "D4", "etat": 1 },
      { "bloc": "attendre", "duree": 2 }
    ]
  }
});
