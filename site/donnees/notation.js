// Barème de la note (outil professeur). Le professeur peut le modifier ici, ou le régler dans
// le panneau « Barème » de prof.html (ces réglages-là ne durent que le temps de la page).
definirBareme({
  // Note sur :
  "sur": 20,
  // Exercices attendus à ce moment du projet (les N premiers, 13 = tout le parcours).
  // La note est calculée sur eux ; un exercice réussi au-delà rapporte ses points en bonus.
  // À augmenter au fil des séances : la note reste juste même si une équipe ne finit pas.
  "objectif": 13,
  // Exercice réussi AU-DELÀ des exercices attendus : part de ses points ajoutée en bonus.
  // 0 = l'avance ne rapporte rien, pour qu'elle ne compense pas les erreurs sur le travail attendu.
  "avance": 0,
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
  // Vérifications ratées sans retenue (0 : seule une réussite du premier coup garde tous les points),
  // puis retenue par vérification ratée en plus, et maximum.
  "essaisGratuits": 0,
  "penaliteEchec": 0.05,
  "penaliteEchecMax": 0.25,
  // Exercices du carnet de projet notés et leur coefficient (0 = ne compte pas). Même principe que la
  // programmation : réussi = tous les points, moins les vérifications ratées avant la réussite.
  // La problématique et l'algorigramme du distributeur ne sont pas notés (leur travail reste visible).
  "carnet": { "classement": 1, "mouvement": 1, "trappe": 1 },
  // Arrondi de la note (0.5 = au demi-point, 0.25 = au quart de point, 0 = au centième).
  "arrondi": 0.5
});
