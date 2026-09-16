const pool= require('../config/db');

//GET Api/auteurs
exports.getAll=async(req,res,next)=>{
    try{
        const result =await pool.query('SELECT *FROM Auteurs ORDER BY id_auteur');
        res.status(200).json(result.rows);
    }catch(err){
        next(err);
    }
};

//GET Api/auteurs/:id
exports.getOne=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const result =await pool.query('SELECT *FROM Auteurs WHERE id_auteur=$1',[id]);
        if(result.rows.length===0){
            return res.status(404).json({message:'Auteur non trouvé'});
        }
        res.status(200).json(result.rows[0]);
    }catch(err){
        next(err);
    }
};

//POST Api/auteurs
exports.create=async(req,res,next)=>{
    try{ 
        const {nom,nationalite}=req.body;
        /*if(!nom || !nationalite){
            return res.status(400).json({message:'Nom et nationalité sont requis'});
        }*/
        const result =await pool.query('INSERT INTO Auteurs (nom,nationalite) VALUES ($1,$2) RETURNING *',[nom,nationalite]);
        res.status(201).json(result.rows[0]);
    }catch(err){
        next(err);
    }
};

//PUT Api/auteurs/:id
exports.update=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const {nom,nationalite}=req.body;
        const result=await pool.query('UPDATE Auteurs SET nom=$1,nationalite=$2 WHERE id_auteur=$3 RETURNING *',[nom,nationalite,id]);
        if(result.rows.length===0){
            return res.status(404).json({message:'Auteur non trouvé'});
        }
        res.status(200).json(result.rows[0]);
    }catch(err){
        next(err);
    }
};  

//DELETE Api/auteurs/:id
exports.delete=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const result=await pool.query('DELETE FROM Auteurs WHERE id_auteur=$1 RETURNING *',[id]);
        if(result.rows.length===0){
            return res.status(404).json({message:'Auteur non trouvé'});
        }
        res.status(200).json({message:'Auteur supprimé avec succès'});
    }catch(err){
        next(err);
    }
};
