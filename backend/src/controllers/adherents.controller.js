const pool = require('../config/db');

//GET Api/adherents

exports.getAll=async(req,res,next)=>{
    try{
        const result =await pool.query('SELECT * FROM adherent ORDER BY id_adherent');
        res.status(200).json(result.rows);
    }catch(err){
        next(err);
    }
};

//GET Api/adherents/:id
exports.getOne=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const result =await pool.query('SELECT * FROM adherent WHERE id_adherent=$1', [id]);
        res.status(200).json(result.rows);
    }catch(err){
        next(err);
    }
};

//POST Api/adherents
exports.create =async(req,res,next)=>{
    try{
        const {nom,contact,sexe}=req.body;
        /*if(!nom || !contact ){
            return res.status(400).json({message:'Nom et contact sont requis'});
        }*/
        const result =await pool.query('INSERT INTO adherent (nom,contact,sexe) VALUES ($1,$2,$3) RETURNING *',[nom,contact,sexe]);
        res.status(201).json(result.rows[0]);
    }catch(err){
        next(err);
    }
};

//PUT Api/adherents/:id
exports.update=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const {nom,contact,sexe}=req.body;
        const result=await pool.query('UPDATE adherent SET nom=$1,contact=$2,sexe=$3 WHERE id_adherent=$4 RETURNING *',[nom,contact,sexe,id]);
        if(result.rows.length===0){
            return res.status(404).json({message:'Adhérent non trouvé'});
        }  
        res.status(200).json(result.rows[0]);
    }catch(err){
        next(err);
    }
};

//DELETE Api/adherents/:id
exports.delete=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const result=await pool.query('DELETE FROM adherent WHERE id_adherent=$1 RETURNING *',[id]);
        if(result.rows.length===0){
            return res.status(404).json({message:'Adhérent non trouvé'});
        }
        res.status(200).json(result.rows[0]);
    }catch(err){
        next(err);
    }
};

//GET Api/adherents/:id/emprunts
exports.getEmprunts=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const result =await pool.query(`SELECT e.*,l.titre FROM Emprunts e JOIN Livres l ON l.id_livre=e.id_livre WHERE e.id_adherent=$1
            ORDER BY e.date_emprunt DESC `,[id]
            );
        res.status(200).json(result.rows);
    }catch(err){
        next(err);
    }
};