const express = require('express')
const router = express.Router()
const ownerModel = require("../models/owner-model")

router.post("/create", async (req,res)=>{
    let owners = await ownerModel.find();
    if(owners.length > 0){
        return res.send("Cannot create owner.")
    }
    else{
        let {fullname,email,password} = req.body
        let createdOwner = await ownerModel.create({
            fullname,
            email,
            password
        })
        res.status(201).send("User created.")
    }
})

router.get("/admin", (req,res)=>{
    let success = req.flash("success")
    res.render("createproducts",{success})
})

module.exports = router