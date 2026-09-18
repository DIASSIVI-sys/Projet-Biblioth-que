-- ============================================
-- Schéma de base de données : Bibliothèque 
-- ============================================

CREATE TABLE Auteurs (
  id_auteur SERIAL PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  nationalite VARCHAR(100)
);

CREATE TABLE Adherent (
  id_adherent SERIAL PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  contact VARCHAR(150),
  sexe VARCHAR(10)
);

CREATE TABLE Livres (
  id_livre SERIAL PRIMARY KEY,
  titre VARCHAR(200) NOT NULL,
  annee_publication INTEGER,
  id_auteur INTEGER NOT NULL REFERENCES Auteurs(id_auteur),
  statut VARCHAR(20) NOT NULL DEFAULT 'disponible'
    CHECK (statut IN ('disponible', 'emprunte'))
);

CREATE TABLE Emprunts (
  id SERIAL PRIMARY KEY,
  id_adherent INTEGER NOT NULL REFERENCES Adherent(id_adherent),
  id_livre INTEGER NOT NULL REFERENCES Livres(id_livre),
  date_emprunt DATE NOT NULL DEFAULT CURRENT_DATE,
  date_retour_prevue DATE NOT NULL,
  date_retour_reelle DATE
);

-- Index utiles pour accélérer les recherches fréquentes
CREATE INDEX idx_livres_auteur ON Livres(id_auteur);
CREATE INDEX idx_emprunts_adherent ON Emprunts(id_adherent);
CREATE INDEX idx_emprunts_livre ON Emprunts(id_livre);