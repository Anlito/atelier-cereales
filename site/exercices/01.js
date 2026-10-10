definirExercice({
  "id": "1",
  "titre": "Allumer une LED",
  "consigne": "Allumer la LED sur la broche D3.",
  "composants": [
    { "type": "led", "broche": "D3" }
  ],
  "blocsAutorises": ["led_etat"],
  "blocsDepart": null,
  "scenarios": [
    { "nom": "La LED s'allume", "etapes": [
      { "attendre": 1 },
      { "verifier": { "D3": 1 }, "delai": 0 }
    ] }
  ],
  "indices": [
    "Allume la LED D3 une seule fois, au démarrage.",
    "Utilise le bloc « contrôler la LED » avec HAUT et la broche D3, dans « Au démarrage »."
  ],
  "aSavoir": "1",
  "solutionReference": {
    "demarrage": [
      { "bloc": "led_etat", "broche": "D3", "etat": 1 }
    ],
    "boucle": []
  }
});
