const wearhouseModel = require("../models/warehouse")
const productModel = require("../models/product")
const { validation } = require("../validators/user");

module.exports = {

    // Question 4(i)
    AddMultipleWarehouse: async (req, res) => {

        try {
            const error = await validation(req.body, "addWarehouse");
            if (error) return res.status(422).send({
                code: 422,
                success: false,
                error: false,
                message: error,
            });


            let wareHouse = new wearhouseModel(req.body)
            await wareHouse.save()

            return res.status(200).send({
                code: 200,
                success: true,
                error: false,
                message: "Wear House added successfully",
                wareHouse,
            });

        } catch (error) {
            console.log(error)
            return res.status(500).send({
                code: 500,
                success: false,
                error: true,
                message: "Something wents wrong",
            });
        }

    },
    
    AddProduct: async (req, res) => {

        try {
            let coordinates = [parseFloat(req.body.lat), parseFloat(req.body.long)]
            let location = {
                coordinates
            }
            req.body.location = location

            let product = new productModel(req.body)
            await product.save()

            return res.status(200).send({
                code: 200,
                success: true,
                error: false,
                message: "product added successfully",
                product,
            });

        } catch (error) {
            console.log(error)
            return res.status(500).send({
                code: 500,
                success: false,
                error: true,
                message: "Something wents wrong",
            });
        }

    }
}