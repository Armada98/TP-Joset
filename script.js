  // ══════════════════════════════════════════════════
  // ── FORMSPREE — ENVOI D'EMAILS ──
  // ══════════════════════════════════════════════════
  // ACTIVATION EN 2 MINUTES :
  //
  // 1. Va sur https://formspree.io et crée un compte gratuit (avec marleyherbelin@gmail.com)
  // 2. Clique "New Form" → donne-lui un nom ex: "Devis Joset TP"
  // 3. Formspree te donne une URL du type : https://formspree.io/f/XXXXXXXX
  // 4. Copie le code XXXXXXXX et remplace VOTRE_CODE_FORMSPREE ci-dessous
  // 5. Confirme ton email via le mail que Formspree t'envoie → c'est bon !
  //
  // Tu recevras tous les devis sur marleyherbelin@gmail.com
  // Le client reçoit automatiquement un email de confirmation
  // ══════════════════════════════════════════════════

  const FORMSPREE_ID = 'xlgqpqbo';

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

    // Coordonnées : 4 rue Lamarck, 25140 Charquemont
    const lat = 47.21105;
    const lng = 6.83430;

    const map = L.map('map').setView([lat, lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);

    // Marqueur entreprise
    const icon = L.divIcon({
      className: '',
      html: '<div style="background:#E87422;width:18px;height:18px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });

    // Lien itinéraire Google Maps basé sur l'adresse texte (précis même si le point est approximatif)
    const itineraire = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent('4 rue Lamarck, 25140 Charquemont');

    L.marker([lat, lng], { icon })
      .addTo(map)
      .bindPopup(
        '<strong style="font-family:Oswald,sans-serif;font-size:1rem;">JOSET TP</strong><br>' +
        '4 rue Lamarck<br>25140 Charquemont<br>' +
        '<em style="font-size:0.8rem;color:#666;">Terrassement · VRD · Aménagement</em><br>' +
        '<a href="' + itineraire + '" target="_blank" style="display:inline-block;margin-top:8px;background:#E87422;color:#fff;padding:5px 12px;border-radius:3px;text-decoration:none;font-family:Oswald,sans-serif;font-size:0.82rem;letter-spacing:0.05em;">🧭 Itinéraire</a>'
      )
      .openPopup();

    // Cercle 20 km
    L.circle([lat, lng], {
      radius: 20000,
      color: '#E87422',
      fillColor: '#E87422',
      fillOpacity: 0.08,
      weight: 2,
      dashArray: '6 4'
    }).addTo(map);

    // Ajuster la vue pour montrer tout le cercle de 20 km
    map.fitBounds(L.latLng(lat, lng).toBounds(44000));
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
