var express = require('express');
var router = express.Router();
var shopPage = require('../../services/shop/shopPage.service');

const shopPageService = new shopPage();

router.get('/getCategories', async function (req, res) {
        await shopPageService.getCategories(req, res);
});

router.get('/getSubCategories/:catId', async function (req, res) {
    await shopPageService.getSubCategories(req, res);
});

router.post('/filterProducts', async function (req, res) {
    await shopPageService.filterProducts(req, res);
});

router.get('/liveSearchProduct/:searchString', async function (req, res) {
    await shopPageService.liveSearchProduct(req, res);
});

router.post('/getRelatedProducts', async function (req, res) {
    await shopPageService.getRelatedProducts(req, res);
});
module.exports = router;
