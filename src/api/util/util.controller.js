var express = require('express');
var router = express.Router();
var utils = require('../../services/util/util.service');
const verify=require('../../services/jwtVerify.service');
const utilService = new utils();
router.get('/getCountryList',verify,async function (req, res) {
    utilService.getCountryList(req,res);
});
router.get('/getUnitsList',verify,async function (req, res) {
    utilService.getUnitList(req,res);
});
module.exports = router;
