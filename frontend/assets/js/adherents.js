// Ouverture modale en mode AJOUT
document.getElementById('btn-ouvrir-modal').addEventListener('click', () => {
  document.getElementById('form-adherent').reset();
  document.getElementById('adherent-id').value = '';
  document.getElementById('modal-titre').innerHTML = '<i class="fa-solid fa-user-plus"></i> Ajouter un adhérent';
  document.getElementById('btn-submit-adherent').innerHTML = '<i class="fa-solid fa-check"></i> Ajouter';
  document.getElementById('form-message').textContent = '';
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

// Charger la liste des adhérents
async function chargerAdherents() {
  try {
    const response = await fetch(`${API_URL}/adherents`);
    const adherents = await response.json();

    const tbody = document.getElementById('adherents-body');
    tbody.innerHTML = '';

    if (adherents.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3">Aucun adhérent enregistré</td></tr>';
      return;
    }

    adherents.forEach(adherent => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${adherent.nom}</td>
        <td>${adherent.contact || '-'}</td>
        <td>
          <button onclick='voirHistorique(${adherent.id_adherent}, "${adherent.nom}")'><i class="fa-solid fa-clock-rotate-left"></i></button>
          <button onclick='ouvrirModaleModification(${JSON.stringify(adherent)})'><i class="fa-solid fa-pen"></i></button>
          <button onclick="supprimerAdherent(${adherent.id_adherent})"><i class="fa-solid fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Erreur lors du chargement des adhérents', err);
  }
}

// Ouvre la modale en mode MODIFICATION, pré-remplie
function ouvrirModaleModification(adherent) {
  document.getElementById('adherent-id').value = adherent.id_adherent;
  document.getElementById('nom').value = adherent.nom;
  document.getElementById('contact').value = adherent.contact || '';
  document.getElementById('modal-titre').innerHTML = '<i class="fa-solid fa-pen"></i> Modifier l\'adhérent';
  document.getElementById('btn-submit-adherent').innerHTML = '<i class="fa-solid fa-check"></i> Enregistrer';
  document.getElementById('form-message').textContent = '';
  document.getElementById('modal-overlay').classList.add('modal-ouverte');
}

// Soumission du formulaire — gère AJOUT et MODIFICATION selon la présence de l'id
document.getElementById('form-adherent').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('adherent-id').value;
  const nom = document.getElementById('nom').value;
  const contact = document.getElementById('contact').value;
  const messageEl = document.getElementById('form-message');

  const estModification = id !== '';
  const url = estModification ? `${API_URL}/adherents/${id}` : `${API_URL}/adherents`;
  const methode = estModification ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method: methode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, contact })
    });

    const data = await response.json();

    if (!response.ok) {
      messageEl.textContent = data.message;
      messageEl.className = 'erreur';
      return;
    }

    messageEl.textContent = estModification ? 'Adhérent modifié avec succès' : 'Adhérent ajouté avec succès';
    messageEl.className = 'succes';
    chargerAdherents();

    setTimeout(() => {
      document.getElementById('modal-overlay').classList.remove('modal-ouverte');
      document.getElementById('form-adherent').reset();
      messageEl.textContent = '';
    }, 1000);
  } catch (err) {
    messageEl.textContent = "Erreur lors de l'enregistrement";
    messageEl.className = 'erreur';
  }
});

// Supprimer un adhérent
async function supprimerAdherent(id) {
  if (!confirm('Supprimer cet adhérent ?')) return;

  try {
    const response = await fetch(`${API_URL}/adherents/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.message);
      return;
    }

    chargerAdherents();
  } catch (err) {
    alert('Erreur lors de la suppression');
  }
}

// Fermeture de la modale historique
document.getElementById('btn-fermer-historique').addEventListener('click', () => {
  document.getElementById('modal-historique-overlay').classList.remove('modal-ouverte');
});

document.getElementById('modal-historique-overlay').addEventListener('click', (e) => {
  if (e.target.id === 'modal-historique-overlay') {
    document.getElementById('modal-historique-overlay').classList.remove('modal-ouverte');
  }
});

// Afficher l'historique des emprunts d'un adhérent
async function voirHistorique(id, nom) {
  try {
    const response = await fetch(`${API_URL}/adherents/${id}/emprunts`);
    const emprunts = await response.json();

    document.getElementById('historique-titre').innerHTML =
      `<i class="fa-solid fa-clock-rotate-left"></i> Historique — ${nom}`;

    const tbody = document.getElementById('historique-body');
    tbody.innerHTML = '';

    if (emprunts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">Aucun emprunt enregistré</td></tr>';
    } else {
      emprunts.forEach(emprunt => {
        const tr = document.createElement('tr');
        const statut = emprunt.date_retour_reelle
          ? `<span class="badge-cours">Rendu le ${emprunt.date_retour_reelle}</span>`
          : `<span class="badge-retard">En cours</span>`;

        tr.innerHTML = `
          <td>${emprunt.titre}</td>
          <td>${emprunt.date_emprunt}</td>
          <td>${emprunt.date_retour_prevue}</td>
          <td>${statut}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    document.getElementById('modal-historique-overlay').classList.add('modal-ouverte');
  } catch (err) {
    console.error("Erreur lors du chargement de l'historique", err);
  }
}

// Initialisation
chargerAdherents();