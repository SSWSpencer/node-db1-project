const express = require("express");

const db = require("../data/dbConfig.js");

const router = express.Router();

router.get('/', (req, res)=>{
    db.select("*").from("accounts")
    .then(accounts=>{
        res.status(200).json({data: accounts})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error: "could not fetch accounts"})
    })
})

router.get('/:id', (req, res)=>{
    db.select("*").from("accounts")
    .where("id", req.params.id)
    .first()
    .then(account=>{
        if(account){
            res.status(200).json({data: account})
        }
        else{
            res.status(404).json({error: "Account Not Found"})
        }
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error: "Unable to retrieve account"})
    })
})

router.post("/", (req, res)=>{
    const account = req.body;
    if(isValidAccount(account)){
                db("accounts")
                .insert(account, "id")
                .then(ids=>{
                    res.status(201).json({data: ids})
                })
                .catch(err=>{
                    console.log(err)
                    res.status(400).json({error: "A user with that name already exists"})
                })
            }
})

router.put("/:id", (req, res)=>{
    const changes = req.body;

    db("accounts").where({id: req.params.id})
    .update(changes)
    .then(count=>{
        if(count){
            res.status(200).json({data: count})
        }
        else{
            res.status(404).json({error: "account was not found"})
        }
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error: "Internal server error"})
    })
})

router.delete("/:id", (req, res)=>{
    db("accounts").where({id: req.params.id})
    .del()
    .then(count=>{
        if(count){
            res.status(200).json({data: count})
        }
        else{
            res.status(404).json({error: "post was not found"})
        }
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({message: "Internal server error"})
    })
})

function isValidAccount(acc){
    return Boolean(acc.name && acc.budget)
}

module.exports = router;