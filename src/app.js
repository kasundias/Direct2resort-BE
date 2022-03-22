var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const fileupload = require('express-fileupload');

//Sequelize DB
const sdb = require('./api_v2/models');


var auth = require('./api/auth/userRegister.controller.js');
var product = require('./api/products/product.controller');
var util = require('./api/util/util.controller');
var pathNode = require('path');
var adminApp = require('./api/admin/adminApproal.controller');
var shop = require('./api/shop/shopPage.controller');
var seller = require('./api/seller/seller.controller');
var fileuploader = require('./api/util/fileUploader.controller');
var quote =require('./api/quote/quote.controller');
var lp =require('./api/logisticpartner/logisticPartner.controller');
var buyer =require('./api/buyer/buyer.controller');
var ps = require('./api/productseries/productSeries.controller');
var chat = require('./api/chat/chat.controller');
var notifications = require('./api/notification/notifications.controller');

dotenv.config();

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json({limit: '10mb', extended: true}));

app.use( fileupload());
app.use(express.static(pathNode.resolve('public')));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    next();
  });

app.use('/api/auth',auth);
app.use('/api/product',product);
app.use('/api/uploader',fileuploader);
app.use('/api/util',util);
app.use('/api/quote',quote);
app.use('/api/admin', adminApp);
app.use('/api/shop', shop);
app.use('/api/seller', seller);
app.use('/api/lp',lp);
app.use('/api/buyer',buyer);
app.use('/api/series',ps);
app.use('/api/chat',chat);
app.use('/api/notifications', notifications);

//API V2
const productMessageController = require('./api_v2/productMessage.controller');
app.use('/apiv2/productmessage', productMessageController);



//Test Sequelize
sdb.sequelize.sync().then(() => {
    sdb.sequelize.authenticate()
    .then(() => console.log('DB Connected with Sequelize'))
    .catch(err => console.log('error:' + err));

    var server = app.listen(8000, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Example app listening at http://%s:%s', host, port);
    });
});


    