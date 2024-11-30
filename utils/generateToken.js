// const jwt = require('jsonwebtoken')

// function generateToken(user){
//     let token = jwt.sign({email:user.email, id:user._id}, process.env.JWT_KEY);
// }

// module.exports.generateToken = generateToken;

const jwt = require("jsonwebtoken");

function generateToken(user) {
    return jwt.sign(
        { email: user.email, id: user._id }, 
        process.env.JWT_KEY, 
        { expiresIn: "1h" } // Optional: set token expiration time
    );
}

module.exports.generateToken = generateToken;
