const userModel = require("../models/user-model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {generateToken} = require("../utils/generateToken")

module.exports.registerUser = async (req, res) => {
    try {
        let { fullname, email, password } = req.body

        let user = await userModel.findOne({email:email})
        if (user) {// res.status(401).send("User already exist!")
            req.flash("error","User already exist!")
            return res.redirect("/")
        }
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return res.send(err.message)
                else {
                    let createdUser = await userModel.create({
                        fullname,
                        email,
                        password: hash,
                    });
                    let token = generateToken(createdUser)
                    res.cookie("token", token)
                    res.send("User created successfully")
                }
                })
        })
    } catch (error) {
        res.send(error.message)
    }
} 

module.exports.loginUser = async (req,res) => {
    try {
        let {email,password} = req.body;

        let user = await userModel.findOne({email:email})
        if(!user) {// res.send("User does not exist!")
            req.flash("error","User does not exist!")
            return res.redirect("/")
        }

        bcrypt.compare(password,user.password, function(err,result){
            if(result){
                let token = generateToken(user)
                res.cookie("token", token)
                res.redirect("/shop")
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
}

module.exports.logout = function(req,res){
    res.cookie("token","")
    res.redirect("/")
}