const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
    productName: {
        type: String,
        default: ""
    },
    productDetails: {
        type: String,
        default: ""
    },
    location: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: {
            type:[Number],
            default:[0, 0]
        },
    },
},
    {
        timestamps: true
    });


 productSchema.index({location:"2dsphere"})

module.exports = mongoose.model("product", productSchema);