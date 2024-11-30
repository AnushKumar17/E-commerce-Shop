const express = require("express");
const productModel = require("../models/product-model")
const isLoggedin = require("../middlewares/isLoggedin");
const userModel = require("../models/user-model");
const router = express.Router()
const flash = require('connect-flash')
const session = require("express-session");

router.get("/", (req,res)=>{
    let error = req.flash("error");
    res.render("index",{error, loggedin:false})
})

router.get("/shop", isLoggedin, async function(req,res){
    let products = await productModel.find();
    let success = req.flash("success")
    res.render("shop",{products,success})
})

router.get("/cart", isLoggedin, async function(req,res){
    let user = await userModel.findOne({email: req.user.email}).populate("cart")

    const bill = (Number(user.cart[0].price) + 20) - Number(user.cart[0].discount)

    res.render("cart", {user,bill})
})

router.get("/addtocart/:productid", isLoggedin, async function(req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/shop");
        }

        // Push the correct parameter
        user.cart.push(req.params.productid);
        await user.save();

        req.flash("success", "Added to cart");
        res.redirect("/shop");
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong");
        res.redirect("/shop");
    }
});


router.get("/logout",isLoggedin, function (req,res){
    res.render("shop")
})

module.exports = router