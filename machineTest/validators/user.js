const { Validator } = require("node-input-validator");

const signupSchema = {
    firstName: "required",
    email: "required",
    mobile: "required",
    password: "required",
};

const addWareHouseSchema = {
    wareHouseName: "required",
    productId: "required",
    stock: "required",
};

const validationSchema = {
    signup: signupSchema,
    addWarehouse:addWareHouseSchema
};

const validation = async (data, type) => {
    const v = new Validator(data, validationSchema[type]);
    const valid = await v.check();
    if (!valid) {
        return v.errors[Object.keys(v.errors)[0]].message;
    } else {
        return false;
    }
};

module.exports = { validation };
