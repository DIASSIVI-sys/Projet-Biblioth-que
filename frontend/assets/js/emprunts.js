
let empruntsActuels = []; // stocke la liste complète pour filtrer sans refaire d'appel API

// Charger la liste des emprunts en cours (avec distinction retard)
async function chargerEmpruntsEnCours() {
  try {
    const response = await fetch(`${API_URL}/emprunts/en-cours`);
    empruntsActuels = await response.json();
    appliquerFiltre();
  } catch (err) {
    console.error('Erreur lors du chargement des emprunts', err);
  }
}

// Affiche une liste d'emprunts donnée
function afficherEmprunts(emprunts) {
  const tbody = document.getElementById('emprunts-body');
  tbody.innerHTML = '';

  if (emprunts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">Aucun emprunt trouvé</td></tr>';
    return;
  }

  const aujourdHui = new Date().toISOString().split('T')[0];

  emprunts.forEach(emprunt => {
    const enRetard = emprunt.date_retour_prevue < aujourdHui;
    const tr = document.createElement('tr');
    tr.className = enRetard ? 'ligne-retard' : 'ligne-en-cours';

    tr.innerHTML = `
      <td>${emprunt.adherent_nom}</td>
      <td>${emprunt.livre_titre}</td>
      <td>${emprunt.date_emprunt}</td>
      <td>${emprunt.date_retour_prevue}</td>
      <td>
        ${enRetard ? '<span class="badge-retard">En retard</span>' : '<span class="badge-cours">En cours</span>'}
        <button onclick="retournerLivre(${emprunt.id})">Marquer comme rendu</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Applique le filtre sélectionné sur la liste déjà chargée
function appliquerFiltre() {
  const filtre = document.getElementById('filtre-statut').value;
  const aujourdHui = new Date().toISOString().split('T')[0];

  let empruntsFiltres = empruntsActuels;

  if (filtre === 'en-retard') {
    empruntsFiltres = empruntsActuels.filter(e => e.date_retour_prevue < aujourdHui);
  } else if (filtre === 'en-cours') {
    empruntsFiltres = empruntsActuels.filter(e => e.date_retour_prevue >= aujourdHui);
  }
  // si filtre === 'tous', on garde empruntsActuels tel quel

  afficherEmprunts(empruntsFiltres);
}

// Écouteur sur le select
document.getElementById('filtre-statut').addEventListener('change', appliquerFiltre);

// Charger les adhérents dans le select
async function chargerAdherentsDansSelect() {
  try {
    const response = await fetch(`${API_URL}/adherents`);
    const adherents = await response.json();

    const select = document.getElementById('id_adherent');
    select.innerHTML = '<option value="">-- Choisir un adhérent --</option>';

    adherents.forEach(adherent => {
      const option = document.createElement('option');
      option.value = adherent.id_adherent;
      option.textContent = adherent.nom;
      select.appendChild(option);
    });
  } catch (err) {
    console.error('Erreur lors du chargement des adhérents', err);
  }
}

// Charger uniquement les livres disponibles dans le select
async function chargerLivresDisponiblesDansSelect() {
  try {
    const response = await fetch(`${API_URL}/livres`);
    const livres = await response.json();
    console.log('Livres chargés pour le select:', livres); // Ajouté pour le débogage

    const select = document.getElementById('id_livre');
    select.innerHTML = '<option value="">-- Choisir un livre disponible --</option>';

    livres
      .filter(livre => livre.statut === 'disponible')
      .forEach(livre => {
        const option = document.createElement('option');
        option.value = livre.id_livre;
        option.textContent = livre.titre;
        select.appendChild(option);
      });
  } catch (err) {
    console.error('Erreur lors du chargement des livres', err);
  }
}



// Soumission du formulaire d'emprunt
document.getElementById('form-emprunt').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id_adherent = document.getElementById('id_adherent').value;
  const id_livre = document.getElementById('id_livre').value;
  const date_retour_prevue = document.getElementById('date_retour_prevue').value;
  const messageEl = document.getElementById('emprunt-message');

  try {
    const response = await fetch(`${API_URL}/emprunts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_adherent, id_livre, date_retour_prevue })
    });

    const data = await response.json();

    if (!response.ok) {
      messageEl.textContent = data.message;
      messageEl.className = 'erreur';
      return;
    }

    messageEl.textContent = 'Emprunt enregistré avec succès';
    messageEl.className = 'succes';
    document.getElementById('form-emprunt').reset();
    chargerLivresDisponiblesDansSelect(); // le livre emprunté ne doit plus apparaître
    chargerEmpruntsEnCours();
  } catch (err) {
    messageEl.textContent = "Erreur lors de l'enregistrement de l'emprunt";
    messageEl.className = 'erreur';
  }
});

// Enregistrer le retour d'un livre
async function retournerLivre(idEmprunt) {
  try {
    const response = await fetch(`${API_URL}/emprunts/${idEmprunt}/retour`, {
      method: 'PUT'
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.message);
      return;
    }

    chargerLivresDisponiblesDansSelect(); // le livre redevient disponible
    chargerEmpruntsEnCours();
  } catch (err) {
    alert('Erreur lors de l\'enregistrement du retour');
  }
}

// Initialisation
chargerAdherentsDansSelect();
chargerLivresDisponiblesDansSelect();
chargerEmpruntsEnCours();