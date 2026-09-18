async function chargerSidebar() {
  const response = await fetch('sidebar.html');
  const html = await response.text();

  document.getElementById('sidebar-container').innerHTML = html;

  const pageActuelle = document.body.dataset.page;
  const lienActif = document.querySelector(`.sidebar a[data-page="${pageActuelle}"]`);
  if (lienActif) {
    lienActif.classList.add('active');
  }

  // Gestion du menu mobile
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('.sidebar');

  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar-ouverte');
  });

  // Ferme la sidebar quand on clique sur un lien (mobile)
  document.querySelectorAll('.sidebar-nav a').forEach(lien => {
    lien.addEventListener('click', () => {
      sidebar.classList.remove('sidebar-ouverte');
    });
  });
}

chargerSidebar();