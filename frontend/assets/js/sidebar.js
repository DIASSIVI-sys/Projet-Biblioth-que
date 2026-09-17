async function chargerSidebar() {
  const response = await fetch('sidebar.html');
  const html = await response.text();

  document.getElementById('sidebar-container').innerHTML = html;

  // Marquer le lien actif selon la page actuelle
  const pageActuelle = document.body.dataset.page;
  const lienActif = document.querySelector(`.sidebar a[data-page="${pageActuelle}"]`);
  if (lienActif) {
    lienActif.classList.add('active');
  }
}

chargerSidebar();