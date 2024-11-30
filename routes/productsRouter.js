const express = require('express')
const router = express.Router()
const upload = require("../config/multer-config")
const productModel = require("../models/product-model")

router.post("/create", upload.single('image'), async (req,res)=>{
    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor} = req.body;
        let product = await productModel.create({
            image : req.file.buffer,
            name, 
            price, 
            discount, 
            bgcolor, 
            panelcolor, 
            textcolor
        })
        req.flash("success","Product created successfully")
        res.redirect("/owners/admin")
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = router

// const express = require('express');
// const router = express.Router();
// const upload = require('../config/multer-config');
// const productModel = require('../models/product-model');

// // Create a new product
// router.post('/create', upload.single('image'), async (req, res) => {
//     try {
//         const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

//         // Ensure the file was uploaded
//         if (!req.file) {
//             return res.status(400).send('No image file uploaded.');
//         }

//         // Create the new product
//         const product = await productModel.create({
//             image: req.file.buffer,  // Storing the image as a buffer
//             name,
//             price,
//             discount: discount || 0,  // Default to 0 if no discount provided
//             bgcolor,
//             panelcolor,
//             textcolor
//         });

//         // Respond with the created product
//         return res.status(201).json({
//             message: 'Product created successfully',
//             product: product
//         });
//     } catch (error) {
//         console.error('Error creating product:', error);
//         return res.status(500).send('Error creating product.');
//     }
// });

// module.exports = router;
