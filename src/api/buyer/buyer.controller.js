var express = require('express');
var router = express.Router();
const verify = require('../../services/jwtVerify.service');
var buyer = require('../../services/buyer/buyer.service');
const buyerService = new buyer();


router.put('/rejectQuoteInstance', verify, async function (req, res) {
    buyerService.rejectQuoteInstance(req,res);
});

router.put('/updateClientApproval',verify,async function(req,res){
    buyerService.updateQuoteClientAproval(req,res);
});
router.put('/rejectQuoteWithMsg',verify,async function(req,res){
    buyerService.rejectQuoteWithMsg(req,res);
});
router.get('/getLpSubmitedQuotes',verify,async function(req,res){
    buyerService.getLpSubmitedQuotes(req,res);
});
router.post('/confirmLsr',verify,async function(req,res){
    buyerService.confirmLsr(req,res);
});
module.exports = router;
