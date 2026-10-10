definirExercice({
  "id": "4",
  "titre": "Un bouton allume la LED",
  "consigne": "Si on appuie sur le BOUTON qui est sur la broche D8 alors la LED de la broche D3 s'allume.",
  "composants": [
    { "type": "bouton", "broche": "D8" },
    { "type": "led", "broche": "D3" }
  ],
  "blocsAutorises": ["si_alors", "bouton_etat", "valeur_haut_bas", "comparaison", "led_etat"],
  "blocsDepart": null,
  "scenarios": [
    { "nom": "Bouton relâché, puis appuyé", "etapes": [
      { "attendre": 0.5 },
      { "verifier": { "D3": 0 }, "delai": 0 },
      { "maintenir": "D8" },
      { "verifier": { "D3": 1 } }
    ] }
  ],
  "indices": [
    "Si le bouton D8 est appuyé, alors on allume la LED D3.",
    "Blocs : « si … alors », « = », « état sur la broche D8 » et « HAUT », puis « contrôler la LED » dans « alors »."
  ],
  "aSavoir": "4",
  "solutionReference": {
    "demarrage": [],
    "boucle": [
      { "bloc": "si_alors",
        "condition": { "bloc": "comparaison", "op": "=", "a": { "bloc": "bouton_etat", "broche": "D8" }, "b": { "bloc": "valeur_haut_bas", "valeur": 1 } },
        "alors": [
          { "bloc": "led_etat", "broche": "D3", "etat": 1 }
        ] }
    ]
  }
});
