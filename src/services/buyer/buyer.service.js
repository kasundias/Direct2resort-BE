var buyerQuery = require('../../loaders/buyerQuery');
var GeneralQueryService = require('../../services/util/util.service');
const jwt = require('jsonwebtoken');
const generalQuery = new GeneralQueryService();
var moment = require('moment');

class Buyer {
    async rejectQuoteInstance(req,res) {
        const response = await generalQuery.asynqQuery(buyerQuery.quoteInstanceBuyerRejectQuery, [req.body.quoteId, req.body.quoteInstanceId]);
        return res.status(200).send(response);
    }

    async updateQuoteClientAproval(req, res) {
        var dateTime = new Date();

        const updateQuoteClientAproval = await generalQuery.asynqQuery(buyerQuery.updateClientApprovalQuery, 
            [req.body.approved_quote_instance_id, dateTime, req.body.quote_id]);
        
        const updateQuoteInstance = await generalQuery.asynqQuery(buyerQuery.quoteInstanceApprovalQuery, 
            [dateTime, req.body.quote_id, req.body.approved_quote_instance_id]);

        if (!updateQuoteClientAproval || !updateQuoteInstance) {
            return res.status(400).send({message: 'Quote Approval Failed'});
        }

        return res.status(200).send({message: 'Success', data: updateQuoteInstance});
    }

    async rejectQuoteWithMsg(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);

        const checkIfUserHasQuote = await generalQuery.asynqQuery(buyerQuery.checkIfUserHasQuoteQuery, [req.body.quote_id, decoded.id])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });

        if(checkIfUserHasQuote[0].series_quote_id > 0) {
            const rejectWithMsg = await generalQuery.asynqQuery(buyerQuery.sellerRejectQuoteWithMsgQuery, [req.body.quoteRejectMessage, req.body.series_instance_id, req.body.quote_id])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });

            if(rejectWithMsg.changedRows > 0) {
                return res.status(200).send({message: 'Quote rejected with a message', status: true});
            } else {
                return res.status(400).send({message: 'Something went wrong please try again', status: false});  
            }
            
        } else {
            return res.status(400).send({message: 'Quote not found for this user', status: false});
        }       
    }

    async getLpSubmitedQuotes(req, res) {
        let response = [];
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        
        const quoteList = await generalQuery.asynqQuery(buyerQuery.getQuoteQuoteInstancesSubmittedToLPQuery,[decoded.id])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });

        for (let index = 0; index < quoteList.length; index++) {
            const adminApprovedBids = await generalQuery.asynqQuery(buyerQuery.getAdminAprovedBidsQuery,[quoteList[index].quote_uuid])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });

            response.push({
                quote_uuid: quoteList[index].quote_uuid,
                bidData: adminApprovedBids
            });
        }        
        return res.status(200).send({data: response});
    }

    async confirmLsr(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        let fType = "";

        if(req.body.freightType === 'air') {
            fType = 'Air';
        } else {
            fType = 'Sea';
        }
       
        const checkIfBuyerHasData = await generalQuery.asynqQuery(buyerQuery.checkIfBuyerHasQuery,[decoded.id, req.body.lpBidId])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });
        
        if(checkIfBuyerHasData.length > 0) {
            const approveLsr = await generalQuery.asynqQuery(buyerQuery.updateLsrBuyerQuery,[req.body.quote_uuid, decoded.id, req.body.lpBidId, req.body.selectedBidId])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
            
            const updateSeriesQuote = await generalQuery.asynqQuery(buyerQuery.updateSeriesQuoteQuery,[fType, req.body.quote_uuid, decoded.id])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });

            const rejectOthers = await generalQuery.asynqQuery(buyerQuery.rejectLsrAutoQuery,[req.body.quote_uuid, req.body.selectedBidId])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
            
            const updateLpBid = await generalQuery.asynqQuery(buyerQuery.updateLpBidQuery,[req.body.lpBidId, req.body.quote_uuid])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
            
            const rejectLpBidOthers = await generalQuery.asynqQuery(buyerQuery.rejectLpBidQuery,[req.body.quote_uuid, req.body.lpBidId])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });         

            return res.status(200).send({updateLpBid});
        }
       
    }
}

module.exports = Buyer;
