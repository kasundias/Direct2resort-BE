var express = require('express');
var router = express.Router();
var adminApproal=require('../../services/admin/adminApproval.service');
const verify=require('../../services/jwtVerify.service');
const adminApproalService = new adminApproal();

router.get('/ceneralPersonalStatus',verify, async function (req, res) {
        await adminApproalService.getGeneralPersonalUserStatus(req,res);
});

router.get('/companyStatus',verify, async function (req, res) {
       await adminApproalService.getCompanyStatus(req,res);
});

 router.put('/adminUpdateCompanyStatus',verify, async function (req, res) {
        await adminApproalService.updateCompanyStatus(req,res);
 });

 router.delete('/adminDeleteGeneralUser',verify, async function (req, res) {
        await adminApproalService.deleteGenaralUser(req,res);
 });

 router.delete('/adminDeleteCompany',verify, async function (req, res) {
        await adminApproalService.deleteCompany(req,res);
 });
 router.post('/getAllProducts',verify, async function (req, res) {
       await adminApproalService.getAllProducts(req,res);
});
router.put('/updateQuote/:QuoteId',verify, async function (req, res) {
       await adminApproalService.updateQuoteByAdmin(req,res);
});
router.put('/deleteQuote/:QuoteId',verify, async function (req, res) {
       await adminApproalService.deleteQuotesAdmin(req,res);
});
router.put('/updateAdminQuoteInstanceApproval',verify, async function (req, res) {
       await adminApproalService.updateAdminQuoteInstanceApproval(req,res);
});
router.get('/getMarkupPricesInfo/:quote_instance_id/:product_id',verify, async function (req, res) {
       await adminApproalService.getMarkupPricesInfo(req,res);
});
router.post('/getAllSellers',verify, async function (req, res) {
       await adminApproalService.getAllSellers(req,res);
});
router.post('/getAllBuyers',verify, async function (req, res) {
       await adminApproalService.getAllBuyers(req,res);
});
router.post('/getAllLogistic',verify, async function (req, res) {
       await adminApproalService.getAllLogistic(req,res);
});
router.post('/userStatusUpdate',verify, async function (req, res) {
       await adminApproalService.userStatusUpdate(req,res);
});
router.post('/addAdminUser',verify, async function (req, res) {
       await adminApproalService.addAdminUser(req,res);
});
router.get('/getAllAdminUsers',verify, async function (req, res) {
       await adminApproalService.getAllAdminUsers(req,res);
});
router.post('/approveRejectProduct',verify, async function (req, res) {
       await adminApproalService.approveRejectProduct(req,res);
});
router.get('/getAllQuotes',verify, async function (req, res) {
       await adminApproalService.getAllQuotes(req,res);
});
router.get('/getAllQuoteInstances/:quoteId',verify, async function (req, res) {
       await adminApproalService.getAllQuoteInstances(req,res);
});
router.get('/getQuoteById/:quoteId',verify, async function (req, res) {
       await adminApproalService.getQuoteById(req,res);
});
router.get('/getQuoteUnApprovedAdmin',verify, async function (req, res) {
       await adminApproalService.getAllQuotesUnApprovedAdmin(req,res);
});
router.get('/getQuoteApprovedAdmin',verify, async function (req, res) {
       await adminApproalService.getAllQuotesApprovedAdmin(req,res);
});
router.post('/addCategory',verify, async function (req, res) {
       await adminApproalService.addCategory(req,res);
});
router.put('/updateCategory',verify, async function (req, res) {
       await adminApproalService.updateCategory(req,res);
});
router.get('/deleteCategory/:catId',verify, async function (req, res) {
       await adminApproalService.deleteCategory(req,res);
});
router.get('/getAllCategories',verify, async function (req, res) {
       await adminApproalService.getAllCategories(req,res);
});
router.post('/addSubCategory',verify, async function (req, res) {
       await adminApproalService.addSubCategory(req,res);
});
router.get('/getAllSubCategories',verify, async function (req, res) {
       await adminApproalService.getAllSubCategories(req,res);
});
router.post('/addCategorySpecAttr',verify, async function (req, res) {
       await adminApproalService.addCategorySpecAttr(req,res);
});
router.get('/getAllCatAttrs',verify, async function (req, res) {
       await adminApproalService.getAllCatAttrs(req,res);
});
router.get('/getQuoteUnApprovedAdminCost',verify, async function (req, res) {
       await adminApproalService.getAllQuotesUnApprovedAdmin(req,res);
});
router.put('/updateAdminQuoteInstanceApprovalBuyer',verify, async function (req, res) {
       await adminApproalService.updateAdminQuoteInstanceApprovalBuyer(req,res);
});
router.post('/toggleFeaturedProduct',verify, async function (req, res) {
       await adminApproalService.toggleFeaturedProduct(req,res);
});
router.get('/getlpbidlist',verify, async function (req, res) {
       await adminApproalService.getlpbidlist(req,res);
});
router.get('/getlpbidviewSingle/:quoteId',verify, async function (req, res) {
       await adminApproalService.getlpbidviewSingle(req,res);
});
router.get('/getlpDetailedView/:lpBidId',verify, async function (req, res) {
       await adminApproalService.getlpDetailedView(req,res);
});
router.put('/updateapproveSelectLpBid',verify, async function (req, res) {
       await adminApproalService.updateapproveSelectLpBid(req,res);
});
router.put('/getCompanyDetailsByUser/:gen_p_user_id',verify, async function (req, res) {
       await adminApproalService.getCompanyDetailsByUser(req,res);
});
router.get('/getCompanyByUser/:companyId',verify, async function (req, res) {
       await adminApproalService.getCompanyByUser(req,res);
});
router.get('/getCategoryIcons',verify, async function (req, res) {
       await adminApproalService.getCategoryIcons(req,res);
});
router.post('/getSampleRequests', verify, async function (req, res) {
       await adminApproalService.getSampleRequests(req,res);
});
router.get('/sampleReqStatusUpdate/:reqId', verify, async function (req, res) {
       await adminApproalService.sampleReqStatusUpdate(req,res);
});
router.post('/bidSubmit', verify, async function (req, res) {
       await adminApproalService.submitBidToBuyer(req,res);
});
module.exports = router;
