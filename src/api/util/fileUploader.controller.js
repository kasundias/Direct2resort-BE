var FlakeId = require('flake-idgen');
var flakeIdGen = new FlakeId();
var intformat = require('biguint-format'), FlakeId = require('flake-idgen')
var pathNode = require('path');
var express = require('express');
var router = express.Router();
const verify=require('../../services/jwtVerify.service');
var GeneralQueryService = require('../../services/util/util.service');
const generalQuery = new GeneralQueryService();

router.post('/saveImage',verify, (req, res) => {
    generalQuery.imageUploader(req,res);
});
module.exports = router;
