var GeneralQueryService = require('../../services/util/util.service');
const jwt = require('jsonwebtoken');
const generalQuery = new GeneralQueryService();
var lpQuery = require('../../loaders/logisticPartnerQuery');
var moment = require('moment');

class LogisticPartner{

    async getQuoteFrightForLPList(req,res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);

        const response = await generalQuery.asynqQueryNoParams(lpQuery.getQuoteFrightForLPQuery);
        for (var a=0;a<response.length;a++){
            response[a].minval = await generalQuery.asynqQuery(lpQuery.getMinBidByQuoteQuery,[response[a].quote_frieght_uuid]);
            response[a].count = await generalQuery.asynqQuery(lpQuery.getCountByQuoteQuery,[response[a].quote_frieght_uuid]);            
            const checkIfLPbidSubmited = await generalQuery.asynqQuery(lpQuery.checkLpIfBidQuery, [response[a].quote_uuid, decoded.companyId]);
            if(checkIfLPbidSubmited.length) {
                if(checkIfLPbidSubmited[0].Company_company_id === decoded.companyId) {
                    response[a].lpBidSubmited = true;
                } else {
                    response[a].lpBidSubmited = false;
                }
            } else {
                response[a].lpBidSubmited = false;
            }
        }
        return res.status(200).send({message: 'Success', data: response});
    }
    async getQuoteFrightForLPListSingle(req,res) {
        const response = await generalQuery.asynqQuery(lpQuery.getQuoteFrightLPSingleQuery,[req.params.frightDataId]);
        const newresponse =  await generalQuery.asynqQuery(lpQuery.getMinBidByQuoteQuery,[req.params.frightDataId]);
        response[0].minval = newresponse[0].minval;
        return res.status(200).send({message: 'Success', data: response});
    }
    async saveLogisticPartnerBid(req,res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        var dateTime = new Date();
        const javaScriptRelease = new Date(req.body.eta);
        let bidTotal;

        if(req.body.airFreightTotal !== 0 && req.body.seaFreightTotal !== 0) {
            bidTotal = (req.body.airFreightTotal + req.body.seaFreightTotal);
        } else if(req.body.airFreightTotal === 0 && req.body.seaFreightTotal !== 0) {
            bidTotal = req.body.seaFreightTotal;
        } else if(req.body.airFreightTotal !== 0 && req.body.seaFreightTotal === 0) {
            bidTotal = req.body.airFreightTotal;
        }

        const bidDetails = {
            quote_uuid: req.body.quote_uuid,
            sea_frieght_data_json: JSON.stringify(req.body.sea_frieght_data_json),
            air_frieght_data_json: JSON.stringify(req.body.air_frieght_data_json),
            seaEta: new Date(req.body.seaEta),
            airEta: new Date(req.body.airEta),
            special_remarks: req.body.special_remarks,
            Company_company_id: decoded.companyId,
            bid_submited_date: dateTime,
            airFreightTotal: req.body.airFreightTotal,
            seaFreightTotal: req.body.seaFreightTotal,
            bid_total_price: bidTotal
        };
        const response = await generalQuery.asynqQuery(lpQuery.saveLogisticPartnerBidQuery, bidDetails);
        return res.status(200).send({message: 'Success', data: response});
    }
	async getBidsPerQuote(req,res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);

        const response = await generalQuery.asynqQuery(lpQuery.getBidsPerQuoteQuery,[decoded.companyId,req.params.ParentQuote_parent_quote_id]);
        
        return res.status(200).send({message: 'Success', data: response});
    }

    async bidHistory(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        if(decoded.userType === 3) {
            const response = await generalQuery.asynqQuery(lpQuery.getBidHistoryQuery,[decoded.companyId]);
            return res.status(200).send({message: 'Success', data: response});
        } else {
            return res.status(401).send({message: 'Not Authorized', status: false});
        }
    }
}
module.exports = LogisticPartner;
