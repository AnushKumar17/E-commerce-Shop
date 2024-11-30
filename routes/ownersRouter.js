const express = require('express')
const router = express.Router()
const ownerModel = require("../models/owner-model")
const productModel = require("../models/product-model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {generateToken} = require("../utils/generateToken")

router.post("/create", async (req,res)=>{
    let owners = await ownerModel.find();
    if(owners.length > 0){
        return res.send("Cannot create owner.")
    }
    else{
            try {
                let { fullname, email, password } = req.body
        
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, async function (err, hash) {
                        if (err) return res.send(err.message)
                        else {
                            let createdUser = await ownerModel.create({
                                fullname,
                                email,
                                password: hash,
                            });
                            let token = generateToken(createdUser)
                            res.cookie("token", token)
                            res.send("Owner created successfully")
                        }
                        })
                })
            } catch (error) {
                res.send(error.message)
            }
        } 
    }
)

router.post("/login", async (req,res) => {
    try {
        let {email,password} = req.body;

        let user = await ownerModel.findOne({email:email})
        if(!user) {// res.send("User does not exist!")
            req.flash("error","Owner does not exist!")
            return res.redirect("/")
        }

        bcrypt.compare(password,user.password, async function(err,result){
            if(result){
                let token = generateToken(user)
                res.cookie("token", token)
                let products = await productModel.find();
                res.render("admin",{products})
            }
            else{
                req.flash("error","Email or password incorrect.")
                // res.send("Email or password incorrect.")
                return res.redirect("/")
            }
        })

    } catch (error) {
        res.send(error.message)
    }
})

router.get("/admin", (req,res)=>{
    let success = req.flash("success")
    res.render("createproducts",{success})
})

// router.get("/shop", async function(req,res){
    
//     let success = req.flash("success")
//     res.render("shop",{products,success})
// })


module.exports = router

