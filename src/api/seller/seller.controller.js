var express = require('express');
var router = express.Router();
var seller = require('../../services/seller/seller.service');
const sellerService = new seller();
const verify = require('../../services/jwtVerify.service');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

router.get('/getProductCategories', verify, async function (req, res) {
    sellerService.getProductCategories(req,res);
});

router.get('/getSubProductCategories/:catId', verify, async function (req, res) {
    sellerService.getSubProductCategories(req,res);
});

router.get('/getProductsBySubCat/:subCatId', verify, async function (req, res) {
    sellerService.getProductsBySubCat(req,res);
});


router.get('/getProductsByCat/:subCatId', verify, async function (req, res) {
    sellerService.getProductsByCat(req,res);
});
router.get('/getProductsByCatPs/:subCatId', verify, async function (req, res) {
    sellerService.getProductsByCatPs(req,res);
});
router.put('/updateReadyToShipStatus/:quoteId', verify, async function (req, res) {
    sellerService.updateReadyToShipStatus(req,res);
});
router.get('/getQuoteIfReadyToShip', verify, async function (req, res) {
    sellerService.getQuoteIfReadyToShip(req,res);
});
router.post('/saveQuoteFreightForward', verify, async function (req, res) {
    sellerService.saveQuoteFreightForward(req,res);
});
router.put('/updateReadyToShipStatus/:quoteId', verify, async function (req, res) {
    sellerService.updateReadyToShipStatus(req,res);
});


router.post('/addProductSeries', function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log(req);

    //sellerService.addProductSeries(req, res);
});
router.get('/getSingleProduct/:productId', verify, async function (req, res) {
    sellerService.getSingleProduct(req,res);
});
router.put('/updateProduct', verify, async function (req, res) {
    sellerService.updateProduct(req,res);
});

    
    //sellerService.addProductSeries(req, res);

router.get('/getQuoteFrightForLPList', verify, async function (req, res) {
    sellerService.getQuoteFrightForLPList(req,res);
});

router.get('/getQuoteFrightForLPListSingle/:frightDataId', verify, async function (req, res) {
    sellerService.getQuoteFrightForLPListSingle(req,res);
});


router.get('/getQuotesSubmitedToLp', verify, async function (req, res) {
    sellerService.getQuotesSubmitedToLp(req,res);
});

router.get('/getQuoteFreightData/:quoteId', verify, async function (req, res) {
    sellerService.getQuoteFreightData(req,res);
});
router.put('/updateMakeOutOfStock/:product_id', verify, async function (req, res) {
    sellerService.updateMakeOutOfStock(req,res);
});
router.put('/updateMakeInOfStock/:product_id', verify, async function (req, res) {
    sellerService.updateMakeInOfStock(req,res);
});
router.put('/deleteProduct/:product_id', verify, async function (req, res) {
    sellerService.deleteProduct(req,res);
});
router.get('/getDuty', verify, async function (req, res) {
    sellerService.getDuty(req,res);
});
router.get('/getProductSeriesList', verify, async function (req, res) {
    sellerService.getProductSeriesList(req,res);
});
router.get('/getProductSeriesSingle/:product_series_ref_id', verify, async function (req, res) {
    sellerService.getProductSeriesSingle(req,res);
});
router.get('/getProductSeriesRefDetails/:product_series_ref_id', verify, async function (req, res) {
    sellerService.getProductSeriesRefDetails(req,res);
});
module.exports = router;
