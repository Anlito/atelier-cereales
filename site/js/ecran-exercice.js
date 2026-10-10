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

  // Icônes déclarées dans le HTML par data-icone.
  function poserIcones(racine) {
    for (const el of racine.querySelectorAll('[data-icone]')) {
      el.outerHTML = el.dataset.icone === 'lecture' ? A.LECTURE : A.icone(el.dataset.icone, { epaisseur: el.dataset.epaisseur });
    }
  }

  // session : { donnees (progression de l'équipe), handle (fichier de l'équipe, ou null) }
  function demarrer(session) {
    poserIcones($('.ecran-exercice'));
    $('.ecran-exercice').hidden = false;

    const exercices = A.catalogue.exercices();
    const lexique = A.lexique || [];
    const etat = {
      exercice: null,
      mode: 'arrete', // arrete | marche | pause
      vitesse: 1,
      sim: null,
      servos: {}, // position affichée de chaque servo
      rejeu: null,
      donnees: session.donnees,
      handle: session.handle,
      nonEnregistre: false, // modifications pas encore écrites dans le fichier
    };
    const D = etat.donnees;
    // Mode enseignant provisoire (?enseignant=1) : tous les exercices sont ouverts.
    const toutDebloquer = new URLSearchParams(location.search).has('enseignant');

    $('.equipe-noms').textContent = D.equipe.eleves.join(', ');
    $('.equipe-classe').textContent = D.equipe.classe ? '· ' + D.equipe.classe : '';

    const editeur = A.creerEditeur($('.editeur'), {
      modifie() {
        if (etat.mode !== 'arrete') arreter();
        fermerVerification();
        programmeModifie();
      },
      zoom(pourcent) {
        $('.zoom-valeur').textContent = pourcent + ' %';
      },
    });
    let vue = null;

    // ----- Aides : indices, fiche « À savoir », lexique -----

    const aides = A.creerAides({
      indicesOuverts: () => A.progressionExercice(D, etat.exercice.id).indicesOuverts,
      ouvrirIndice(niveau) {
        A.noterIndice(D, etat.exercice.id, niveau);
        majCompteurIndices();
        aEnregistrer(true);
      },
    });
    function majCompteurIndices() {
      $('.compteur-indices').textContent = A.progressionExercice(D, etat.exercice.id).indicesOuverts + '/3';
    }
    // Mots du lexique déjà rencontrés : ceux des consignes des exercices ouverts par l'équipe.
    function motsVus() {
      const vus = new Set();
      for (const ex of exercices) {
        if (!D.exercices[ex.id]) continue;
        lexique.forEach((entree, i) => {
          if ((entree.formes || []).some((forme) => A.contientMot(ex.consigne, forme))) vus.add(i);
        });
      }
      return vus;
    }
    const lexiqueComplet = A.creerLexique(motsVus);
    $('[data-aide="fiche"]').addEventListener('click', () => {
      fermerVerification();
      aides.fiche();
    });
    $('[data-aide="indice"]').addEventListener('click', () => {
      fermerVerification();
      aides.indice();
    });
    $('.btn-lexique').addEventListener('click', () => lexiqueComplet.ouvrir());

    // ----- Chargement d'un exercice -----

    function ouvrir(ex) {
      if (!A.estDebloque(D, ex.id, { toutDebloquer })) return;
      if (etat.exercice) A.noterProgramme(D, etat.exercice.id, editeur.sauvegarder());
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
      editeur.charger(ex, A.progressionExercice(D, ex.id).programme);
      vue = A.creerVueSimulateur($('.simulateur'), ex, { basculerBouton });
      afficher();
      A.noterOuverture(D, ex.id);
      aides.changerExercice(ex);
      majCompteurIndices();
      aEnregistrer(true);
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
        aides.fermer();
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
      const notes = [];
      if (horsProgramme.length)
        notes.push('Un bloc est resté seul, hors du programme : il ne s’exécute pas. Accroche-le dans « Au démarrage » ou « Répéter indéfiniment ».');
      if (incomplets.length) notes.push('Un bloc a une case vide : complète-la.');
      // L'élève ne voit que le premier écart ; le professeur retrouve tous les écarts dans l'historique.
      const ecarts = r.reussi
        ? []
        : (etat.exercice.scenarios || [])
            .map((sc) => A.jouerScenario(etat.exercice, programme, sc))
            .filter((x) => !x.reussi)
            .map((x) => x.message);
      A.noterProgramme(D, etat.exercice.id, editeur.sauvegarder());
      A.noterVerification(D, etat.exercice.id, { reussi: r.reussi, message: r.message, ecarts, notes, programme });
      aEnregistrer(true);
      const panneau = $('.panneau-verification');
      panneau.classList.toggle('reussi', r.reussi);
      if (r.reussi) {
        const suivant = exercices[exercices.indexOf(etat.exercice) + 1];
        panneau.innerHTML =
          `<div class="verif-titre">${A.icone('coche', { couleur: '#2E7D32', epaisseur: 2.8 })}Ton programme fonctionne.</div>` +
          '<p>Le simulateur fait exactement ce que demande la consigne.</p>' +
          (etat.handle ? '' : '<p class="verif-note">Pense à enregistrer ton travail dans le dossier de ton équipe.</p>') +
          '<div class="verif-actions">' +
          (suivant ? `<button type="button" class="btn-principal btn-suivant">Exercice suivant${A.icone('suivant', { epaisseur: 2.8 })}</button>` : '') +
          '<button type="button" class="btn-secondaire btn-fermer-verif">Fermer</button></div>';
        if (suivant) $('.btn-suivant', panneau).addEventListener('click', () => ouvrir(suivant));
        majParcours();
      } else {
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

    let minuteur = null;
    function message(texte, duree) {
      const t = $('.message-bref');
      t.textContent = texte;
      t.hidden = false;
      clearTimeout(minuteur);
      minuteur = setTimeout(() => (t.hidden = true), duree || 2600);
    }

    // ----- Parcours (provisoire, en attendant l'écran dessiné) : statut et déblocage -----

    const liste = $('.liste-exercices');
    function majParcours() {
      $('.dialogue-avancement').textContent = A.avancement(D) + '/13 exercices réussis';
      liste.innerHTML = exercices
        .map((ex, i) => {
          const p = D.exercices[ex.id];
          const ouvert = A.estDebloque(D, ex.id, { toutDebloquer });
          const statut = !ouvert ? 'verrouille' : p ? p.statut : 'non_commence';
          const symbole = { verrouille: '🔒', reussi: '✓', en_cours: '●', non_commence: '○' }[statut];
          const mot = { verrouille: 'verrouillé', reussi: 'réussi', en_cours: 'en cours', non_commence: 'à faire' }[statut];
          return (
            `<button type="button" data-i="${i}" class="statut-${statut}"${ouvert ? '' : ' disabled'}>` +
            `<span class="liste-numero">${ex.id}</span><span class="liste-titre">${echapper(ex.titre)}</span>` +
            `<span class="liste-statut"><span aria-hidden="true">${symbole}</span> ${mot}</span></button>`
          );
        })
        .join('');
    }
    liste.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-i]');
      if (!b || b.disabled) return;
      $('.dialogue-parcours').close();
      ouvrir(exercices[Number(b.dataset.i)]);
    });
    $('.btn-parcours').addEventListener('click', () => {
      majParcours();
      $('.dialogue-parcours').showModal();
    });
    $('.btn-fermer-parcours').addEventListener('click', () => $('.dialogue-parcours').close());

    // ----- Enregistrement : copie de secours à chaque modification, fichier de l'équipe -----

    let minuteurFichier = null;
    let minuteurSecours = null;
    function programmeModifie() {
      clearTimeout(minuteurSecours);
      minuteurSecours = setTimeout(() => {
        A.noterProgramme(D, etat.exercice.id, editeur.sauvegarder());
        aEnregistrer(false);
      }, 800);
    }

    // Note une modification. Avec le fichier de l'équipe, il est réécrit tout seul (tout de suite, ou après 10 s).
    function aEnregistrer(maintenant) {
      A.fichiers.sauverSecours(D);
      etat.nonEnregistre = true;
      majEtatEnregistrement();
      if (!etat.handle) return;
      clearTimeout(minuteurFichier);
      minuteurFichier = setTimeout(() => enregistrer(true), maintenant ? 0 : 10000);
    }

    let enCours = null;
    async function enregistrer(automatique) {
      if (enCours) return enCours;
      A.noterProgramme(D, etat.exercice.id, editeur.sauvegarder());
      A.fichiers.sauverSecours(D);
      majEtatEnregistrement('…');
      enCours = (async () => {
        try {
          const r = await A.fichiers.enregistrer(D, etat.handle, { silencieux: automatique });
          if (r.ok) {
            if (r.handle && r.handle !== etat.handle) {
              etat.handle = r.handle;
              A.fichiers.memoriserHandle(r.handle);
            }
            etat.nonEnregistre = false;
            etat.dernierEnregistrement = new Date();
            if (r.telecharge) message(`Le fichier « ${A.fichiers.nomFichier(D)} » est dans Téléchargements : range-le dans le dossier de ton équipe.`, 6000);
            else if (!automatique) message('C’est enregistré dans le dossier de ton équipe.');
          }
        } catch {
          if (!automatique) message('L’enregistrement n’a pas marché. Clique encore sur « Enregistrer » et choisis le dossier de ton équipe.', 6000);
          else etat.handle = null;
        } finally {
          enCours = null;
          majEtatEnregistrement();
        }
      })();
      return enCours;
    }
    $('.btn-enregistrer').addEventListener('click', () => enregistrer(false));

    function majEtatEnregistrement(texte) {
      const el = $('.etat-enregistrement');
      if (texte) el.textContent = 'Enregistrement' + texte;
      else if (!etat.nonEnregistre && etat.dernierEnregistrement)
        el.textContent = 'Enregistré à ' + etat.dernierEnregistrement.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      else el.textContent = etat.nonEnregistre ? 'Pas encore enregistré' : '';
      el.classList.toggle('a-faire', !texte && etat.nonEnregistre && !etat.handle);
    }

    // Rappel à la fermeture de l'onglet si le fichier n'est pas à jour.
    addEventListener('beforeunload', (e) => {
      A.noterProgramme(D, etat.exercice.id, editeur.sauvegarder());
      A.fichiers.sauverSecours(D);
      if (etat.nonEnregistre) {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    // Temps passé : seulement l'activité réelle (onglet visible et actif).
    setInterval(() => {
      if (etat.exercice && document.visibilityState === 'visible' && document.hasFocus()) A.ajouterTemps(D, etat.exercice.id, 1);
    }, 1000);

    let depart = exercices.find((e) => e.id === A.exerciceAReprendre(D)) || exercices[0];
    const demande = new URLSearchParams(location.search).get('exercice');
    if (demande && A.estDebloque(D, demande, { toutDebloquer })) depart = exercices.find((e) => e.id === demande) || depart;

    ouvrir(depart);
    majCommandes();
    majEtatEnregistrement();
    A.ecran = { ouvrir, editeur, etat };
  }

  A.demarrerEcranExercice = demarrer;
  A.ajusterEchelle = ajusterEchelle;
  A.poserIcones = poserIcones;
})(this);
