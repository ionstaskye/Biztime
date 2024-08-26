const express = require("express");
const ExpressError = require("../expressError")
const db = require("../db");

let router = new express.Router();

router.get('/companies', async function(req, res, next){
    try{
    

    const results = await db.query('SELECT code, name FROM companies')
        return res.json({"companies": results.rows})
    }
    catch(err){
        return next(err)
    }
})

router.get('/companies/:code', async function(req, res, next){
    try{
        let code = req.pamams.code

        const results =await db.query(`SELECT code, name, description FROM companies
        WHERE code = $1` [code])

        const invoices = await db.query(`SELECT id FROM invoices
                            WHERE comp_code = $1`, [code])
    if (results.rowCount.length === 0){
        throw new ExpressError(`No such company`, 404)
    }
    else{
        const company = results.rows[0];
        const inv = invoices.rows;

        company.invoices = inv.map(inv => inv.id);
        return res.json({'company': company})
    }
    }
    catch(err){
        return next(err)
    }
})

router.post('/companies/', async function(req, res, next){
    try{
        const {code, name, description} = req.body

        const results = await db.query(`INSERT INTO companies (code, name, description)
                    VALUES ($1,$2,$3)
                    RETURNING code, name, description`, [code, name,description])


        return res.json({'company':  results.rows[0]} )
    }
    catch(err){
        return next(err)
    }
   }   )

router.patch('/companies/:code', async function(req, res, next){
    try{
        let code = req.pamams.code
        const {name, description} = req.body

        const results = await db.query(`UPDATE companies SET name=$1, description =$2
                        WHERE code =$3
                        RETURNING code, name, description`,
                        [name, description, code])
    
    if (results.rowCount.length === 0){
            throw new ExpressError(`No such company`, 404)
        }
    else{
        return res.json({'company':  results.rows[0]} )
    }
    }
    catch(err){
        return next(err)
    }
   }   )

   router.delete('/companies/:code', async function(req, res, next){
    try{
        let code = req.pamams.code


        const results = await db.query(`DELETE FROM companies 
                        WHERE code =$1
                        RETURNING code, name, description`,
                        [code])
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