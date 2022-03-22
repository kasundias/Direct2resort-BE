var express = require('express');
var router = express.Router();
var productRegister=require('../../services/products/product.service');
const productRegisterService=new productRegister();
const verify=require('../../services/jwtVerify.service');

router.post('/addProduct',verify, async function (req, res) {
    productRegisterService.addProducts(req,res);
});
router.get('/getProductCategories',verify, async function (req, res) {
    productRegisterService.getProductCategories(req,res);
});
router.get('/getSubProductCategoriesByCategory/:productCatId',verify, async function (req, res) {
    productRegisterService.getSubProductCategories(req,res);
});
router.post('/addProductSeries',verify, async function (req, res) {
    productRegisterService.saveProductSeries(req,res);
});
router.get('/getProductSpecifiAttrs/:subCategoryId',verify,async function (req,res){
    productRegisterService.getProductSpecificAttrs(req,res);
});

router.post('/getProductListbyGeneralUser',verify, async function (req, res) {
    productRegisterService.getProductListByGeneralPersonalUser(req,res);
});
router.put('/updateProduct/:productId',verify, async function (req, res) {
    productRegisterService.updateProducts(req,res);
});
router.put('/deleteProduct/:productId',verify, async function (req, res) {
    productRegisterService.deleteProduct(req,res);
});
router.put('/publishProduct/:productId',verify, async function (req, res) {
    productRegisterService.publishProduct(req,res);
});
router.get('/getAllProductList', async function (req, res) {
    productRegisterService.getAllProducts(req,res);
});
router.get('/getProductByUrl/:productUrl', async function (req, res) {
    productRegisterService.getProductInfoByUrl(req,res);
});
router.get('/getProductInfoByUrlForSeller/:productUrl', async function (req, res) {
    productRegisterService.getProductInfoByUrlForSeller(req,res);
});
router.get('/getProductByUrlForAdmin/:productUrl', async function (req, res) {
    productRegisterService.getProductByUrlForAdmin(req,res);
});
router.get('/getProductByCategory/:categoryId',verify, async function (req, res) {
    productRegisterService.getProductByCategory(req,res);
});
router.get('/getProductBySubCategory/:subCategoryId',verify, async function (req, res) {
    productRegisterService.getProductBySubCategory(req,res);
});

router.get('/getAllFeaturedProductList', async function (req, res) {
    productRegisterService.getAllFeaturedProductList(req,res);
});
router.get('/getProductsBySubCategoriesBySeller/:subCategoryId', async function (req, res) {
    productRegisterService.getProductsBySubCategoriesBySeller(req,res);
});
router.get('/getTopSellers', async function (req, res) {
    productRegisterService.getTopSellers(req,res);
});
router.get('/getNewProducts', async function (req, res) {
    productRegisterService.getNewProducts(req,res);
});
router.post('/sendSampleReq', async function (req, res) {
    productRegisterService.sendSampleReq(req,res);
});

module.exports = router;
