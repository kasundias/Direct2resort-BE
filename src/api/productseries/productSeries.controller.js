var express = require('express');
var router = express.Router();
var productSeries=require('../../services/productseries/productSeries.service');
const productSeriesService=new productSeries();
const verify=require('../../services/jwtVerify.service');


router.get('/getProductSeriesAllByCategory/:categoryId', verify, async function (req, res) {
    productSeriesService.getProductSeriesAllByCategory(req,res);
});

router.get('/getProductSeriesSingle/:productSeriesRefId', async function (req, res) {
    productSeriesService.getProductSeriesSingle(req,res);
});
router.get('/getProductSeriesRefDetails/:productSeriesURL', async function (req, res) {
    productSeriesService.getProductSeriesRefDetails(req,res);
});
router.post('/createQuote',verify, async function (req, res) {
    productSeriesService.createQuote(req,res);
});
router.get('/getCatAndSeriesList/:seriesUrl', async function (req, res) {
    productSeriesService.getCatAndSeriesList(req,res);
});
router.post('/getQuoteQuoteInstancesNotApproved', verify, async function (req, res) {
    productSeriesService.getQuoteQuoteInstancesNotApproved(req,res);
});
router.get('/getProductQuoteInstancebyQuote/:productQuoteSeriesId',verify, async function (req, res) {
    productSeriesService.getProductQuoteInstancebyQuote(req,res);
});
router.put('/updateMessageApprovalByAdmin',verify, async function (req, res) {
    productSeriesService.updateMessageApprovalByAdmin(req,res);
});
router.put('/updateQuoteInstanceApprovalByAdmin',verify, async function (req, res) {
    productSeriesService.updateQuoteInstanceApprovalByAdmin(req,res);
});
router.post('/getQuoteQuoteInstancesSellerQuery',verify, async function (req, res) {
    productSeriesService.getQuoteQuoteInstancesSellerQuery(req,res);
});
router.post('/sellerCreateQuoteInstance',verify, async function (req, res) {
    productSeriesService.sellerCreateQuoteInstance(req,res);
});
router.post('/sendMessaageQuote',verify, async function (req, res) {
    productSeriesService.sendMessaageQuote(req,res);
});
router.post('/getQuoteQuoteInstancesBuyer',verify, async function (req, res) {
    productSeriesService.getQuoteQuoteInstancesBuyer(req,res);
});
router.put('/buyerApproveQuoteFinal',verify, async function (req, res) {
    productSeriesService.buyerApproveQuoteFinal(req,res);
});
router.put('/changeToReadyToShipQuery',verify, async function (req, res) {
    productSeriesService.changeToReadyToShipQuery(req,res);
});

router.get('/showReadyToShipPerSellerQuery',verify, async function (req, res) {
    productSeriesService.showReadyToShipPerSellerQuery(req,res);
});

router.post('/rejectQuoteInstanceQuery',verify, async function (req, res) {
    productSeriesService.rejectQuoteInstanceQuery(req,res);
});
router.put('/rejectOnlyMessageQuery',verify, async function (req, res) {
    productSeriesService.rejectOnlyMessageQuery(req,res);
});

router.put('/approvePsAdmin',verify, async function (req, res) {
    productSeriesService.approvePsAdmin(req,res);
});
router.put('/rejectPsAdmin',verify, async function (req, res) {
    productSeriesService.rejectPsAdmin(req,res);
});
router.post('/getPsAdmin',verify, async function (req, res) {
    productSeriesService.getPsAdmin(req,res);
});
router.get('/getMinLpVal/:ParentQuote_parent_quote_id', verify, async function (req, res) {
    productSeriesService.getMinLpVal(req,res);
});

router.post('/removeProductFromSeries', verify, async function (req, res) {
    productSeriesService.removeProductFromSeries(req,res);
});
router.put('/updateProductSeries', verify, async function (req, res) {
    productSeriesService.updateProductSeries(req,res);
});
router.put('/deleteProductSeries', verify, async function (req, res) {
    productSeriesService.deleteProductSeries(req,res);
});

module.exports = router;
