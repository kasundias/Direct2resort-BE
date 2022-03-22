var express = require('express');
var router = express.Router();
var quote = require('../../services/quote/quote.service');
const verify=require('../../services/jwtVerify.service');
const quoteService = new quote();

router.post('/createQuote',verify,async function(req,res){
    quoteService.createQuote(req,res);
});
router.get('/getQuoteListBuyer',verify,async function(req,res){
    quoteService.getQuoteListByBuyer(req,res);
});
router.get('/getQuoteBuyer/:QuoteId',verify,async function(req,res){
    quoteService.getQuoteByIdByBuyer(req,res);
});

router.get('/getQuoteInstanceDetailsBuyer/:QuoteId',verify,async function(req,res){
    quoteService.getQuoteInstanceDetailsBuyer(req,res);
});
router.get('/getQuoteInstanceDetailsSeller/:QuoteId',verify,async function(req,res){
    quoteService.getQuoteInstanceDetailsSeller(req,res);
});
router.post('/buyerSendMessage',verify,async function(req,res){
    quoteService.buyerMessage(req,res);
});
router.get('/getQuoteListCompany',verify,async function(req,res){
    quoteService.getQuoteListByCompany(req,res);
});
router.get('/getQuoteProductDetailsSeller/:QuoteId',verify,async function(req,res){
    quoteService.getQuoteProductDetailsBySeller(req,res);
});
router.put('/sellerSendOffer',verify,async function(req,res){
    quoteService.sellerMessage(req,res);
});
router.get('/getQuoteSeller/:QuoteId',verify,async function(req,res){
    quoteService.getQuoteByIdBySeller(req,res);
});
router.get('/getLastQuoteInstanceId/:QuoteId',verify,async function(req,res){
    quoteService.getLastQuoteInstanceId(req,res);
});
router.post('/sellerCloseQuote', verify, async function(req,res) {
    quoteService.sellerCloseQuote(req,res);
});
router.post('/buyerCloseQuote', verify, async function(req,res) {
    quoteService.buyerCloseQuote(req,res);
});

module.exports = router;
