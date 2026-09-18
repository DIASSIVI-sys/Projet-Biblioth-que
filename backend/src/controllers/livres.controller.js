const pool =require('../config/db');

//GET Api/livres
exports.getAll =async(req,res,next)=>{
    try{
        const {recherche,page=1,limit=10}=req.query;
        const offset=(page-1)*limit;

        let query =` SELECT l.*, a.nom AS auteur_nom FROM livres l JOIN auteurs a ON a.id_auteur=l.id_auteur`;

        const params = [];
        if(recherche){
            query +=` WHERE l.titre ILIKE $1 OR a.nom ILIKE $1`;
            params.push(`%${recherche}%`);
        }
        query +=` ORDER BY l.id_livre LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);
         
        const result = await pool.query(query, params);
        res.status(200).json(result.rows);
    }catch(err){
        next(err);
    }
};

//GET Api/livres/:id
exports.getOne=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const result =await pool.query('SELECT l.*, a.nom AS auteur_nom FROM livres l JOIN auteurs a ON a.id_auteur=l.id_auteur WHERE l.id_livre=$1',[id]);
        if(result.rows.length===0){
            return res.status(404).json({message:'Livre non trouvé'});
        }
        res.status(200).json(result.rows[0]);
    }catch(err){
        next(err);
    }
};

//POST Api/livres
exports.create=async(req,res,next)=>{
    try{
        const {titre,id_auteur,annee_publication}=req.body;
        /*if(!titre || !id_auteur || !annee_publication){
            return res.status(400).json({message:'Titre, id_auteur et annee_publication sont requis'});
        }*/
        const result =await pool.query('INSERT INTO livres (titre,id_auteur,annee_publication) VALUES ($1,$2,$3) RETURNING *',[titre,id_auteur,annee_publication]);
        res.status(201).json(result.rows[0]);
    }catch(err){
        next(err);
    }
};

//PUT Api/livres/:id
exports.update=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const {titre,id_auteur,annee_publication}=req.body;
        const result=await pool.query('UPDATE livres SET titre=$1,id_auteur=$2,annee_publication=$3 WHERE id_livre=$4 RETURNING *',[titre,id_auteur,annee_publication,id]);
        if(result.rows.length===0){
            return res.status(404).json({message:'Livre non trouvé'});
        }   
        res.status(200).json(result.rows[0]);   
    }catch(err){
        next(err);
    }
};

//DELETE Api/livres/:id
exports.delete=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const result=await pool.query('DELETE FROM livres WHERE id_livre=$1 RETURNING *',[id]);
        if(result.rows.length===0){
            return res.status(404).json({message:'Livre supprimé'});
        }   
        res.status(200).json(result.rows[0]);
    }catch(err){
        next(err);
    }
};