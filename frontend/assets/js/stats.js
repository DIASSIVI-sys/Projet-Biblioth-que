async function chargerStats() {
  try {
    const response = await fetch(`${API_URL}/stats`);
    const stats = await response.json();

    document.getElementById('stat-livres').textContent = stats.total_livres;
    document.getElementById('stat-adherents').textContent = stats.total_adherents;
    document.getElementById('stat-en-cours').textContent = stats.total_emprunts_en_cours;
    document.getElementById('stat-en-retard').textContent = stats.total_emprunts_en_retard;

    const livrePopulaire = stats.livre_plus_emprunte;
    document.getElementById('stat-livre-populaire').textContent = livrePopulaire
      ? `${livrePopulaire.titre} (${livrePopulaire.nb_total_emprunts} emprunts)`
      : 'Aucune donnée';

    const adherentActif = stats.adherent_plus_actif;
    document.getElementById('stat-adherent-actif').textContent = adherentActif
      ? `${adherentActif.nom} (${adherentActif.nb_total_emprunts} emprunts)`
      : 'Aucune donnée';
  } catch (err) {
    console.error('Erreur lors du chargement des statistiques', err);
  }
}

chargerStats();