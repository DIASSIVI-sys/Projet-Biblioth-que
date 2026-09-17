const pool = require('../config/db');

//GET Api/emprunts
exports.create=async(req,res,next)=>{
    try{
        const {id_adherent,id_livre,date_retour_prevue}=req.body;
        /*/if(!id_adherent || !id_livre || !date_retour_prevue){
            return res.status(400).json({message:'id_adherent, id_livre et date_retour_prevue sont requis'});
        }*/
        //1 Verifier si le livre existe et est disponible 
        const livre = await pool.query('SELECT * FROM livres WHERE id_livre=$1',[id_livre]);
        if(livre.rows.length===0){
            return res.status(404).json({message:'Livre non trouvé'});
        }
        if(livre.rows[0].statut!=='disponible'){
            return res.status(400).json({message:'Livre non disponible'});
        }

        //2 Creer l'emprunt
        const emprunt = await pool.query('INSERT INTO emprunts (id_adherent,id_livre,date_retour_prevue) VALUES ($1,$2,$3) RETURNING *',[id_adherent,id_livre,date_retour_prevue]);

        //3 Passer le statut du livre à "emprunté"

        await pool.query('UPDATE livres SET statut=$1 WHERE id_livre=$2',['emprunte',id_livre]);
        res.status(201).json(emprunt.rows[0]);
    }catch(err){
        next(err);
    }
};

//PUT Api/emprunts/:id/retOUR enregistrer le retour d'un livre
exports.retour=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const emprunt = await pool.query('SELECT * FROM emprunts WHERE id=$1',[id]);

        if(emprunt.rows.length===0){
            return res.status(404).json({message:'Emprunt non trouvé'});
        }
        if(emprunt.rows[0].date_retour_reelle){
            return res.status(400).json({message:'Livre déjà retourné'});
        }
        const updated = await pool.query('UPDATE emprunts SET date_retour_reelle=NOW() WHERE id=$1 RETURNING *',[id]);

        await pool.query('UPDATE livres SET statut=$1 WHERE id_livre=$2',['disponible',emprunt.rows[0].id_livre]);
        res.status(200).json(updated.rows[0]);
    }catch(err){
        next(err);
    }
};

//GET Api/emprunts/emprunts en cours
exports.getEmpruntsEnCours=async(req,res,next)=>{
    try{
        const result = await pool.query(`SELECT e.*, a.nom AS adherent_nom, l.titre AS livre_titre FROM emprunts e 
            JOIN adherent a ON a.id_adherent=e.id_adherent
            JOIN livres l ON l.id_livre=e.id_livre WHERE e.date_retour_reelle IS NULL`);
        res.status(200).json(result.rows);
    }catch(err){
        next(err);
    }
};

//GET Api/emprunts/emprunts en retard
exports.getEmpruntsEnRetards= async(req,res,next)=>{
    try{
        const result = await pool.query(`SELECT e.*, a.nom AS adherent_nom, l.titre AS livre_titre FROM emprunts e 
            JOIN adherent a ON a.id_adherent=e.id_adherent
            JOIN livres l ON l.id_livre=e.id_livre 
            WHERE e.date_retour_reelle IS NULL AND e.date_retour_prevue < CURRENT_DATE
            ORDER BY e.date_retour_prevue ASC`);
        res.status(200).json(result.rows);
    }catch(err){
        next(err);
    }
};
