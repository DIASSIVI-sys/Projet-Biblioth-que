const pool = require('../config/db');

// POST /api/emprunts
exports.create = async (req, res, next) => {
  const { id_adherent, id_livre, date_retour_prevue } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Vérifier si le livre existe et est disponible
    const livre = await client.query('SELECT * FROM livres WHERE id_livre=$1', [id_livre]);
    if (livre.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    if (livre.rows[0].statut !== 'disponible') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Livre non disponible' });
    }

    // 2. Créer l'emprunt
    const emprunt = await client.query(
      'INSERT INTO emprunts (id_adherent,id_livre,date_retour_prevue) VALUES ($1,$2,$3) RETURNING *',
      [id_adherent, id_livre, date_retour_prevue]
    );

    // 3. Passer le statut du livre à "emprunté"
    await client.query('UPDATE livres SET statut=$1 WHERE id_livre=$2', ['emprunte', id_livre]);

    await client.query('COMMIT');
    res.status(201).json(emprunt.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

// PUT /api/emprunts/:id/retour
exports.retour = async (req, res, next) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const emprunt = await client.query('SELECT * FROM emprunts WHERE id=$1', [id]);
    if (emprunt.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Emprunt non trouvé' });
    }
    if (emprunt.rows[0].date_retour_reelle) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Livre déjà retourné' });
    }

    const updated = await client.query(
      'UPDATE emprunts SET date_retour_reelle=NOW() WHERE id=$1 RETURNING *',
      [id]
    );

    await client.query('UPDATE livres SET statut=$1 WHERE id_livre=$2', ['disponible', emprunt.rows[0].id_livre]);

    await client.query('COMMIT');
    res.status(200).json(updated.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

// GET /api/emprunts/en-cours
exports.getEmpruntsEnCours = async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT e.*, a.nom AS adherent_nom, l.titre AS livre_titre FROM emprunts e 
      JOIN adherent a ON a.id_adherent=e.id_adherent
      JOIN livres l ON l.id_livre=e.id_livre WHERE e.date_retour_reelle IS NULL`);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/emprunts/en-retard
exports.getEmpruntsEnRetards = async (req, res, next) => {
  try {
    const result = await pool.query(`SELECT e.*, a.nom AS adherent_nom, l.titre AS livre_titre FROM emprunts e 
      JOIN adherent a ON a.id_adherent=e.id_adherent
      JOIN livres l ON l.id_livre=e.id_livre 
      WHERE e.date_retour_reelle IS NULL AND e.date_retour_prevue < CURRENT_DATE
      ORDER BY e.date_retour_prevue ASC`);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
};