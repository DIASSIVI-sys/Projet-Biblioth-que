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

chargerAdherents();