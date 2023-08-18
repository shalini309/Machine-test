const mongoose = require("mongoose");
const organisation = mongoose.Schema({
    organisationName: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    }
},
    {
        timestamps: true
    });
module.exports = mongoose.model("organisations", organisation);