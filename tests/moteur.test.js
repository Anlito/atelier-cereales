const test = require('node:test');
const assert = require('node:assert/strict');
const { creerSimulation, chronologie, positionServo } = require('../site/js/moteur/simulation.js');
const { valider } = require('../site/js/moteur/validation.js');
const { depuisBlockly, versBlockly } = require('../site/js/moteur/programme.js');
const { chargerExercices, led, att, servo, appuye, si, prog } = require('./outils.js');
const faux = require('./programmes-faux.js');

const exercices = chargerExercices();
const parId = Object.fromEntries(exercices.map((e) => [e.id, e]));

test('les 14 exercices sont chargés dans l’ordre', () => {
  assert.deepEqual(
    exercices.map((e) => e.id),
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13A', '13B'],
  );
  assert.equal(parId['13A'].solutionReference.boucle[1].alors[2].valeur, 7, 'paramètre dureeGrandeDose appliqué');
});

for (const ex of exercices) {
  test(`exercice ${ex.id} : la solution de référence réussit en moins de 2 s`, () => {
    const debut = performance.now();
    const r = valider(ex, ex.solutionReference);
    const duree = performance.now() - debut;
    assert.equal(r.reussi, true, r.message);
    assert.ok(duree < 2000, `validation trop lente : ${Math.round(duree)} ms`);
  });

  test(`exercice ${ex.id} : la solution passe par Blockly sans changer de comportement`, () => {
    const { programme, horsProgramme, incomplets } = depuisBlockly(versBlockly(ex.solutionReference));
    assert.deepEqual(horsProgramme, []);
    assert.deepEqual(incomplets, []);
    assert.equal(valider(ex, programme).reussi, true);
  });

  const liste = faux[ex.id] || [];
  test(`exercice ${ex.id} : au moins trois programmes faux`, () => assert.ok(liste.length >= 3));
  for (const f of liste) {
    test(`exercice ${ex.id} : « ${f.nom} » échoue avec le bon message`, () => {
      const r = valider(ex, f.programme);
      assert.equal(r.reussi, false, 'le programme faux devrait échouer');
      assert.ok(r.message.includes(f.message), `message reçu : « ${r.message} »`);
      assert.ok(!/faux|erreur/i.test(r.message), 'jamais « faux » ni « erreur »');
    });
  }
}

test('13A réussi ne suffit pas pour 13B, 13B réussit aussi 13A', () => {
  assert.equal(valider(parId['13B'], parId['13A'].solutionReference).reussi, false);
  assert.equal(valider(parId['13A'], parId['13B'].solutionReference).reussi, true);
});

test('une boucle sans « attendre » ne fige pas : 1 ms par tour au minimum', () => {
  const sim = creerSimulation(prog([], [led('D3', 1), led('D3', 0)]));
  const debut = performance.now();
  sim.avancerJusqua(60000);
  assert.equal(sim.t, 60000);
  assert.ok(performance.now() - debut < 1000);
});

test('boucle vide et programme vide', () => {
  const sim = creerSimulation(prog());
  sim.avancerJusqua(1000);
  assert.equal(sim.t, 1000);
  assert.deepEqual(sim.journal, []);
});

test('« Au démarrage » une fois, puis « Répéter indéfiniment » en boucle', () => {
  const sim = creerSimulation(prog([led('D4', 1)], [led('D3', 1), att(1), led('D3', 0), att(1)]), {
    composants: [{ type: 'led', broche: 'D3' }, { type: 'led', broche: 'D4' }],
  });
  sim.avancerJusqua(4500);
  const d3 = sim.journal.filter((e) => e.broche === 'D3').map((e) => [e.t, e.valeur]);
  assert.deepEqual(d3, [[0, 1], [1000, 0], [2000, 1], [3000, 0], [4000, 1]]);
  assert.equal(sim.journal.filter((e) => e.broche === 'D4').length, 1);
});

test('nombres décimaux en secondes et attente nulle ou négative', () => {
  const sim = creerSimulation(prog([led('D3', 1), att(0.25), led('D3', 0), att(-3), att(0), led('D4', 1)]));
  sim.avancerJusqua(1000);
  assert.deepEqual(
    sim.journal.map((e) => [e.t, e.broche, e.valeur]),
    [[0, 'D3', 1], [250, 'D3', 0], [250, 'D4', 1]],
  );
});

test('angles du servo limités à 0–180 et mouvement en 0,3 s', () => {
  const sim = creerSimulation(prog([servo('D6', 250), att(1), servo('D6', -40)]), { composants: [{ type: 'servo', broche: 'D6' }] });
  sim.avancerJusqua(500);
  assert.equal(sim.sorties.D6, 180);
  assert.equal(positionServo(sim.journal, 'D6', 150), 90);
  assert.equal(positionServo(sim.journal, 'D6', 300), 180);
  sim.avancerJusqua(2000);
  assert.equal(sim.sorties.D6, 0);
});

test('un bouton est lu à chaque tour de boucle', () => {
  const sim = creerSimulation(prog([], [si(appuye('D8'), [led('D3', 1)])]), {
    composants: [{ type: 'bouton', broche: 'D8' }, { type: 'led', broche: 'D3' }],
  });
  sim.avancerJusqua(100);
  assert.equal(sim.sorties.D3, 0);
  sim.changerEntree('D8', 1);
  sim.avancerJusqua(102);
  assert.equal(sim.sorties.D3, 1);
});

test('bloc en cours : « si » au repos, la LED quand le bouton est appuyé', () => {
  const p = depuisBlockly(versBlockly(prog([], [si(appuye('D8'), [led('D3', 1)])]))).programme;
  const sim = creerSimulation(p, { composants: [{ type: 'bouton', broche: 'D8' }] });
  sim.avancerJusqua(50);
  assert.equal(sim.blocEnCours, p.boucle[0].id);
  sim.changerEntree('D8', 1);
  sim.avancerJusqua(60);
  assert.equal(sim.blocEnCours, p.boucle[0].alors[0].id);
});

test('pas à pas : un bloc par clic, les attentes sont sautées', () => {
  const p = depuisBlockly(versBlockly(prog([led('D4', 1)], [led('D3', 1), att(2), led('D3', 0)]))).programme;
  const sim = creerSimulation(p);
  const ids = [];
  for (let i = 0; i < 6; i++) {
    sim.pas();
    ids.push(sim.blocEnCours);
  }
  const [d4] = p.demarrage;
  const [allumer, attendre, eteindre] = p.boucle;
  assert.deepEqual(ids, [d4.id, allumer.id, attendre.id, eteindre.id, allumer.id, attendre.id]);
  assert.equal(sim.sorties.D3, 1);
  assert.equal(sim.t, 2000);
  // Le pas à pas et la marche normale se combinent.
  sim.avancerJusqua(5000);
  assert.equal(sim.t, 5000);
});

test('chronologie : un état de moins de 5 ms est invisible', () => {
  const journal = [
    { t: 0, broche: 'D3', valeur: 1, type: 'led' },
    { t: 2000, broche: 'D3', valeur: 0, type: 'led' },
    { t: 2001, broche: 'D3', valeur: 1, type: 'led' },
    { t: 3000, broche: 'D3', valeur: 0, type: 'led' },
  ];
  assert.deepEqual(chronologie(journal, 'D3', 0, 0, 4000), [
    { debut: 0, fin: 3000, valeur: 1 },
    { debut: 3000, fin: 4000, valeur: 0 },
  ]);
  assert.deepEqual(chronologie(journal, 'D3', 0, 2500, 2500), [{ debut: 2500, fin: 2500, valeur: 1 }]);
});

test('Blockly : blocs restés seuls hors du programme et entrées vides', () => {
  const sauvegarde = versBlockly(prog([], [si(null, [led('D3', 1)])]));
  sauvegarde.blocks.blocks.push({ type: 'led_etat', id: 'seul', x: 400, y: 40, fields: { ETAT: '1', BROCHE: 'D4' } });
  const { programme, horsProgramme, incomplets } = depuisBlockly(sauvegarde);
  assert.deepEqual(horsProgramme, ['seul']);
  assert.equal(incomplets.length, 1);
  const sim = creerSimulation(programme);
  sim.avancerJusqua(100);
  assert.equal(sim.sorties.D4, undefined, 'le bloc hors du programme est ignoré');
  assert.equal(sim.sorties.D3, undefined, 'une condition vide est fausse');
});

test('l’échec renvoie de quoi rejouer le test à l’écran', () => {
  const r = valider(parId['4'], prog([], [si(appuye('D9'), [led('D3', 1)])]));
  assert.equal(r.reussi, false);
  assert.equal(r.scenario, 0);
  assert.equal(r.entrees.length, 1);
  assert.equal(r.entrees[0].broche, 'D3');
  assert.ok(r.entrees[0].t >= 500 && r.entrees[0].t <= 510);
  assert.ok(r.temps >= 500);
});
