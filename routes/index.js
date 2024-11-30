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

// router.get("/shop", isLoggedin, async function(req,res){
//     let products = await productModel.find();
//     let success = req.flash("success")
//     res.render("shop",{products,success})
// })

router.get("/shop", isLoggedin, async function(req, res) {

    let user = await userModel.findOne({email: req.user.email})
    
    let sortOption = req.query.sort || 'default'; // Default sorting option

    // Fetch products from the database
    let products = await productModel.find();

    // Sort products based on the selected option
    switch(sortOption) {
        case 'name':
            products = products.sort((a, b) => a.name.localeCompare(b.name)); // Sort by name
            break;
        case 'price':
            products = products.sort((a, b) => a.price - b.price); // Sort by price
            break;
        case 'discount':
            products = products.sort((a, b) => a.discount - b.discount); // Sort by discount
            break;
        default:
            // Default sorting logic (could be by creation date or any other field)
            break;
    }

    let success = req.flash("success");
    res.render("shop", { products, success });
});


// router.get("/cart", isLoggedin, async function(req,res){
//     let user = await userModel.findOne({email: req.user.email}).populate("cart")
//     const bill = (Number(user.cart[0].price) + 20) - Number(user.cart[0].discount)
//     res.render("cart", {user,bill})
// })

router.get("/cart", isLoggedin, async function(req, res) {
    let user = await userModel.findOne({ email: req.user.email }).populate("cart");

    // Check if the cart is empty
    if (!user.cart || user.cart.length === 0) {
        // If the cart is empty, render a message or redirect as needed
        return res.render("cart", { user, message: "Your cart is empty." });
    }

    // Initialize variables to track totals
    let totalBill = 0;
    let totalPrice = 0;
    let totalDiscount = 0;

    // Calculate total price, total discount, and the final bill
    user.cart.forEach(item => {
        totalPrice += Number(item.price);          // Sum of all item prices
        totalDiscount += Number(item.discount);    // Sum of all item discounts
        totalBill += (Number(item.price) - Number(item.discount));  // Sum of each item's price minus its discount
    });

    // Deduct the shipping fee of 20
    totalBill += 20;

    // Render the cart page with the calculated totals
    res.render("cart", { user, totalPrice, totalDiscount, bill: totalBill });
});


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

router.get("/cart/remove/:id", isLoggedin, async function(req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/shop");
        }

        // Correct parameter name to match route parameter
        let itemId = req.params.id;
        user.cart.pull(itemId);
        await user.save();
        res.redirect("/cart");

    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong");
        res.redirect("/shop");
    }
});


module.exports = router