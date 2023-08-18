const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const warehouseSchema = mongoose.Schema({
    wareHouseName: {
        type: String,
        default: ""
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "products",
    },
    stocks: {
        type: Number,
        default: 0
    },
},
    {
        timestamps: true
    });

module.exports = mongoose.model("warehouses", warehouseSchema);