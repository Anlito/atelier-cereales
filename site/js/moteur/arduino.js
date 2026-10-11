// Traduction d'un programme simplifié (les blocs) en programme Arduino (C++), pour la carte Uno.
// Sert à compiler le programme du distributeur envoyé dans la carte à la fin du parcours
// (tools/firmware.js), à partir de la solution de référence : même comportement que le simulateur.
//
// Choix électriques (modules de la classe) :
//   - LED : sortie numérique, HAUT = allumée ;
//   - bouton : module bouton (avec sa résistance), entrée numérique, HAUT = appuyé ;
//   - servo-moteur : bibliothèque Servo, angle borné à 0–180.

(function (global) {
  'use strict';

  const numero = (broche) => {
    const n = Number(String(broche).replace(/^D/, ''));
    if (!Number.isInteger(n) || n < 0 || n > 19) throw new Error('Broche inconnue : ' + broche);
    return n;
  };

  function versArduino(programme, options) {
    const o = options || {};
    const leds = new Set();
    const boutons = new Set();
    const servos = new Set();
    let variable = false;

    function parcourir(x) {
      if (!x || typeof x !== 'object') return;
      if (Array.isArray(x)) return x.forEach(parcourir);
      if (x.bloc === 'led_etat') leds.add(numero(x.broche));
      if (x.bloc === 'bouton_etat') boutons.add(numero(x.broche));
      if (x.bloc === 'servo_angle') servos.add(numero(x.broche));
      if (x.bloc === 'variable' || x.bloc === 'affecter') variable = true;
      for (const v of Object.values(x)) if (v && typeof v === 'object') parcourir(v);
    }
    parcourir(programme);

    const nombre = (n) => {
      const v = Number(n) || 0;
      return Number.isInteger(v) ? String(v) : String(v);
    };
    function expression(e) {
      if (e === null || e === undefined) return '0';
      if (typeof e === 'number') return nombre(e);
      switch (e.bloc) {
        case 'nombre':
          return nombre(e.valeur);
        case 'variable':
          return 'CHOIX';
        case 'bouton_etat':
          return `digitalRead(${numero(e.broche)})`;
        case 'valeur_haut_bas':
          return e.valeur ? 'HIGH' : 'LOW';
        case 'comparaison':
          return `(${expression(e.a)} ${e.op === '≠' ? '!=' : '=='} ${expression(e.b)})`;
        default:
          return '0';
      }
    }

    function instructions(liste, retrait) {
      const r = ' '.repeat(retrait);
      let s = '';
      for (const i of liste || []) {
        switch (i.bloc) {
          case 'led_etat':
            s += `${r}digitalWrite(${numero(i.broche)}, ${i.etat ? 'HIGH' : 'LOW'});\n`;
            break;
          case 'attendre':
            s += `${r}attendre(${expression(i.duree)});\n`;
            break;
          case 'servo_angle':
            s += `${r}servo${numero(i.broche)}.write(constrain((int)(${expression(i.angle)}), 0, 180));\n`;
            break;
          case 'affecter':
            s += `${r}CHOIX = ${expression(i.valeur)};\n`;
            break;
          case 'si_alors':
          case 'si_sinon':
            s += `${r}if (${expression(i.condition)}) {\n${instructions(i.alors, retrait + 2)}${r}}`;
            if (i.bloc === 'si_sinon') s += ` else {\n${instructions(i.sinon, retrait + 2)}${r}}`;
            s += '\n';
            break;
          default:
            break;
        }
      }
      return s;
    }

    const trier = (e) => [...e].sort((a, b) => a - b);
    let c = `// ${o.titre || 'Programme'} — généré par l'atelier du distributeur de céréales.\n`;
    c += '// LED : HAUT = allumée. Bouton (module) : HAUT = appuyé. Servo : 0° à 180°.\n';
    if (servos.size) c += '#include <Servo.h>\n';
    c += '\n';
    for (const n of trier(servos)) c += `Servo servo${n};\n`;
    if (variable) c += 'float CHOIX = 0;\n';
    c += '\n// « attendre » en secondes (les nombres à virgule sont acceptés).\n';
    c += 'void attendre(float secondes) {\n  if (secondes > 0) delay((unsigned long)(secondes * 1000.0));\n}\n\n';
    c += 'void setup() {\n';
    for (const n of trier(leds)) c += `  pinMode(${n}, OUTPUT);\n  digitalWrite(${n}, LOW);\n`;
    for (const n of trier(boutons)) c += `  pinMode(${n}, INPUT);\n`;
    // Angle de départ : le premier angle fixe donné dans « Au démarrage », réglé AVANT d'activer le servo
    // (sinon la trappe s'ouvrirait un instant à 0° à chaque démarrage) ; 0° sinon, comme le simulateur.
    for (const n of trier(servos)) {
      const premier = (programme.demarrage || []).find((i) => i.bloc === 'servo_angle' && numero(i.broche) === n);
      const angle = premier && (typeof premier.angle === 'number' || (premier.angle && premier.angle.bloc === 'nombre')) ? expression(premier.angle) : '0';
      c += `  servo${n}.write(${angle});\n  servo${n}.attach(${n});\n`;
    }
    c += instructions(programme.demarrage, 2);
    c += '}\n\nvoid loop() {\n';
    c += instructions(programme.boucle, 2);
    // Un tour de boucle dure au moins 1 ms, comme dans le simulateur.
    c += '  delay(1);\n}\n';
    return c;
  }

  const api = { versArduino };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else Object.assign((global.Atelier = global.Atelier || {}), api);
})(this);
