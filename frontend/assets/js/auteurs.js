document.getElementById('form-auteur').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nom = document.getElementById('auteur-nom').value;
  const nationalite = document.getElementById('auteur-nationalite').value;
  const messageEl = document.getElementById('auteur-message');

  try {
    const response = await fetch(`${API_URL}/auteurs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, nationalite })
    });

    const data = await response.json();

    if (!response.ok) {
      messageEl.textContent = data.message;
      messageEl.className = 'erreur';
      return;
    }

    messageEl.textContent = 'Auteur ajouté avec succès';
    messageEl.className = 'succes';
    document.getElementById('form-auteur').reset();
    chargerAuteursDansSelect(); // ← ajouté : rafraîchit le select du formulaire livre
  } catch (err) {
    messageEl.textContent = "Erreur lors de l'ajout de l'auteur";
    messageEl.className = 'erreur';
  }
});