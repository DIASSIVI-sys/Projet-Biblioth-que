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

chargerLivres();