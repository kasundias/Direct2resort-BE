var express = require('express');
var router = express.Router();
const verify = require('../../services/jwtVerify.service');
var multer  = require('multer');
var logisticPartner = require('../../services/logisticpartner/logisticPartner.service');
const logisticPartnerService = new logisticPartner();

router.get('/getQuoteFrightForLPList', verify, async function (req, res) {
    logisticPartnerService.getQuoteFrightForLPList(req,res);
});
router.get('/getQuoteFrightForLPListSingle/:frightDataId', verify, async function (req, res) {
    logisticPartnerService.getQuoteFrightForLPListSingle(req,res);
});
router.post('/saveLogisticPartnerBid', verify, async function (req, res) {
    logisticPartnerService.saveLogisticPartnerBid(req,res);
});
router.get('/getBidsPerQuote/:ParentQuote_parent_quote_id', verify, async function (req, res) {
    logisticPartnerService.getBidsPerQuote(req,res);
});
router.get('/bidHistory', verify, async function (req, res) {
    logisticPartnerService.bidHistory(req,res);
});
module.exports = router;
