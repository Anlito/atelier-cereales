// Barème de la note (outil professeur). Le professeur peut le modifier ici, ou le régler dans
// le panneau « Barème » de prof.html (ces réglages-là ne durent que le temps de la page).
definirBareme({
  // Note sur :
  "sur": 20,
  // Coefficient de chaque exercice (selon sa difficulté). 0 = l'exercice ne compte pas.
  "coefficients": { "1": 1, "2": 1, "3": 1, "4": 1.5, "5": 1.5, "6": 1.5, "7": 1.5, "8": 2,
                    "9": 1, "10": 1, "11": 1.5, "12": 1.5, "13A": 3 },
  // Points de bonus si le défi 13B est réussi (la note ne dépasse jamais « sur »).
  "bonus13B": 1,
  // Exercice commencé (au moins une vérification) mais pas réussi : part des points accordée.
  "participation": 0.2,
  // Retenue par indice ouvert avant la réussite, et retenue maximale.
  "penaliteIndice": 0.1,
  "penaliteIndiceMax": 0.3,
  // Vérifications ratées sans retenue, puis retenue par vérification ratée en plus, et maximum.
  "essaisGratuits": 2,
  "penaliteEchec": 0.05,
  "penaliteEchecMax": 0.25,
  // Arrondi de la note (0.5 = au demi-point, 0.25 = au quart de point, 0 = au centième).
  "arrondi": 0.5
});
