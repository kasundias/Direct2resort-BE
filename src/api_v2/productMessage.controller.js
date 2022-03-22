const express = require('express');
const router = express.Router();
const verify = require('../services/jwtVerify.service');
const productMessageService = require('./services/productMessage.service');
const productMessage = new productMessageService();

const testUserService = require('./services/testUser');
const testUser = new testUserService();

router.get('/getProductMsgs', verify, async function (req, res) {
    productMessage.getProductMsgs(req, res);
});
router.get('/getProductMsgInstances/:uuid', verify, async function (req, res) {
    productMessage.getProductMsgInstances(req, res);
});
router.post('/buyerSendMsg', verify, async function (req, res) {
    productMessage.buyerSendProductMsg(req, res);
});
router.post('/sendMsg', verify, async function (req, res) {
    productMessage.sendMsg(req, res);
});
router.post('/setMsgSeen', verify, async function (req, res) {
    productMessage.setMsgSeen(req, res);
});

router.get('/adminGetProductMsgs', verify, async function (req, res) {
    productMessage.adminGetProductMsgs(req, res);
});
router.get('/adminGetMsgInstance/:uuid', verify, async function (req, res) {
    productMessage.adminGetMsgInstance(req, res);
});
router.post('/adminApproveProdcutMsg', verify, async function (req, res) {
    productMessage.adminApproveProdcutMsg(req, res);
});
router.post('/adminRejectProdcutMsg', verify, async function (req, res) {
    productMessage.adminRejectProdcutMsg(req, res);
});


router.get('/dropTbl', async function (req, res) {
    productMessage.dropTable(req, res);
});
module.exports = router;
