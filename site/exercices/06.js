definirExercice({
  "id": "6",
  "titre": "Un bouton, deux LED",
  "consigne": "Si on appuie sur le BOUTON qui est sur la broche D8 alors la LED de la broche D3 s'allume et la LED de la broche D4 s'éteint. Sinon la LED D3 s'éteint et la LED D4 s'allume.",
  "composants": [
    { "type": "bouton", "broche": "D8" },
    { "type": "led", "broche": "D3" },
    { "type": "led", "broche": "D4" }
  ],
  "blocsAutorises": ["si_alors", "si_sinon", "bouton_etat", "valeur_haut_bas", "comparaison", "led_etat"],
  "blocsDepart": null,
  "scenarios": [
    { "nom": "Deux appuis", "etapes": [
      { "attendre": 0.5 },
      { "maintenir": "D8" },
      { "verifier": { "D3": 1, "D4": 0 } },
      { "attendre": 0.5 },
      { "relacher": "D8" },
      { "verifier": { "D3": 0, "D4": 1 } },
      { "attendre": 0.5 },
      { "maintenir": "D8" },
      { "verifier": { "D3": 1, "D4": 0 } },
      { "attendre": 0.5 },
      { "relacher": "D8" },
      { "verifier": { "D3": 0, "D4": 1 } }
    ] }
  ],
  "indices": [
    "Bouton appuyé : D3 allumée et D4 éteinte. Sinon, c'est l'inverse.",
    "Blocs : « si … alors … sinon », avec deux « contrôler la LED » dans « alors » et deux dans « sinon »."
  ],
  "aSavoir": "6",
  "solutionReference": {
    "demarrage": [],
    "boucle": [
      { "bloc": "si_sinon",
        "condition": { "bloc": "comparaison", "op": "=", "a": { "bloc": "bouton_etat", "broche": "D8" }, "b": { "bloc": "valeur_haut_bas", "valeur": 1 } },
        "alors": [
          { "bloc": "led_etat", "broche": "D3", "etat": 1 },
          { "bloc": "led_etat", "broche": "D4", "etat": 0 }
        ],
        "sinon": [
          { "bloc": "led_etat", "broche": "D3", "etat": 0 },
          { "bloc": "led_etat", "broche": "D4", "etat": 1 }
        ] }
    ]
  }
});
