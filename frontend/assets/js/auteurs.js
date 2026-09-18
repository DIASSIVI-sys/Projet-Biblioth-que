// Ouverture de la modale en mode AJOUT
document.getElementById('btn-ouvrir-modal').addEventListener('click', () => {
  document.getElementById('form-auteur').reset();
  document.getElementById('auteur-id').value = '';
  document.getElementById('modal-titre').innerHTML = '<i class="fa-solid fa-feather"></i> Ajouter un auteur';
  document.getElementById('btn-submit-auteur').innerHTML = '<i class="fa-solid fa-check"></i> Ajouter';
  document.getElementById('auteur-message').textContent = '';
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

// Charger la liste des auteurs
async function chargerAuteurs() {
  try {
    const response = await fetch(`${API_URL}/auteurs`);
    const auteurs = await response.json();

    const tbody = document.getElementById('auteurs-body');
    tbody.innerHTML = '';

    if (auteurs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3">Aucun auteur enregistré</td></tr>';
      return;
    }

    auteurs.forEach(auteur => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${auteur.nom}</td>
        <td>${auteur.nationalite || '-'}</td>
        <td>
          <button onclick='ouvrirModaleModification(${JSON.stringify(auteur)})'><i class="fa-solid fa-pen"></i></button>
          <button onclick="supprimerAuteur(${auteur.id_auteur})"><i class="fa-solid fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Erreur lors du chargement des auteurs', err);
  }
}

// Ouvre la modale en mode MODIFICATION, pré-remplie
function ouvrirModaleModification(auteur) {
  document.getElementById('auteur-id').value = auteur.id_auteur;
  document.getElementById('auteur-nom').value = auteur.nom;
  document.getElementById('auteur-nationalite').value = auteur.nationalite || '';
  document.getElementById('modal-titre').innerHTML = '<i class="fa-solid fa-pen"></i> Modifier l\'auteur';
  document.getElementById('btn-submit-auteur').innerHTML = '<i class="fa-solid fa-check"></i> Enregistrer';
  document.getElementById('auteur-message').textContent = '';
  document.getElementById('modal-overlay').classList.add('modal-ouverte');
}

// Soumission du formulaire — gère AJOUT et MODIFICATION selon la présence de l'id
document.getElementById('form-auteur').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('auteur-id').value;
  const nom = document.getElementById('auteur-nom').value;
  const nationalite = document.getElementById('auteur-nationalite').value;
  const messageEl = document.getElementById('auteur-message');

  const estModification = id !== '';
  const url = estModification ? `${API_URL}/auteurs/${id}` : `${API_URL}/auteurs`;
  const methode = estModification ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method: methode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, nationalite })
    });

    const data = await response.json();

    if (!response.ok) {
      messageEl.textContent = data.message;
      messageEl.className = 'erreur';
      return;
    }

    messageEl.textContent = estModification ? 'Auteur modifié avec succès' : 'Auteur ajouté avec succès';
    messageEl.className = 'succes';
    chargerAuteurs();

    setTimeout(() => {
      document.getElementById('modal-overlay').classList.remove('modal-ouverte');
      document.getElementById('form-auteur').reset();
      messageEl.textContent = '';
    }, 1000);
  } catch (err) {
    messageEl.textContent = "Erreur lors de l'enregistrement";
    messageEl.className = 'erreur';
  }
});

// Supprimer un auteur
async function supprimerAuteur(id) {
  if (!confirm('Supprimer cet auteur ?')) return;

  try {
    const response = await fetch(`${API_URL}/auteurs/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.message);
      return;
    }

    chargerAuteurs();
  } catch (err) {
    alert('Erreur lors de la suppression');
  }
}

// Initialisation
chargerAuteurs();