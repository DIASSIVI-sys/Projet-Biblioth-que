let pageCourante = 1;
const limiteParPage = 5;

// Ouverture modale en mode AJOUT
document.getElementById('btn-ouvrir-modal').addEventListener('click', () => {
  document.getElementById('form-livre').reset();
  document.getElementById('livre-id').value = '';
  document.getElementById('modal-titre').innerHTML = '<i class="fa-solid fa-book"></i> Ajouter un livre';
  document.getElementById('btn-submit-livre').innerHTML = '<i class="fa-solid fa-check"></i> Ajouter';
  document.getElementById('livre-message').textContent = '';
  document.getElementById('modal-overlay').classList.add('modal-ouverte');
});

document.getElementById('btn-fermer-modal').addEventListener('click', () => {
  document.getElementById('modal-overlay').classList.remove('modal-ouverte');
});

document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target.id === 'modal-overlay') {
    document.getElementById('modal-overlay').classList.remove('modal-ouverte');
  }
});

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
      const statutHtml = livre.statut === 'disponible'
        ? '<span class="badge-cours"><i class="fa-solid fa-circle-check"></i> disponible</span>'
        : '<span class="badge-retard"><i class="fa-solid fa-circle-xmark"></i> emprunté</span>';

      tr.innerHTML = `
        <td>${livre.titre}</td>
        <td>${livre.auteur_nom}</td>
        <td>${livre.annee_publication || '-'}</td>
        <td>${statutHtml}</td>
        <td>
          <button onclick='ouvrirModaleModification(${JSON.stringify(livre)})'><i class="fa-solid fa-pen"></i></button>
          <button onclick="supprimerLivre(${livre.id_livre})"><i class="fa-solid fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById('page-actuelle').textContent = `Page ${pageCourante}`;
  } catch (err) {
    console.error('Erreur lors du chargement des livres', err);
  }
}

// Charger les auteurs dans le select du formulaire
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

// Ouvre la modale en mode MODIFICATION, pré-remplie
function ouvrirModaleModification(livre) {
  document.getElementById('livre-id').value = livre.id_livre;
  document.getElementById('titre').value = livre.titre;
  document.getElementById('annee_publication').value = livre.annee_publication || '';
  document.getElementById('id_auteur').value = livre.id_auteur;
  document.getElementById('modal-titre').innerHTML = '<i class="fa-solid fa-pen"></i> Modifier le livre';
  document.getElementById('btn-submit-livre').innerHTML = '<i class="fa-solid fa-check"></i> Enregistrer';
  document.getElementById('livre-message').textContent = '';
  document.getElementById('modal-overlay').classList.add('modal-ouverte');
}

// Soumission du formulaire — gère AJOUT et MODIFICATION selon la présence de l'id
document.getElementById('form-livre').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('livre-id').value;
  const titre = document.getElementById('titre').value;
  const annee_publication = document.getElementById('annee_publication').value;
  const id_auteur = document.getElementById('id_auteur').value;
  const messageEl = document.getElementById('livre-message');

  const estModification = id !== '';
  const url = estModification ? `${API_URL}/livres/${id}` : `${API_URL}/livres`;
  const methode = estModification ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method: methode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titre, annee_publication, id_auteur })
    });

    const data = await response.json();

    if (!response.ok) {
      messageEl.textContent = data.message;
      messageEl.className = 'erreur';
      return;
    }

    messageEl.textContent = estModification ? 'Livre modifié avec succès' : 'Livre ajouté avec succès';
    messageEl.className = 'succes';
    chargerLivres();

    setTimeout(() => {
      document.getElementById('modal-overlay').classList.remove('modal-ouverte');
      document.getElementById('form-livre').reset();
      messageEl.textContent = '';
    }, 1000);
  } catch (err) {
    messageEl.textContent = "Erreur lors de l'enregistrement";
    messageEl.className = 'erreur';
  }
});

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