definirExercice({
  "id": "12",
  "titre": "Un bouton commande le moteur",
  "consigne": "Si on appuie sur le bouton qui est sur la broche D10 le moteur va sur l'angle de 90°. Sinon le moteur va sur l'angle 0°. Le moteur est sur la broche D5.",
  "composants": [
    { "type": "bouton", "broche": "D10" },
    { "type": "servo", "broche": "D5" }
  ],
  "blocsAutorises": ["servo_angle", "si_alors", "si_sinon", "bouton_etat", "valeur_haut_bas", "comparaison"],
  "blocsDepart": null,
  "scenarios": [
    { "nom": "Deux appuis", "etapes": [
      { "attendre": 0.5 },
      { "maintenir": "D10" },
      { "verifier": { "D5": 90 } },
      { "attendre": 0.5 },
      { "relacher": "D10" },
      { "verifier": { "D5": 0 } },
      { "attendre": 0.5 },
      { "maintenir": "D10" },
      { "verifier": { "D5": 90 } },
      { "attendre": 0.5 },
      { "relacher": "D10" },
      { "verifier": { "D5": 0 } }
    ] }
  ],
  "indices": [
    "Bouton D10 appuyé : moteur à 90°. Sinon : moteur à 0°. Attention, le moteur est sur la broche D5.",
    "Blocs : « si … alors … sinon », la condition « état sur la broche D10 = HAUT », et deux « contrôler l'angle » sur la broche D5."
  ],
  "aSavoir": "12",
  "solutionReference": {
    "demarrage": [],
    "boucle": [
      { "bloc": "si_sinon",
        "condition": { "bloc": "comparaison", "op": "=", "a": { "bloc": "bouton_etat", "broche": "D10" }, "b": { "bloc": "valeur_haut_bas", "valeur": 1 } },
        "alors": [
          { "bloc": "servo_angle", "broche": "D5", "angle": 90 }
        ],
        "sinon": [
          { "bloc": "servo_angle", "broche": "D5", "angle": 0 }
        ] }
    ]
  }
});
