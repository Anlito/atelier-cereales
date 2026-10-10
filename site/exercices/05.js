definirExercice({
  "id": "5",
  "titre": "Allumer, sinon éteindre",
  "consigne": "Si on appuie sur le BOUTON qui est sur la broche D8 alors la LED de la broche D3 s'allume sinon elle est éteinte.",
  "composants": [
    { "type": "bouton", "broche": "D8" },
    { "type": "led", "broche": "D3" }
  ],
  "blocsAutorises": ["si_alors", "si_sinon", "bouton_etat", "valeur_haut_bas", "comparaison", "led_etat"],
  "blocsDepart": null,
  "scenarios": [
    { "nom": "Deux appuis", "etapes": [
      { "attendre": 0.5 },
      { "maintenir": "D8" },
      { "verifier": { "D3": 1 } },
      { "attendre": 0.5 },
      { "relacher": "D8" },
      { "verifier": { "D3": 0 } },
      { "attendre": 0.5 },
      { "maintenir": "D8" },
      { "verifier": { "D3": 1 } },
      { "attendre": 0.5 },
      { "relacher": "D8" },
      { "verifier": { "D3": 0 } }
    ] }
  ],
  "aSavoir": "5",
  "solutionReference": {
    "demarrage": [],
    "boucle": [
      { "bloc": "si_sinon",
        "condition": { "bloc": "comparaison", "op": "=", "a": { "bloc": "bouton_etat", "broche": "D8" }, "b": { "bloc": "valeur_haut_bas", "valeur": 1 } },
        "alors": [
          { "bloc": "led_etat", "broche": "D3", "etat": 1 }
        ],
        "sinon": [
          { "bloc": "led_etat", "broche": "D3", "etat": 0 }
        ] }
    ]
  }
});
