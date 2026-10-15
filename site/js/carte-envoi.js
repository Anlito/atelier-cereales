// Envoi du programme du distributeur dans la vraie carte Arduino, pour tester la maquette câblée.
// Le programme envoyé est celui de la solution de référence (13A, ou 13B si le défi est réussi) :
// le programme de l'équipe a réussi les mêmes tests, il fait la même chose sur la maquette.
(function (global) {
  'use strict';

  const A = global.Atelier;
  const $ = (sel, racine) => (racine || document).querySelector(sel);

  const reussi = (D, id) => !!(D.exercices[id] && D.exercices[id].statut === 'reussi');

  // Version à envoyer : 13B si le défi est réussi, sinon 13A ; null si l'exercice 13 n'est pas réussi.
  function versionPossible(D, lecture) {
    if (reussi(D, '13B')) return '13B';
    if (reussi(D, '13A')) return '13A';
    return lecture ? '13A' : null; // mode enseignant : toujours possible
  }

  // Le programme compilé correspond-il encore à l'exercice (solution et broches) ? Sans empreinte : on ne sait pas, on envoie.
  function aJour(version) {
    const ex = A.catalogue.exercices().find((e) => e.id === version);
    const attendu = A.empreintesCarte && A.empreintesCarte[version];
    return !ex || !attendu || A.empreinteCarte(ex) === attendu;
  }

  let dialogue = null;
  function creerDialogue() {
    if (dialogue) return dialogue;
    dialogue = document.createElement('dialog');
    dialogue.className = 'dialogue-carte';
    dialogue.setAttribute('aria-labelledby', 'titre-carte');
    dialogue.innerHTML =
      '<div class="dialogue-entete"><strong id="titre-carte">Envoyer le programme dans la carte Arduino</strong>' +
      '<button type="button" class="btn-fermer-carte" aria-label="Fermer">×</button></div>' +
      '<div class="carte-corps"></div>';
    document.body.appendChild(dialogue);
    $('.btn-fermer-carte', dialogue).addEventListener('click', () => {
      if (!dialogue.classList.contains('en-cours')) dialogue.close();
    });
    dialogue.addEventListener('cancel', (e) => {
      if (dialogue.classList.contains('en-cours')) e.preventDefault();
    });
    return dialogue;
  }

  // session : la session de l'équipe (donnees, lecture, aEnregistrer).
  // options.vierge : envoyer le programme vierge (protocole de démontage du tutoriel de câblage).
  function ouvrir(session, options) {
    const D = session.donnees;
    const d = creerDialogue();
    const corps = $('.carte-corps', d);
    const vierge = !!(options && options.vierge);
    $('#titre-carte', d).textContent = vierge ? 'Vider la carte Arduino' : 'Envoyer le programme dans la carte Arduino';
    const version = vierge ? 'vierge' : versionPossible(D, session.lecture);
    const programmes = A.programmesCarte || {};

    if (!A.flasher || !A.flasher.disponible()) {
      corps.innerHTML =
        '<p class="carte-alerte">L’envoi dans la carte fonctionne avec <strong>Chrome</strong> ou <strong>Edge</strong>. ' +
        'Ouvre l’atelier avec l’un de ces navigateurs (ton travail est dans le fichier de ton équipe).</p>';
      return d.showModal();
    }
    if (!version || !programmes[version]) {
      corps.innerHTML = '<p class="carte-alerte">Réussis d’abord l’exercice 13 : le programme du distributeur pourra ensuite aller dans la carte.</p>';
      return d.showModal();
    }
    if (!vierge && !aJour(version)) {
      corps.innerHTML =
        '<p class="carte-alerte">L’exercice 13 a été modifié par ton professeur : le programme prêt pour la carte correspond à l’ancienne version. ' +
        'Demande à ton professeur de mettre à jour le programme de la carte.</p>';
      return d.showModal();
    }

    corps.innerHTML =
      (vierge
        ? '<p>Protocole de démontage : envoie un <strong>programme vierge</strong> dans la carte. Elle ne commandera plus rien, ' +
          'tu pourras ensuite débrancher délicatement les câbles et les composants.</p>'
        : `<p>Ton programme du distributeur a réussi tous les tests${version === '13B' ? ', défi compris' : ''}. ` +
          'Envoie-le dans la carte pour tester <strong>ta maquette</strong>.</p>') +
      '<ol class="carte-etapes">' +
      '<li>Branche la carte Arduino à l’ordinateur avec le <strong>câble USB</strong>.</li>' +
      '<li>Clique sur <strong>« Envoyer »</strong>. Dans la fenêtre, choisis la carte (son nom contient souvent « USB » ou « Arduino »), puis clique sur <strong>« Connexion »</strong>.</li>' +
      '<li>Attends la fin (une dizaine de secondes) <strong>sans débrancher</strong> le câble.</li>' +
      '</ol>' +
      (session.lecture && !vierge
        ? '<label class="carte-version">Version : <select class="choix-version"><option value="13A">13A</option><option value="13B">13B (défi)</option></select></label>'
        : '') +
      '<div class="carte-progression" hidden><div class="barre"><span></span></div><p class="carte-phase" aria-live="polite"></p></div>' +
      '<p class="carte-resultat" role="status" hidden></p>' +
      '<div class="accueil-actions"><button type="button" class="btn-principal btn-envoyer-carte">Envoyer</button></div>';
    if (session.lecture && !vierge) $('.choix-version', corps).value = version;

    $('.btn-envoyer-carte', corps).addEventListener('click', async () => {
      const choix = session.lecture && !vierge ? $('.choix-version', corps).value : version;
      let port;
      try {
        port = await navigator.serial.requestPort();
      } catch {
        return; // fenêtre fermée sans choisir de carte
      }
      const bouton = $('.btn-envoyer-carte', corps);
      const progression = $('.carte-progression', corps);
      const resultat = $('.carte-resultat', corps);
      bouton.disabled = true;
      resultat.hidden = true;
      progression.hidden = false;
      d.classList.add('en-cours');
      const PHASES = { connexion: 'Connexion à la carte…', ecriture: 'Envoi du programme…', verification: 'Vérification…', fin: 'Terminé.' };
      let r;
      try {
        const image = A.flasher.parseHex(programmes[choix]);
        r = await A.flasher.flashFirmware(port, image, {
          onProgress({ phase, fraction }) {
            const part = phase === 'connexion' ? 0 : phase === 'ecriture' ? fraction * 0.7 : phase === 'verification' ? 0.7 + fraction * 0.3 : 1;
            $('.barre > span', progression).style.width = Math.round(part * 100) + '%';
            $('.carte-phase', progression).textContent = PHASES[phase] || '';
          },
        });
      } catch (e) {
        r = { ok: false, error: A.flasher.FLASH_MSG.badFile };
      }
      d.classList.remove('en-cours');
      bouton.disabled = false;
      resultat.hidden = false;
      resultat.className = 'carte-resultat ' + (r.ok ? 'juste' : 'erreur');
      if (r.ok && vierge) {
        resultat.innerHTML = '<strong>C’est fait !</strong> La carte est vide. Tu peux débrancher le câble USB, puis démonter délicatement ta maquette.';
        bouton.textContent = 'Envoyer à nouveau';
      } else if (r.ok) {
        resultat.innerHTML =
          '<strong>C’est fait !</strong> Le programme du distributeur est dans la carte. Appuie sur les boutons de ta maquette pour la tester. ' +
          'Si quelque chose ne marche pas, vérifie le câblage (onglet <strong>Câblage</strong> du carnet).';
        bouton.textContent = 'Envoyer à nouveau';
      } else {
        resultat.textContent = r.error;
        bouton.textContent = 'Réessayer';
      }
      // Gardé dans le fichier de l'équipe, pour le professeur.
      D.envoisCarte = D.envoisCarte || [];
      D.envoisCarte.push({ date: A.horodatage(), version: choix, reussi: !!r.ok });
      session.aEnregistrer(true, true);
    });
    d.showModal();
  }

  A.envoiCarte = { ouvrir, versionPossible, aJour };
})(this);
