var express = require('express');
var router = express.Router();
const userController = require('../controllers/user');
const wareHouseController = require('../controllers/warehouse')
const {userVerify}= require("../middleware/userAuth")

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({ title: 'Express' });
});
router.post('/signup', userController.register) //question 1
router.post('/login', userController.login) // question 2
router.get('/details', userVerify, userController.userOrganisationDetail) // question 3
router.get('/getresult',userVerify,  userController.outputOfGivenProblem) // Question 5


router.post('/add', wareHouseController.AddMultipleWarehouse) //question 4
router.post('/product/add', wareHouseController.AddProduct) //question 4
router.post('/order', userVerify, userController.orderProduct) // Question 4
router.post('/product/list', userVerify, userController.getProdctNearByUser) // Question 4



module.exports = router;
