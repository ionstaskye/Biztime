const express = require("express");
const ExpressError = require("../expressError")
const db = require("../db");

let router = new express.Router();

router.get('/invoices', async function(req, res, next){
    try{
    

    const results = await db.query('SELECT code, name FROM invoices')
        return res.json({"invoices": results.rows})
    }
    catch(err){
        return next(err)
    }
})

router.get('/invoices/:id', async function(req, res, next){
    try{
        let id = req.pamams.id

        const results =await db.query(`SELECT id, comp_code, amt, paid, add_date, paid_date FROM invoices
        WHERE id = $1` [id])
    if (results.rowCount.length === 0){
        throw new ExpressError(`No such company`, 404)
    }
    else{
        return res.json({'invoice': results.rows})
    }
    }
    catch(err){
        return next(err)
    }
})

router.post('/invoices/', async function(req, res, next){
    try{
        const {comp_code, amt} = req.body

        const results = await db.query(`INSERT INTO invoices (comp_code, amt)
                    VALUES ($1,$2)
                    RETURNING id, comp_code, amt, paid, add_date, paid_date`, [comp_code, amt])
        
        return res.json({'invoice':  results.rows[0]} )
    }
    catch(err){
        return next(err)
    }
   }   )

   router.patch('/invoices/:id', async function(req, res, next){
    try{
        let id = req.pamams.id
        const {amt} = req.body

        const results = await db.query(`UPDATE companies SET amt=$1
                        WHERE id =$2
                        RETURNING id, comp_code, amt, paid, add_date, paid_date`,
                        [amt, id])
    
    if (results.rowCount.length === 0){
            throw new ExpressError(`No such company`, 404)
        }
    else{
        return res.json({'invoice':  results.rows[0]} )
    }
    }
    catch(err){
        return next(err)
    }
   }   )

   router.delete('/invoices/:id', async function(req, res, next){
    try{
        let id = req.pamams.id


        const results = await db.query(`DELETE FROM invoices
                        WHERE id =$1`,
                        [id])
    if (results.rowCount.length === 0){
        throw new ExpressError(`No such company`, 404)
        }
    else{
        
        return res.json({status: 'deleted'})
    }
    }
    catch(err){
        return next(err)
    }
   }   )

