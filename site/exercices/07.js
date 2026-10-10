definirExercice({
  "id": "7",
  "titre": "Deux boutons, deux doses",
  "consigne": "Si on appuie sur le BOUTON PetiteDose (sur la broche D8) alors la LED de la broche D3 s'allume et la LED de la broche D4 s'éteint. Si on appuie sur le BOUTON GrandeDose (sur la broche D9) alors la LED de la broche D4 s'allume et la LED de la broche D3 s'éteint.",
  "composants": [
    { "type": "bouton", "nom": "PetiteDose", "broche": "D8" },
    { "type": "bouton", "nom": "GrandeDose", "broche": "D9" },
    { "type": "led", "broche": "D3" },
    { "type": "led", "broche": "D4" }
  ],
  "blocsAutorises": ["si_alors", "si_sinon", "bouton_etat", "valeur_haut_bas", "comparaison", "led_etat"],
  "blocsDepart": null,
  "scenarios": [
    { "nom": "PetiteDose, GrandeDose, PetiteDose", "etapes": [
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
      { "maintenir": "D8" },
      { "verifier": { "D3": 1, "D4": 0 } },
      { "attendre": 0.5 },
      { "relacher": "D8" }
    ] }
  ],
  "indices": [
    "Un « si » pour le bouton PetiteDose, un autre « si » pour le bouton GrandeDose.",
    "Blocs : deux « si … alors » l'un sous l'autre. Dans chacun, deux « contrôler la LED »."
  ],
  "aSavoir": "7",
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
        ] }
    ]
  }
});
