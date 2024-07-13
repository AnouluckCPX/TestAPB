var express = require('express');
var router = express.Router();

const { getAllUsers, createUser, LoginUser } = require('../controllers/userController');
const { getAllProduct, createProduct } = require('../controllers/productController');
const { getAllSale, createSale } = require('../controllers/saleController');


router.get('/users', getAllUsers);
router.post('/users/create', createUser);
router.post('/users/login', LoginUser);

router.get('/product', getAllProduct);
router.post('/product/create', createProduct);

router.get('/sale', getAllSale);
router.post('/sale/create', createSale);



module.exports = router;