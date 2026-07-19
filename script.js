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
