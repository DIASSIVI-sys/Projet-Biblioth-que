// Charger la liste des livres
async function chargerLivres() {
  try {
    const response = await fetch(`${API_URL}/livres`);
    const livres = await response.json();

    const tbody = document.getElementById('livres-body');
    tbody.innerHTML = '';

    livres.forEach(livre => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${livre.titre}</td>
        <td>${livre.auteur_nom}</td>
        <td>${livre.annee_publication || '-'}</td>
        <td>${livre.statut}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Erreur lors du chargement des livres', err);
  }
}

// Charger les auteurs dans le <select> du formulaire livre
async function chargerAuteursDansSelect() {
  try {
    const response = await fetch(`${API_URL}/auteurs`);
    const auteurs = await response.json();

    const select = document.getElementById('id_auteur');
    select.innerHTML = '<option value="">-- Choisir un auteur --</option>';

    auteurs.forEach(auteur => {
      const option = document.createElement('option');
      option.value = auteur.id_auteur;
      option.textContent = auteur.nom;
      select.appendChild(option);
    });
  } catch (err) {
    console.error('Erreur lors du chargement des auteurs', err);
  }
}

// Soumission du formulaire livre
document.getElementById('form-livre').addEventListener('submit', async (e) => {
  e.preventDefault();

  const titre = document.getElementById('titre').value;
  const annee_publication = document.getElementById('annee_publication').value;
  const id_auteur = document.getElementById('id_auteur').value;
  const messageEl = document.getElementById('livre-message');

  try {
    const response = await fetch(`${API_URL}/livres`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titre, annee_publication, id_auteur })
    });

    const data = await response.json();

    if (!response.ok) {
      messageEl.textContent = data.message;
      messageEl.className = 'erreur';
      return;
    }

    messageEl.textContent = 'Livre ajouté avec succès';
    messageEl.className = 'succes';
    document.getElementById('form-livre').reset();
    chargerLivres(); // recharge la liste pour voir le nouveau livre apparaître
  } catch (err) {
    messageEl.textContent = "Erreur lors de l'ajout du livre";
    messageEl.className = 'erreur';
  }
});

// Initialisation
chargerAuteursDansSelect();
chargerLivres();