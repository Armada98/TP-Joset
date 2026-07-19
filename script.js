  // ══════════════════════════════════════════════════
  // ── FORMSPREE — ENVOI D'EMAILS ──
  // ══════════════════════════════════════════════════
  // ACTIVATION EN 2 MINUTES :
  //
  // 1. Va sur https://formspree.io et crée un compte gratuit (avec marleyherbelin@gmail.com)
  // 2. Clique "New Form" → donne-lui un nom ex: "Devis TP Joset"
  // 3. Formspree te donne une URL du type : https://formspree.io/f/XXXXXXXX
  // 4. Copie le code XXXXXXXX et remplace VOTRE_CODE_FORMSPREE ci-dessous
  // 5. Confirme ton email via le mail que Formspree t'envoie → c'est bon !
  //
  // Tu recevras tous les devis sur marleyherbelin@gmail.com
  // Le client reçoit automatiquement un email de confirmation
  // ══════════════════════════════════════════════════

  const FORMSPREE_ID = 'xnjepjkb';

  async function envoyerDevis() {
    const prenom     = document.getElementById('f-prenom').value.trim();
    const nom        = document.getElementById('f-nom').value.trim();
    const tel        = document.getElementById('f-tel').value.trim();
    const email      = document.getElementById('f-email').value.trim();
    const prestation = document.getElementById('f-prestation').value;
    const commune    = document.getElementById('f-commune').value.trim();
    const desc       = document.getElementById('f-desc').value.trim();

    // Validation
    if (!prenom || !nom || !tel || !email || !prestation || !desc) {
      alert('Merci de remplir tous les champs obligatoires (*).');
      return;
    }

    const btn = document.getElementById('btn-envoyer');
    btn.textContent = 'Envoi en cours…';
    btn.disabled = true;

    try {
      const res = await fetch('https://formspree.io/f/' + FORMSPREE_ID, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          // Champ spécial Formspree : email de réponse automatique au client
          _replyto: email,
          // Sujet du mail reçu par le chef
          _subject: '📋 Nouveau devis – ' + prenom + ' ' + nom + ' (' + prestation + ')',
          // Données du formulaire
          'Prénom': prenom,
          'Nom': nom,
          'Téléphone': tel,
          'Email client': email,
          'Prestation demandée': prestation,
          'Commune des travaux': commune || 'Non précisée',
          'Description du projet': desc
        })
      });

      if (res.ok) {
        document.getElementById('devis-form').style.display = 'none';
        document.getElementById('devis-succes').style.display = 'block';
        document.getElementById('devis-erreur').style.display = 'none';
      } else {
        throw new Error('Réponse non OK');
      }
    } catch (err) {
      console.error('Formspree error:', err);
      document.getElementById('devis-erreur').style.display = 'block';
      btn.textContent = 'Envoyer ma demande de devis →';
      btn.disabled = false;
    }
  }

  // ── NAVIGATION SPA ──
  function showSection(id) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
    const sec = document.getElementById('section-' + id);
    if (sec) sec.classList.add('active');
    document.querySelectorAll('[data-section="' + id + '"]').forEach(a => a.classList.add('active'));
    window.scrollTo(0, 0);
    if (id === 'carte') initMap();
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      showSection(this.dataset.section);
    });
  });

  // ── CARTE LEAFLET ──
  let mapInitialized = false;

  function initMap() {
    if (mapInitialized) return;
    mapInitialized = true;

    // Coordonnées de Charquemont (25140)
    const lat = 47.2147;
    const lng = 6.8567;

    const map = L.map('map').setView([lat, lng], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(map);

    // Marqueur entreprise
    const icon = L.divIcon({
      className: '',
      html: '<div style="background:#CC1414;width:18px;height:18px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });

    L.marker([lat, lng], { icon })
      .addTo(map)
      .bindPopup('<strong style="font-family:Oswald,sans-serif;font-size:1rem;">TP JOSET</strong><br>Charquemont (25140)<br><em style="font-size:0.8rem;color:#666;">Terrassement & Diagnostic Réseaux</em>')
      .openPopup();

    // Cercle 20 km
    L.circle([lat, lng], {
      radius: 20000,
      color: '#CC1414',
      fillColor: '#CC1414',
      fillOpacity: 0.08,
      weight: 2,
      dashArray: '6 4'
    }).addTo(map);
  }

// ══════════════════════════════════════════════════
// ── ANIMATION DES CHIFFRES (compteurs) ──
// ══════════════════════════════════════════════════
let statsAnimated = false;

function animerChiffres() {
  if (statsAnimated) return;
  statsAnimated = true;

  document.querySelectorAll('.count-up').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duree = 1600; // ms
    const debut = performance.now();

    function step(now) {
      const progression = Math.min((now - debut) / duree, 1);
      // easing : démarre vite, ralentit à la fin
      const eased = 1 - Math.pow(1 - progression, 3);
      el.textContent = Math.round(eased * target);
      if (progression < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// Lancer l'animation au chargement de la page (section accueil active par défaut)
window.addEventListener('load', animerChiffres);

// ══════════════════════════════════════════════════
// ── CALCULATEUR D'ESTIMATION ──
// ══════════════════════════════════════════════════
// ⚠️ TARIFS INDICATIFS — À FAIRE VALIDER PAR LE CHEF !
// Fourchettes en € par m² (min et max)
const TARIFS = {
  terrassement: { min: 25,  max: 60,  unite: 'm²', label: 'Terrassement / décaissement' },
  fondations:   { min: 100, max: 200, unite: 'm²', label: 'Fondations' },
  drainage:     { min: 30,  max: 70,  unite: 'm²', label: 'Drainage' },
  voirie:       { min: 40,  max: 90,  unite: 'm²', label: 'Voirie / accès privé' },
  diagnostic:   { min: 3,   max: 8,   unite: 'm²', label: 'Diagnostic réseaux' }
};

// Coefficient selon l'accès
const COEF_ACCES = { facile: 1, moyen: 1.15, difficile: 1.35 };

function calculerEstimation() {
  const type    = document.getElementById('estim-type').value;
  const surface = parseFloat(document.getElementById('estim-surface').value);
  const acces   = document.getElementById('estim-acces').value;
  const zone    = document.getElementById('estim-resultat');

  if (!type || !surface || surface <= 0) {
    zone.innerHTML = '<div class="estim-resultat-vide"><div style="font-size:2.5rem;margin-bottom:12px;">🧮</div><p>Remplissez les champs pour voir votre estimation</p></div>';
    return;
  }

  const t = TARIFS[type];
  const coef = COEF_ACCES[acces];
  const min = Math.round(t.min * surface * coef);
  const max = Math.round(t.max * surface * coef);

  const fmt = n => n.toLocaleString('fr-FR');

  zone.innerHTML = `
    <div class="estim-prix">
      <div class="estim-prix-label">Estimation pour ${t.label}</div>
      <div class="estim-prix-valeur">${fmt(min)} € – ${fmt(max)} €</div>
      <div class="estim-prix-detail">${surface} m² · Accès ${acces} · Fourchette indicative TTC</div>
      <a href="#" class="btn-rouge nav-link" data-section="devis" onclick="event.preventDefault(); showSection('devis');">Obtenir mon devis précis →</a>
    </div>
  `;
}

// ══════════════════════════════════════════════════
// ── SUIVI DE CHANTIER ──
// ══════════════════════════════════════════════════
// DONNÉES DE DÉMONSTRATION — à remplacer par les vrais chantiers
// Pour ajouter un chantier : copier un bloc et changer les infos
const CHANTIERS = {
  'TPJ-2025-001': {
    nom: 'Terrassement maison neuve',
    lieu: 'Maîche (25120)',
    progression: 65,
    etapes: [
      { titre: 'Devis validé',            desc: 'Signature du devis et planification',        date: '02/06/2025', statut: 'fait' },
      { titre: 'Diagnostic réseaux',      desc: 'Détection et marquage des réseaux enterrés', date: '10/06/2025', statut: 'fait' },
      { titre: 'Décaissement',            desc: 'Décaissement du terrain sur 40 cm',          date: '18/06/2025', statut: 'fait' },
      { titre: 'Fondations',              desc: 'Coulage des fondations filantes',            date: 'En cours',   statut: 'encours' },
      { titre: 'Remblai & finitions',     desc: 'Remblai périphérique et nivellement final',  date: 'À venir',    statut: 'avenir' }
    ]
  },
  'TPJ-2025-002': {
    nom: 'Drainage terrain',
    lieu: 'Charquemont (25140)',
    progression: 30,
    etapes: [
      { titre: 'Devis validé',        desc: 'Signature du devis et planification',       date: '01/07/2025', statut: 'fait' },
      { titre: 'Diagnostic réseaux',  desc: 'Vérification des réseaux existants',        date: 'En cours',   statut: 'encours' },
      { titre: 'Tranchées',           desc: 'Creusement des tranchées de drainage',      date: 'À venir',    statut: 'avenir' },
      { titre: 'Pose des drains',     desc: 'Pose des drains et géotextile',             date: 'À venir',    statut: 'avenir' },
      { titre: 'Remblai',             desc: 'Remblai gravier et remise en état',         date: 'À venir',    statut: 'avenir' }
    ]
  }
};

function chercherChantier() {
  const code = document.getElementById('suivi-code').value.trim().toUpperCase();
  const resultat = document.getElementById('suivi-resultat');
  const introuvable = document.getElementById('suivi-introuvable');

  const chantier = CHANTIERS[code];

  if (!chantier) {
    resultat.style.display = 'none';
    introuvable.style.display = 'block';
    return;
  }

  introuvable.style.display = 'none';

  document.getElementById('suivi-nom').textContent = chantier.nom;
  document.getElementById('suivi-lieu').textContent = '📍 ' + chantier.lieu + ' — Code : ' + code;
  document.getElementById('suivi-pct').textContent = chantier.progression + '%';

  const icones = { fait: '✓', encours: '⏳', avenir: '○' };

  document.getElementById('suivi-etapes').innerHTML = chantier.etapes.map(e => `
    <div class="suivi-etape ${e.statut}">
      <div class="suivi-etape-icone">${icones[e.statut]}</div>
      <div>
        <div class="suivi-etape-titre">${e.titre}</div>
        <div class="suivi-etape-desc">${e.desc}</div>
      </div>
      <div class="suivi-etape-date">${e.date}</div>
    </div>
  `).join('');

  resultat.style.display = 'block';

  // Animer la barre de progression
  const barre = document.getElementById('suivi-barre');
  barre.style.width = '0%';
  setTimeout(() => { barre.style.width = chantier.progression + '%'; }, 50);
}

// Permettre la touche Entrée dans le champ code
document.addEventListener('DOMContentLoaded', () => {
  const champCode = document.getElementById('suivi-code');
  if (champCode) {
    champCode.addEventListener('keydown', e => {
      if (e.key === 'Enter') chercherChantier();
    });
  }
});
