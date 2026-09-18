let pageCourante = 1;
const limiteParPage = 5;

// Charger la liste des livres (avec recherche + pagination)
async function chargerLivres() {
  try {
    const recherche = document.getElementById('recherche').value;
    let url = `${API_URL}/livres?page=${pageCourante}&limit=${limiteParPage}`;
    if (recherche) {
      url += `&recherche=${encodeURIComponent(recherche)}`;
    }

    const response = await fetch(url);
    const livres = await response.json();

    const tbody = document.getElementById('livres-body');
    tbody.innerHTML = '';

    if (livres.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">Aucun livre trouvé</td></tr>';
      return;
    }

    livres.forEach(livre => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${livre.titre}</td>
        <td>${livre.auteur_nom}</td>
        <td>${livre.annee_publication || '-'}</td>
        <td>${livre.statut}</td>
        <td>
          <button onclick="modifierLivre(${livre.id_livre})">Modifier</button>
          <button onclick="supprimerLivre(${livre.id_livre})">Supprimer</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById('page-actuelle').textContent = `Page ${pageCourante}`;
  } catch (err) {
    console.error('Erreur lors du chargement des livres', err);
  }
}

// Charger les auteurs dans le select du formulaire livre
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
    chargerLivres();
  } catch (err) {
    messageEl.textContent = "Erreur lors de l'ajout du livre";
    messageEl.className = 'erreur';
  }
});

// Modifier un livre
async function modifierLivre(id) {
  const nouveauTitre = prompt('Nouveau titre :');
  if (!nouveauTitre) return;
  const nouvelleAnnee = prompt('Nouvelle année de publication :');
  const nouvelIdAuteur = prompt('Nouvel id_auteur :');

  try {
    const response = await fetch(`${API_URL}/livres/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titre: nouveauTitre,
        annee_publication: nouvelleAnnee,
        id_auteur: nouvelIdAuteur
      })
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.message);
      return;
    }

    chargerLivres();
  } catch (err) {
    alert('Erreur lors de la modification');
  }
}

// Supprimer un livre
async function supprimerLivre(id) {
  if (!confirm('Supprimer ce livre ?')) return;

  try {
    const response = await fetch(`${API_URL}/livres/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.message);
      return;
    }

    chargerLivres();
  } catch (err) {
    alert('Erreur lors de la suppression');
  }
}

// Recherche
document.getElementById('btn-recherche').addEventListener('click', () => {
  pageCourante = 1;
  chargerLivres();
});

// Pagination
document.getElementById('btn-precedent').addEventListener('click', () => {
  if (pageCourante > 1) {
    pageCourante--;
    chargerLivres();
  }
});

document.getElementById('btn-suivant').addEventListener('click', () => {
  pageCourante++;
  chargerLivres();
});

// Initialisation
chargerAuteursDansSelect();
chargerLivres();