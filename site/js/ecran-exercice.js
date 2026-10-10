// Écran d'exercice : consigne, éditeur, simulateur en direct, vérification.
(function (global) {
  'use strict';

  const A = global.Atelier;
  const $ = (sel, racine) => (racine || document).querySelector(sel);
  const echapper = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // ---------- Taille de l'interface : ×1 jusqu'à 1536×864, puis jusqu'à ×1,25 en 1920×1080 ----------

  function ajusterEchelle() {
    const s = Math.min(1.25, Math.max(1, Math.min(innerWidth / 1536, innerHeight / 864)));
    document.documentElement.style.setProperty('--s', String(s));
    document.documentElement.style.fontSize = 16 * s + 'px';
  }

  // ---------- Consigne ----------

  // Souligne la première apparition de chaque mot du lexique.
  function souligner(texteEchappe, lexique, dejaVus) {
    const formes = [];
    lexique.forEach((entree, i) => (entree.formes || []).forEach((f) => formes.push({ f, i })));
    formes.sort((a, b) => b.f.length - a.f.length);
    if (!formes.length) return texteEchappe;
    const motif = new RegExp(
      '(?<![\\p{L}\\d])(' + formes.map((x) => x.f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?![\\p{L}\\d])',
      'gu',
    );
    return texteEchappe.replace(motif, (m) => {
      const x = formes.find((y) => y.f === m);
      if (!x || dejaVus.has(x.i)) return m;
      dejaVus.add(x.i);
      return `<button type="button" class="mot-cle" data-mot="${x.i}">${m}</button>`;
    });
  }

  function consigneHtml(texte, lexique) {
    const vus = new Set();
    const lignes = texte.split('\n');
    const rendre = (liste) => {
      let html = '';
      let etiquettes = [];
      const vider = () => {
        if (etiquettes.length) html += `<div class="consigne-etiquettes">${etiquettes.join('')}</div>`;
        etiquettes = [];
      };
      for (const l of liste) {
        const contenu = souligner(echapper(l), lexique, vus);
        if (/^\s*-\s/.test(l)) etiquettes.push(`<span class="consigne-etiquette">${contenu}</span>`);
        else {
          vider();
          html += `<p>${contenu}</p>`;
        }
      }
      vider();
      return html;
    };
    // Consigne longue (exercice 13) : deux colonnes, l'affectation des broches à gauche.
    if (texte.length > 300) {
      let coupe = lignes.length;
      for (let i = 1; i < lignes.length; i++) {
        if (/^\s*-\s/.test(lignes[i - 1]) && !/^\s*-\s/.test(lignes[i])) {
          coupe = i;
          break;
        }
      }
      return {
        html: `<div class="consigne-colonnes"><div>${rendre(lignes.slice(0, coupe))}</div><div>${rendre(lignes.slice(coupe))}</div></div>`,
        longue: true,
      };
    }
    return { html: rendre(lignes), longue: false };
  }

  // ---------- Écran ----------

  function demarrer() {
    ajusterEchelle();
    addEventListener('resize', ajusterEchelle);
    for (const el of document.querySelectorAll('[data-icone]')) {
      el.outerHTML = el.dataset.icone === 'lecture' ? A.LECTURE : A.icone(el.dataset.icone, { epaisseur: el.dataset.epaisseur });
    }

    const exercices = A.catalogue.exercices();
    const lexique = A.lexique || [];
    const etat = {
      exercice: null,
      mode: 'arrete', // arrete | marche | pause
      vitesse: 1,
      sim: null,
      servos: {}, // position affichée de chaque servo
      rejeu: null,
      programmes: lireBrouillons(),
    };

    // Équipe (l'accueil arrive à l'étape 5).
    $('.equipe-noms').textContent = 'Équipe d’essai';
    $('.equipe-classe').textContent = '';

    const editeur = A.creerEditeur($('.editeur'), {
      modifie() {
        if (etat.mode !== 'arrete') arreter();
        fermerVerification();
        enregistrerBrouillon();
      },
      zoom(pourcent) {
        $('.zoom-valeur').textContent = pourcent + ' %';
      },
    });
    let vue = null;

    // ----- Chargement d'un exercice -----

    function ouvrir(ex) {
      if (etat.exercice) etat.programmes[etat.exercice.id] = editeur.sauvegarder();
      arreter();
      fermerVerification();
      fermerBulle();
      etat.exercice = ex;
      $('.pastille-exercice').textContent = 'Exercice ' + ex.id;
      $('.titre-exercice').textContent = ex.titre;
      document.title = `Exercice ${ex.id} · ${ex.titre} — Atelier du distributeur`;
      const c = consigneHtml(ex.consigne, lexique);
      $('.consigne-texte').innerHTML = c.html;
      $('.consigne').classList.toggle('longue', c.longue);
      $('.consigne-courte').textContent = ex.consigne.replace(/\s*\n\s*/g, ' ');
      editeur.charger(ex, etat.programmes[ex.id]);
      vue = A.creerVueSimulateur($('.simulateur'), ex, { basculerBouton });
      afficher();
      enregistrerBrouillon();
    }

    // ----- Consigne : réduire / afficher, bulle de définition -----

    $('.consigne-bascule').addEventListener('click', () => {
      const ouverte = !$('.consigne').classList.toggle('reduite');
      const b = $('.consigne-bascule');
      b.setAttribute('aria-expanded', String(ouverte));
      b.innerHTML = A.icone(ouverte ? 'chevronHaut' : 'chevronBas', { epaisseur: 2.8 }) + (ouverte ? 'Réduire' : 'Afficher');
      fermerBulle();
    });

    let motOuvert = null;
    $('.consigne-texte').addEventListener('click', (e) => {
      const mot = e.target.closest('.mot-cle');
      if (!mot) return;
      if (motOuvert === mot.dataset.mot) return fermerBulle();
      motOuvert = mot.dataset.mot;
      const entree = lexique[Number(motOuvert)];
      const bulle = $('.bulle');
      $('.bulle-mot', bulle).textContent = entree.mot;
      $('.bulle-definition', bulle).textContent = entree.definition;
      bulle.hidden = false;
      const zone = $('.zone-consigne').getBoundingClientRect();
      const r = mot.getBoundingClientRect();
      const largeur = bulle.offsetWidth;
      bulle.style.left = Math.max(12, Math.min(r.left - zone.left - 20, zone.width - largeur - 12)) + 'px';
      $('.bulle-fermer', bulle).focus();
    });
    $('.bulle-fermer').addEventListener('click', fermerBulle);
    function fermerBulle() {
      motOuvert = null;
      $('.bulle').hidden = true;
    }
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        fermerBulle();
        fermerVerification();
      }
    });

    // ----- Simulation -----

    function nouvelleSimulation() {
      const { programme } = editeur.lire();
      etat.sim = A.creerSimulation(programme, { composants: etat.exercice.composants });
      etat.servos = {};
      etat.rejeu = null;
      $('.simu-note').textContent = '';
    }

    function lancer() {
      if (etat.mode === 'pause') etat.mode = 'marche';
      else if (etat.mode === 'arrete') {
        nouvelleSimulation();
        etat.mode = 'marche';
      }
      majCommandes();
    }
    function pause() {
      if (etat.mode === 'marche') etat.mode = 'pause';
      majCommandes();
    }
    function recommencer() {
      nouvelleSimulation();
      etat.mode = 'marche';
      majCommandes();
    }
    function arreter() {
      etat.mode = 'arrete';
      etat.sim = null;
      etat.servos = {};
      etat.rejeu = null;
      $('.simu-note').textContent = '';
      majCommandes();
      afficher();
    }

    function basculerBouton(broche) {
      if (etat.rejeu) return;
      if (!etat.sim) {
        // Simulation arrêtée : on garde l'appui, il servira au lancement.
        etat.boutonsAvant = etat.boutonsAvant || {};
        etat.boutonsAvant[broche] = etat.boutonsAvant[broche] ? 0 : 1;
      } else {
        etat.sim.changerEntree(broche, etat.sim.entrees[broche] ? 0 : 1);
      }
      afficher();
    }

    function majCommandes() {
      const marche = etat.mode === 'marche';
      const b = $('.btn-lancer');
      b.classList.toggle('actif', marche);
      b.setAttribute('aria-pressed', String(marche));
      $('.btn-pause').disabled = etat.mode !== 'marche';
      $('.btn-recommencer').disabled = etat.mode === 'arrete';
      for (const v of document.querySelectorAll('.btn-vitesse')) v.setAttribute('aria-pressed', String(Number(v.dataset.vitesse) === etat.vitesse));
    }

    $('.btn-lancer').addEventListener('click', lancer);
    $('.btn-pause').addEventListener('click', pause);
    $('.btn-recommencer').addEventListener('click', recommencer);
    for (const v of document.querySelectorAll('.btn-vitesse')) {
      v.addEventListener('click', () => {
        etat.vitesse = Number(v.dataset.vitesse);
        majCommandes();
      });
    }

    function chrono(ms) {
      const s = Math.floor(ms / 1000);
      return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    }

    function afficher(dtVirtuel) {
      if (!vue) return;
      const sim = etat.sim;
      const etats = {};
      for (const c of etat.exercice.composants) {
        if (c.type === 'bouton') {
          etats[c.broche] = sim ? sim.entrees[c.broche] || 0 : (etat.boutonsAvant && etat.boutonsAvant[c.broche]) || 0;
        } else if (c.type === 'led') {
          etats[c.broche] = sim ? sim.sorties[c.broche] || 0 : 0;
        } else {
          // Le bras du servo tourne à vitesse constante (180° en 0,3 s) vers sa consigne.
          const cible = sim ? sim.sorties[c.broche] || 0 : 0;
          const pos = etat.servos[c.broche] === undefined ? 0 : etat.servos[c.broche];
          const pasMax = (dtVirtuel || 0) * A.VITESSE_SERVO;
          etats[c.broche] = etat.servos[c.broche] = Math.abs(cible - pos) <= pasMax ? cible : pos + Math.sign(cible - pos) * pasMax;
          if (!sim) etats[c.broche] = etat.servos[c.broche] = 0;
        }
      }
      vue.afficher(etats);
      editeur.surligner(sim ? sim.blocEnCours : null);
      $('.chrono-valeur').textContent = chrono(sim ? sim.t : 0);
    }

    let dernier = performance.now();
    function image(maintenant) {
      const dt = Math.min(100, maintenant - dernier);
      dernier = maintenant;
      let dtVirtuel = 0;
      if (etat.mode === 'marche' && etat.sim) {
        if (etat.boutonsAvant) {
          for (const [b, v] of Object.entries(etat.boutonsAvant)) etat.sim.changerEntree(b, v);
          etat.boutonsAvant = null;
        }
        dtVirtuel = dt * etat.vitesse;
        let cible = etat.sim.t + dtVirtuel;
        if (etat.rejeu && cible >= etat.rejeu.fin) {
          cible = etat.rejeu.fin;
          etat.mode = 'pause';
          $('.simu-note').textContent = 'Fin du test : regarde l’état des composants.';
          majCommandes();
        }
        etat.sim.avancerJusqua(cible);
        // Le journal ne sert pas à l'affichage : on évite qu'il grossisse sans fin.
        if (etat.sim.journal.length > 20000) etat.sim.journal.splice(0, 15000);
      }
      if (etat.mode !== 'pause' || dtVirtuel) afficher(dtVirtuel);
      requestAnimationFrame(image);
    }
    requestAnimationFrame(image);

    // ----- Vérification -----

    function verifier() {
      fermerBulle();
      const { programme, horsProgramme, incomplets } = editeur.lire();
      const r = A.valider(etat.exercice, programme);
      const panneau = $('.panneau-verification');
      panneau.classList.toggle('reussi', r.reussi);
      if (r.reussi) {
        const suivant = exercices[exercices.indexOf(etat.exercice) + 1];
        panneau.innerHTML =
          `<div class="verif-titre">${A.icone('coche', { couleur: '#2E7D32', epaisseur: 2.8 })}Ton programme fonctionne.</div>` +
          '<p>Le simulateur fait exactement ce que demande la consigne.</p>' +
          '<div class="verif-actions">' +
          (suivant ? `<button type="button" class="btn-principal btn-suivant">Exercice suivant${A.icone('suivant', { epaisseur: 2.8 })}</button>` : '') +
          '<button type="button" class="btn-secondaire btn-fermer-verif">Fermer</button></div>';
        if (suivant) $('.btn-suivant', panneau).addEventListener('click', () => ouvrir(suivant));
      } else {
        const notes = [];
        if (horsProgramme.length)
          notes.push(
            'Un bloc est resté seul, hors du programme : il ne s’exécute pas. Accroche-le dans « Au démarrage » ou « Répéter indéfiniment ».',
          );
        if (incomplets.length) notes.push('Un bloc a une case vide : complète-la.');
        panneau.innerHTML =
          `<div class="verif-titre">${A.icone('ampoule', { couleur: '#1A6E8E' })}Le test montre une différence</div>` +
          `<p class="verif-message">${echapper(r.message)}</p>` +
          notes.map((n) => `<p class="verif-note">${echapper(n)}</p>`).join('') +
          '<div class="verif-actions">' +
          `<button type="button" class="btn-principal btn-voir-test">${A.icone('oeil')}Voir le test</button>` +
          '<button type="button" class="btn-secondaire btn-fermer-verif">Fermer</button></div>';
        $('.btn-voir-test', panneau).addEventListener('click', () => rejouer(r));
      }
      $('.btn-fermer-verif', panneau).addEventListener('click', fermerVerification);
      panneau.hidden = false;
    }

    // Rejoue le test raté dans le simulateur : les boutons s'appuient tout seuls.
    function rejouer(r) {
      fermerVerification();
      nouvelleSimulation();
      etat.boutonsAvant = null;
      for (const e of r.entrees) etat.sim.planifierEntree(e.t, e.broche, e.valeur);
      etat.rejeu = { fin: r.temps + 600 };
      etat.mode = 'marche';
      $('.simu-note').textContent = 'Le test se rejoue : les boutons s’appuient tout seuls.';
      majCommandes();
    }

    function fermerVerification() {
      $('.panneau-verification').hidden = true;
    }

    $('.btn-verifier').addEventListener('click', verifier);

    // ----- Outils de l'espace de travail -----

    $('.btn-annuler').addEventListener('click', editeur.annuler);
    $('.btn-retablir').addEventListener('click', editeur.retablir);
    $('.btn-zoom-moins').addEventListener('click', () => editeur.zoomer(-1));
    $('.btn-zoom-plus').addEventListener('click', () => editeur.zoomer(1));
    $('.btn-recentrer').addEventListener('click', editeur.recentrer);

    // ----- Aides (étape 4) et enregistrement (étape 5) : pas encore branchés -----

    for (const b of document.querySelectorAll('[data-bientot]')) {
      b.addEventListener('click', () => message(b.dataset.bientot));
    }
    let minuteur = null;
    function message(texte) {
      const t = $('.message-bref');
      t.textContent = texte;
      t.hidden = false;
      clearTimeout(minuteur);
      minuteur = setTimeout(() => (t.hidden = true), 2600);
    }

    // ----- Choix de l'exercice (provisoire, en attendant l'écran Parcours) -----

    const liste = $('.liste-exercices');
    liste.innerHTML = exercices
      .map((ex, i) => `<button type="button" data-i="${i}"><span class="liste-numero">${ex.id}</span>${echapper(ex.titre)}</button>`)
      .join('');
    liste.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-i]');
      if (!b) return;
      $('.dialogue-parcours').close();
      ouvrir(exercices[Number(b.dataset.i)]);
    });
    $('.btn-parcours').addEventListener('click', () => $('.dialogue-parcours').showModal());
    $('.btn-fermer-parcours').addEventListener('click', () => $('.dialogue-parcours').close());

    // ----- Brouillon dans le navigateur (copie de secours) -----

    function lireBrouillons() {
      try {
        return JSON.parse(localStorage.getItem('atelier-cereales-brouillon') || '{}').programmes || {};
      } catch {
        return {};
      }
    }
    function enregistrerBrouillon() {
      try {
        if (etat.exercice) etat.programmes[etat.exercice.id] = editeur.sauvegarder();
        localStorage.setItem(
          'atelier-cereales-brouillon',
          JSON.stringify({ exercice: etat.exercice && etat.exercice.id, programmes: etat.programmes }),
        );
      } catch {
        /* navigation privée ou stockage plein : la copie de secours est simplement ignorée */
      }
    }
    let depart = exercices[0];
    try {
      const id = JSON.parse(localStorage.getItem('atelier-cereales-brouillon') || '{}').exercice;
      depart = exercices.find((e) => e.id === id) || depart;
    } catch {
      /* rien */
    }
    const demande = new URLSearchParams(location.search).get('exercice');
    if (demande) depart = exercices.find((e) => e.id === demande) || depart;

    ouvrir(depart);
    majCommandes();
    A.ecran = { ouvrir, editeur, etat };
  }

  A.demarrerEcranExercice = demarrer;
})(this);
