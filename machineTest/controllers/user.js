const userModel = require("../models/users")
const productModel = require("../models/product")
const orderModel = require("../models/order")
const wareHouseModel = require("../models/warehouse")
const { validation } = require("../validators/user");

module.exports = {

    // Question 1
    register: async (req, res) => {

        try {
            console.log(req.body)
            const error = await validation(req.body, "signup");
            if (error) return res.status(422).send({
                code: 422,
                success: false,
                error: false,
                message: error,
            });

            let userExist = await userModel.findOne({ email: req.body.email, mobile: req.body.email })

            if (userExist) {
                return res.status(200).send({
                    code: 402,
                    success: true,
                    error: false,
                    message: "User with this email or mobile already exist.",
                });
            }

            let user = new userModel(req.body)
            await user.save()

            return res.status(200).send({
                code: 200,
                success: true,
                error: false,
                message: "User registered successfully",
                user,
            });

        } catch (error) {
            return res.status(500).send({
                code: 500,
                success: false,
                error: true,
                message: "Something wents wrong",
            });
        }

    },
    // Question 2
    login: async (req, res) => {
        try {
            let { email = null, mobile = null } = req.body

            let isExistUser = await userModel.findOne({ $or: [{ email: email }, { mobile: mobile }] });

            if (!isExistUser) {
                return res.status(200).send({ code: 413, success: true, error: false, message: `${email ? email + ' email id' : mobile + " mobile number"} is not registered with us.` });
            }
            if (!isExistUser.isApprovedByAdmin) {
                return res.status(200).send({ code: 413, success: true, error: false, message: "You are not approved by admin. Please contact admin." });
            }
            isExistUser.comparePassword(req.body.password, (err, isMatch) => {
                if (!isMatch) {
                    return res.status(200).send({ code: 422, success: true, error: false, message: "You have entered incorrect password." });
                } else {
                    return res.status(200).send({ code: 200, success: true, error: false, message: "Logged in successfully" });
                }
            })
        } catch (error) {
            return res.status(500).send({
                code: 500,
                success: false,
                error: true,
                message: "Something wents wrong",
            });
        }
    },
    // Question 3 /****   aggregate two collections */
    userOrganisationDetail: async (req, res) => {
        try {
            let userOrganisationDetail = await userModel.aggregate([
                {
                    $lookup: {
                        from: "organisations",
                        localField: "organisationId",
                        foreignField: "_id",
                        as: "organisation"
                    }
                },
                {
                    $unwind: "$organisation"
                },
                {
                    $project: {
                        name: { $concat: ["$firstName", "$lastName"] },
                        email: 1,
                        mobile: 1,
                        organisationName: "$organisation.name",
                        organisationEmail: "$organisation.email",
                        organisationAddress: "$organisation.address"
                    }
                }
            ])
            return res.status(200).send({ code: 200, success: true, error: false, message: "Details fetched successfully", result: userOrganisationDetail });

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
    //Question 5 /*******  javascript program */
    outputOfGivenProblem: async (req, res) => {
        try {
            let arr = [
                {
                    price: 20,
                    quantity: 25,
                    option: "yes"
                },
                {
                    price: 12,
                    quantity: 25,
                    option: "yes"
                },
                {
                    price: 20,
                    quantity: 25,
                    option: "no"
                },
                {
                    price: 15,
                    quantity: 25,
                    option: "yes"
                },
                {
                    price: 15,
                    quantity: 5,
                    option: "no"
                }
            ]
            let resultArr = []
            arr.forEach((data, i) => {
                let tempObj = data;
                let flag = false;
                arr.forEach((subData, j) => {
                    if (i != j && data.price === subData.price) {
                        data.quantity = Number(data.quantity) + Number(subData.quantity);
                        data.option = `${data.option} ${subData.option}`;
                    }
                })
                for (let tempData of resultArr) {
                    if (data.price === tempData.price) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) resultArr.push(tempObj)

            })

            return res.status(200).send({ output: resultArr })

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

    //Question 4(iii) /******* order create*/
    orderProduct: async (req, res) => {
        try {
            let { userId, productId } = req.body;

            let userExist = await userModel.findOne({ _id: userId })
            if (!userExist) return res.status(200).send({ code: 413, success: true, error: false, message: "User is not exist" });

            let productExist = await productModel.findOne({ _id: productId })
            if (!productExist) return res.status(200).send({ code: 413, success: true, error: false, message: "Product is not exist" });

            let productLeft = await wareHouseModel.findOne({ productId: productId })

            if (productLeft) {
                if (Number(productLeft.stocks) <= 0) {
                    return res.status(200).send({ code: 413, success: true, error: false, message: "Product is out of stock" });

                }
                else {
                    let stock = (Number(productLeft.stocks) - 1)
                    console.log(stock);
                    productLeft = await wareHouseModel.findOneAndUpdate({ _id: productLeft._id }, { $set: { stocks: stock } }, { new: true })
                }
            }

            let order = new orderModel(req.body)
            order.save()


            return res.status(200).send({ code: 200, success: true, error: false, output: order, message: `order sucessfully added now ${productLeft.stocks} products are left in our stock.` })

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

    //Question 4(iv) /*******  showing product near 10km */
    getProdctNearByUser: async (req, res) => {
        try {
            let { lat = '', long = '' } = req.body;

            if (lat == '' || long == '') return res.status(200).send({ code: 413, success: true, error: false, message: "lat, long are missing of user" });
            lat = parseFloat(lat)
            long = parseFloat(long)
            let product = await productModel.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [parseFloat(req.body.lat), parseFloat(req.body.long)] },
                        distanceField: "dist.calculated",
                        maxDistance: 10000,
                        includeLocs: "dist.location",
                        spherical: true
                    }

                },
                {
                    $project:
                    {
                        "productName": 1,
                        _id: 1

                    }
                }

            ])


            return res.status(200).send({ code: 200, data: product.length != 0 ? product[0] : {}, message: product.length != 0 ? `list of product near by user` : "product not found near this location" })

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




}