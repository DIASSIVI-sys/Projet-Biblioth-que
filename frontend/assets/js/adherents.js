// Charger la liste des adhérents
async function chargerAdherents() {
  try {
    const response = await fetch(`${API_URL}/adherents`);
    const adherents = await response.json();

    const tbody = document.getElementById('adherents-body');
    tbody.innerHTML = '';

    adherents.forEach(adherent => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${adherent.nom}</td>
        <td>${adherent.contact || '-'}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Erreur lors du chargement des adhérents', err);
  }
}

// Soumission du formulaire d'ajout
document.getElementById('form-adherent').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nom = document.getElementById('nom').value;
  const contact = document.getElementById('contact').value;
  const messageEl = document.getElementById('form-message');

  try {
    const response = await fetch(`${API_URL}/adherents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, contact })
    });

    const data = await response.json();

    if (!response.ok) {
      messageEl.textContent = data.message;
      messageEl.className = 'erreur';
      return;
    }

    messageEl.textContent = 'Adhérent ajouté avec succès';
    messageEl.className = 'succes';
    document.getElementById('form-adherent').reset();
    chargerAdherents();
  } catch (err) {
    messageEl.textContent = "Erreur lors de l'ajout de l'adhérent";
    messageEl.className = 'erreur';
  }
});

// Initialisation
chargerAdherents();