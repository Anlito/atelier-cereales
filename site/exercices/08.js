definirExercice({
  "id": "8",
  "titre": "La trappe",
  "consigne": "Si on appuie sur le BOUTON PetiteDose (sur la broche D8) alors la LED de la broche D3 s'allume et la LED de la broche D4 s'éteint. Si on appuie sur le BOUTON GrandeDose (sur la broche D9) alors la LED de la broche D4 s'allume et la LED de la broche D3 s'éteint. Si on appuie sur le BOUTON Trappe (sur la broche D10) alors les LEDs D3 et D4 s'éteignes et la LED Trappe (sur la broche D5) s'allume pendant 5 secondes puis s'éteint.",
  "composants": [
    { "type": "bouton", "nom": "PetiteDose", "broche": "D8" },
    { "type": "bouton", "nom": "GrandeDose", "broche": "D9" },
    { "type": "bouton", "nom": "Trappe", "broche": "D10" },
    { "type": "led", "broche": "D3" },
    { "type": "led", "broche": "D4" },
    { "type": "led", "nom": "Trappe", "broche": "D5" }
  ],
  "distributeur": true,
  "blocsAutorises": ["si_alors", "si_sinon", "bouton_etat", "valeur_haut_bas", "comparaison", "led_etat", "attendre"],
  "blocsDepart": null,
  "scenarios": [
    { "nom": "PetiteDose, GrandeDose, puis Trappe", "etapes": [
      { "attendre": 0.5 },
      { "maintenir": "D8" },
      { "verifier": { "D3": 1, "D4": 0 } },
      { "attendre": 0.5 },
      { "relacher": "D8" },
      { "attendre": 0.5 },
      { "maintenir": "D9" },
      { "verifier": { "D4": 1, "D3": 0 } },
      { "attendre": 0.5 },
      { "relacher": "D9" },
      { "attendre": 0.5 },
      { "appuyer": "D10" },
      { "verifier": { "D3": 0, "D4": 0, "D5": 1 } },
      { "impulsion": { "D5": 1 }, "duree": 5, "tolerance": 0.5 }
    ] }
  ],
  "aSavoir": "8",
  "solutionReference": {
    "demarrage": [],
    "boucle": [
      { "bloc": "si_alors",
        "condition": { "bloc": "comparaison", "op": "=", "a": { "bloc": "bouton_etat", "broche": "D8" }, "b": { "bloc": "valeur_haut_bas", "valeur": 1 } },
        "alors": [
          { "bloc": "led_etat", "broche": "D3", "etat": 1 },
          { "bloc": "led_etat", "broche": "D4", "etat": 0 }
        ] },
      { "bloc": "si_alors",
        "condition": { "bloc": "comparaison", "op": "=", "a": { "bloc": "bouton_etat", "broche": "D9" }, "b": { "bloc": "valeur_haut_bas", "valeur": 1 } },
        "alors": [
          { "bloc": "led_etat", "broche": "D4", "etat": 1 },
          { "bloc": "led_etat", "broche": "D3", "etat": 0 }
        ] },
      { "bloc": "si_alors",
        "condition": { "bloc": "comparaison", "op": "=", "a": { "bloc": "bouton_etat", "broche": "D10" }, "b": { "bloc": "valeur_haut_bas", "valeur": 1 } },
        "alors": [
          { "bloc": "led_etat", "broche": "D3", "etat": 0 },
          { "bloc": "led_etat", "broche": "D4", "etat": 0 },
          { "bloc": "led_etat", "broche": "D5", "etat": 1 },
          { "bloc": "attendre", "duree": 5 },
          { "bloc": "led_etat", "broche": "D5", "etat": 0 }
        ] }
    ]
  }
});
