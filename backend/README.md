# Application de Gestion de Bibliothèque

Une application complète de gestion de bibliothèque permettant de gérer les auteurs, les adhérents, les livres, les emprunts ainsi que de consulter des statistiques.

---

## 🛠️ Technologies Utilisées

- **Frontend :** HTML5, CSS3, JavaScript (Vanilla)
- **Backend :** Node.js, Express
- **Base de données :** PostgreSQL (hébergée sur Render)

---

## 📂 Structure du Projet

```text
bibliotheque/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   └── routes/
│   ├── app.js
│   ├── server.js
│   ├── shema.sql
│   ├── .env
│   └── package.json
└── frontend/ ( fichiers statiques)
    ├── index.html
    ├──assets/
    ├──css/
    ├──style.css
    └── js/(tous les fichiers js)
        └── auteurs.js

 Installation et Lancement en Local
1. Cloner le dépôt
Bash
git clone <url-du-depot>
cd bibliotheque/backend

2. Installer les dépendances
npm install

3. Configurer les variables d'environnementCréez un fichier .env à la racine du dossier backend en vous inspirant de .env.example :   Extrait de codeDB_HOST=localhost
DB_PORT=5432
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_NAME=bibliotheque_db
PORT=3000

4. Initialiser la base de données
Exécutez le script SQL pour créer les tables et index[cite: 1] :

Bash
psql "postgresql://utilisateur:mot_de_passe@hote/bibliotheque_db" -f shema.sql

## Choix de modélisation

- **Clés primaires** : `id_auteur`, `id_adherent`, `id_livre` (auto-incrémentées avec `SERIAL`) pour plus de clarté dans les jointures.
- **Statut du livre** : stocké directement comme colonne (`disponible` / `emprunte`) plutôt que déduit à chaque requête, pour des lectures plus rapides. Sécurisé par une contrainte `CHECK`.
- **Dates d'emprunt** : `date_emprunt` (remplie automatiquement via `DEFAULT CURRENT_DATE`), `date_retour_prevue` (saisie par l'utilisateur), `date_retour_reelle` (NULL tant que le livre n'est pas rendu — permet de distinguer emprunts en cours et historique).
- **Transactions** : la création et le retour d'un emprunt utilisent des transactions SQL (`BEGIN`/`COMMIT`/`ROLLBACK`) pour garantir la cohérence entre la table `emprunts` et le statut du livre.


5. Démarrer le serveur
Mode développement :
Bash
npm run dev

Ouvre le dossier `frontend` avec un serveur local (ex. extension "Live Server" sur VS Code).

 ---Déploiement
Backend : Déployé sur Render avec une configuration de base de données PostgreSQL distante (nécessitant l'activation du SSL : ssl: { rejectUnauthorized: false })[cite: 1].

Frontend : Configure l'URL de l'API selon l'environnement (production via Render ou localhost en local).

--Fonctionnalités de l'API
L'API expose les routes suivantes[cite: 1] :

GET /api/auteurs : Récupérer la liste des auteurs

POST /api/auteurs : Ajouter un auteur

GET /api/adherents : Gestion des adhérents

GET /api/livres : Gestion du catalogue de livres

GET /api/emprunts : Suivi des emprunts

GET /api/stats : Statistiques de la bibliothèque

## Fonctionnalités
- CRUD complet : auteurs, livres, adhérents, emprunts
- Recherche et pagination sur les livres
- Détection automatique des emprunts en retard
- Historique des emprunts par adhérent
- Tableau de bord avec statistiques et graphique