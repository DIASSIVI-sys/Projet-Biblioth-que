const pool=require('../config/db');

//GET Api/stats
exports.getStats=async(req,res,next)=>{
    try{
        //compteurs simples
        const totalLivres=await pool.query('SELECT COUNT(*) AS total_livres FROM livres');
        const totalAdherents=await pool.query('SELECT COUNT(*) AS total_adherents FROM adherent');

        const totalEmpruntsEnCours=await pool.query('SELECT COUNT(*) AS total_emprunts_en_cours FROM emprunts WHERE date_retour_reelle IS NULL');
        
        const totalEmpruntsEnRetard=await pool.query(`SELECT COUNT(*) AS total_emprunts_en_retard
             FROM emprunts WHERE date_retour_reelle IS NULL AND date_retour_prevue < CURRENT_DATE`);

        //livre le plus emprunté
        const livrePlusEmprunte=await pool.query(`SELECT l.id_livre, l.titre, COUNT(*) AS nb_total_emprunts
            FROM Emprunts e
            JOIN Livres l ON l.id_livre= e.id_livre
            GROUP BY l.id_livre, l.titre
            ORDER BY nb_total_emprunts DESC
            LIMIT 1
            `);
        
            //Adhérent le plus actif
        const adherentPlusActif=await pool.query(`SELECT a.id_adherent, a.nom, COUNT(*) AS nb_total_emprunts
            FROM Emprunts e
            JOIN Adherent a ON a.id_adherent =e.id_adherent
            GROUP BY a.id_adherent, a.nom
            ORDER BY nb_total_emprunts DESC
            LIMIT 1
            `);
        res.status(200).json({
            total_livres: parseInt(totalLivres.rows[0].total_livres),
            total_adherents: parseInt(totalAdherents.rows[0].total_adherents),
            total_emprunts_en_cours: parseInt(totalEmpruntsEnCours.rows[0].total_emprunts_en_cours),
            total_emprunts_en_retard: parseInt(totalEmpruntsEnRetard.rows[0].total_emprunts_en_retard),
            livre_plus_emprunte: livrePlusEmprunte.rows[0] || null,
            adherent_plus_actif: adherentPlusActif.rows[0] || null,
        });
    }catch (err) {
        next(err);
    }
};