var chatQuery =require('../../loaders/chatQuery');
var GeneralQueryService=require('../../services/util/util.service');
const jwt = require('jsonwebtoken');
const generalQuery = new GeneralQueryService();
var base64Img = require('base64-img');
var FlakeId = require('flake-idgen');
var flakeIdGen = new FlakeId();
var intformat = require('biguint-format'), FlakeId = require('flake-idgen');

class Chat{
     
    async getAllChatAdmin(req,res){
        const response = await generalQuery.asynqQuery(chatQuery.getAllChatAdminQuery);
        if (!response) {
            return res.status(400).send({message:response});
        }
        return res.status(200).send({message:'Success', data : response});
    }
    async createNewChatBuyer(req,res){
      //  const isAdmin = await generalQuery.tokenCheckAdmin(req.header('authorization'));
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        var dateTime = new Date();
        var user;        
        user=decoded.companyId;
      //  var threadId=userid+req.body.product_id;
      var threads;
        if(decoded.userType==2){
            threads=req.body.threadId;

        }else{
            
            threads=decoded.companyId+req.body.product_id;
            console.log('here '+threads);

        }
        const msg = {
            message_body: req.body.quoteMessage,
            created_date: dateTime,
            user_category: decoded.userType,
            user_id : user,
            thread_id : threads,
            buyer_id : req.body.buyerId,
            seller_id : req.body.sellerId,
            product_id :req.body.product_id
        };
        const response = await generalQuery.asynqQuery(chatQuery.createNewChatQuery,msg);
        if (!response) {
            return res.status(400).send({message:response});
        }
        return res.status(200).send({message:'Success', data : threads});
    } 

    async getSingleChatAdmin(req,res){
        const response = await generalQuery.asynqQuery(chatQuery.getSingleChatQuery,[req.params.threadId]);
        if (!response) {
            return res.status(400).send({message:response});
        }
        return res.status(200).send({message:'Success', data : response});
    }
    async getAllChatBuyer(req,res){
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);

        const response = await generalQuery.asynqQuery(chatQuery.getAllChatBuyerQuery,[decoded.companyId]);
        if (!response) {
            return res.status(400).send({message:response});
        }
        return res.status(200).send({message:'Success', data : response});
    }
    async getAllChatSeller(req,res){
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);

        const response = await generalQuery.asynqQuery(chatQuery.getAllChatSellerQuery,[decoded.companyId]);
        if (!response) {
            return res.status(400).send({message:response});
        }
        return res.status(200).send({message:'Success', data : response});
    }
    async getSingleChatNonAdmin(req,res){
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);

        const response = await generalQuery.asynqQuery(chatQuery.getSingleChatNonAdminQuery,[req.params.threadId,decoded.companyId]);
        if (!response) {
            return res.status(400).send({message:response});
        }
        return res.status(200).send({message:'Success', data : response});
    }

    async updateAdminApproval(req,res){
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);

        await generalQuery.asynqQuery(chatQuery.updateAdminApprovalQuery,[req.body.chatId]);
        const response = await generalQuery.asynqQuery(chatQuery.getThreadIdQuery,[req.body.chatId]);
        if (!response) {
            return res.status(400).send({message:response});
        }
        return res.status(200).send({message:'Success', data : response});
    }
}
module.exports = Chat;
