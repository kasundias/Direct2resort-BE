var express = require('express');
var router = express.Router();
var seller = require('../../services/chat/chat.service');
const sellerService = new seller();
const verify = require('../../services/jwtVerify.service');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

router.get('/getAllChatAdmin', verify, async function (req, res) {
    sellerService.getAllChatAdmin(req,res);
});

router.post('/createNewChat', verify, async function (req, res) {
    sellerService.createNewChatBuyer(req,res);
});
router.get('/getSingleChatAdmin/:threadId', verify, async function (req, res) {
    sellerService.getSingleChatAdmin(req,res);
});
router.get('/getAllChatBuyer', verify, async function (req, res) {
    sellerService.getAllChatBuyer(req,res);
});
router.get('/getAllChatSeller', verify, async function (req, res) {
    sellerService.getAllChatSeller(req,res);
});
router.get('/getSingleChatNonAdmin/:threadId', verify, async function (req, res) {
    sellerService.getSingleChatNonAdmin(req,res);
});
router.put('/updateAdminApproval', verify, async function (req, res) {
    sellerService.updateAdminApproval(req,res);
});

// router.put('/updateReadyToShipStatus/:quoteId', verify, async function (req, res) {
//     sellerService.updateReadyToShipStatus(req,res);
// });

module.exports = router;
