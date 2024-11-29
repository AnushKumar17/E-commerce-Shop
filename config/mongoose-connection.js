const mongoose = require('mongoose')
const config = require("config")

mongoose.connect(`${config.get("MONGODB_URI")}/scatch`)
.then( () => {
    console.log("Database connected.")
})
.catch( (err) => {
    console.log(err)
})

module.exports = mongoose.connection