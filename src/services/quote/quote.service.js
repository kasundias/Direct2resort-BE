var con = require('../../config/dbConnection');
var quoteQuery = require('../../loaders/quoteQuery');
var util = require('../../services/util/util.service');
const jwt = require('jsonwebtoken');
const { exist } = require('@hapi/joi');

const utilService = new util();

const NotificationService = require('../../services/util/notification.service');
const notificationSe = new NotificationService();

class Quote {
    async getQuoteListByBuyer(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const getQuoteList = await utilService.asynqQuery(quoteQuery.getAllQuotesByBuyerQuery, [decoded.id]);
        if (!getQuoteList) {
            return res.status(400).send({message: getQuoteList});
        }
        return res.status(200).send({message: 'Success', data: getQuoteList});
    }

    async getQuoteByIdByBuyer(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const getQuoteById = await utilService.asynqQuery(quoteQuery.getQuotesByIdQuery, [decoded.id, req.params.QuoteId]);

        if (!getQuoteById) {
            return res.status(400).send({message: getQuoteById});
        }
        return res.status(200).send({message: 'Success', data: getQuoteById});
    }

    async createQuote(req, res) {
        try {
            const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
            var dateTime = new Date();
            const parentQuoteDetails = {
                parent_quote_create_date: dateTime, freight_method: req.body.freight_method
            };
            const reponse = await utilService.asynqQuery(quoteQuery.addParentQuote, parentQuoteDetails);
            if (reponse.insertId) {
                const quoteDetails = {
                    buyer_id: decoded.id, ParentQuote_parent_quote_id: reponse.insertId,
                    Product_product_id: req.body.Product_product_id, Product_Company_company_id: req.body.Product_Company_company_id,
                    selected_product_variants_id_list: req.body.selected_product_variants_id_list,
                    quantity: req.body.quantity, created_date: dateTime,
                };
                const quoteResponse = await utilService.asynqQuery(quoteQuery.addQuotes, quoteDetails);
                if (quoteResponse.insertId) {
                    const quoteInstanceDetails = {
                        buyer_msg: req.body.buyer_msg,
                        Quotes_quote_id: quoteResponse.insertId,
                        buyer_msg_time: dateTime
                    };
                    await utilService.asynqQuery(quoteQuery.addQuoteInstance, quoteInstanceDetails);
                }
            }
        } catch (e) {
            return res.status(400).send({message: e});
        } finally {
            return res.status(200).send({message: 'Success'});
        }
    }


    async adminQuoteInstanceApproveToSeller(req, res) {
        try {
            await utilService.asynqQuery(quoteQuery.adminAuthToSeller, [req.body.quote_admin_status, req.body.quote_instance_id]);
        } catch (e) {
            return res.status(400).send({message: e});
        } finally {
            return res.status(200).send({message: 'Success'});
        }
    }
    async adminQuoteInstanceApproveToBuyer(req, res) {
        try {
            await utilService.asynqQuery(quoteQuery.adminAuthToSeller, [req.body.quote_admin_status, req.body.quote_instance_id]);
        } catch (e) {
            return res.status(400).send({message: e});
        } finally {
            return res.status(200).send({message: 'Success'});
        }
    }
    async sellerModifyQuoteInstance(req, res) {
        try {
            await utilService.asynqQuery(quoteQuery.sellerUpdateInstance, [req.body.seller_price, req.body.seller_msg, req.body.quote_instance_id]);
        } catch (e) {
            return res.status(400).send({message: e});
        } finally {
            return res.status(200).send({message: 'Success'});
        }
    }
    async buyerMessage(req, res) {
        var dateTime = new Date();
        try {
            const quoteInstanceDetails = {
                buyer_msg: req.body.buyer_msg,
                Quotes_quote_id: req.body.Quotes_quote_id,
                buyer_msg_time: dateTime
            };
            await utilService.asynqQuery(quoteQuery.addQuoteInstance, quoteInstanceDetails);
            await utilService.asynqQuery(quoteQuery.updateLastUpDate, [dateTime, req.body.Quotes_quote_id]);

        } catch (e) {
            return res.status(400).send({message: e});
        } finally {
            return res.status(200).send({message: 'Success'});
        }
    }
    async getQuoteInstanceDetailsSeller(req, res) {
        var response;
        try {
            response = await utilService.asynqQuery(quoteQuery.getQuoteInstanceSellerQuery, [req.params.QuoteId]);
            for (var a = 0; a < response.length; a++) {
                console.log(response[a].quote_admin_status);
                if (response[a].quote_admin_status === 'To Seller') {
                    response[a].buyer_msg = null;
                }
            }
        } catch (e) {
            return res.status(400).send({message: e});
        } finally {
            console.log(response);
            return res.status(200).send({message: 'Success', data: response});
        }
    }
    async getQuoteInstanceDetailsBuyer(req, res) {
        var response;
        try {
            response = await utilService.asynqQuery(quoteQuery.getQuoteInstanceBuyerQuery, [req.params.QuoteId]);
            for (var a = 0; a < response.length; a++) {
                console.log(response[a].quote_admin_status);
                if (response[a].quote_admin_status !== 'Approved') {
                    response[a].seller_msg = null;
                    response[a].seller_price = null;
                }
            }
        } catch (e) {
            return res.status(400).send({message: e});
        } finally {
            return res.status(200).send({message: 'Success', data: response});
        }
    }

    async getQuoteListByCompany(req, res) {
        var getQuoteList;
        var response;
        try {
            const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
            getQuoteList = await utilService.asynqQuery(quoteQuery.getAllQuotesByCompanyQuery, [decoded.companyId]);
        } catch (e) {
            return res.status(400).send({message: e});
        } finally {

            return res.status(200).send({message: 'Success', data: getQuoteList});


        }
    }

    async getQuoteProductDetailsBySeller(req, res) {
        var response;
        var minval;
        try {
            response = await utilService.asynqQuery(quoteQuery.getProductDetailsByQuoteQuery, [req.params.QuoteId]);
            

            if(response[0].logistic_bid_admin_aproval==0){
                minval = await utilService.asynqQuery(quoteQuery.getLpMinQuery, [response[0].ParentQuote_parent_quote_id]);
                response[0].minval=minval;
            }else{
                minval = await utilService.asynqQuery(quoteQuery.getApprovedLpValQuery, [response[0].ParentQuote_parent_quote_id]);
                response[0].minval=minval;

            }
        } catch (e) {
            return res.status(400).send({message: e});
        } finally {
            return res.status(200).send({message: 'Success', data: response});
        }
    }
    async sellerMessage(req, res) {
        var dateTime = new Date();
        try {

            await utilService.asynqQuery(quoteQuery.updateQuoteInstanceSellerQuery, [req.body.seller_price, req.body.seller_msg, dateTime, req.body.seller_unit_price, req.body.quote_instance_id]);
            await utilService.asynqQuery(quoteQuery.updateLastUpDate, [dateTime, req.body.Quotes_quote_id]);

        } catch (e) {
            return res.status(400).send({message: e});
        } finally {
            return res.status(200).send({message: 'Success'});
        }
    }
    async getQuoteByIdBySeller(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const getQuoteById = await utilService.asynqQuery(quoteQuery.getQuotesBySellerIdQuery, [decoded.companyId, req.params.QuoteId]);

        if (!getQuoteById) {
            return res.status(400).send({message: getQuoteById});
        }
        return res.status(200).send({message: 'Success', data: getQuoteById});
    }
    async getLastQuoteInstanceId(req, res) {
        var response;
        try {
            response = await utilService.asynqQuery(quoteQuery.getLastQuoteInstanceIdQuery, [req.params.QuoteId]);

        } catch (e) {
            return res.status(400).send({message: e});
        } finally {
            return res.status(200).send({message: 'Success', data: response});
        }
    }

    async sellerCloseQuote(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const getBorS = await utilService.asynqQuery(quoteQuery.getBuyerSellerQuery, [req.body.quoteId])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false});                                    
        });

        const response = await utilService.asynqQuery(quoteQuery.sellerCloseQuoteQuery, [req.body.quoteId, decoded.id])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false});                                    
        });

        const notificationMsg = `Quote ${req.body.quoteId} has been closed by the seller`;
        await notificationSe.createNotification('ADMIN', 'SELLER', '-1', 'QUOTE', req.body.quoteId, notificationMsg);
        await notificationSe.createNotification('BUYER', 'SELLER', getBorS[0].buyer_id, 'QUOTE', req.body.quoteId, notificationMsg);

        return res.status(200).send({message: 'Success', status: true});
    }

    async buyerCloseQuote(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const getBorS = await utilService.asynqQuery(quoteQuery.getBuyerSellerQuery, [req.body.quoteId])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false});                                    
        });

        const response = await utilService.asynqQuery(quoteQuery.buyerCloseQuoteQuery, [req.body.quoteId, decoded.id])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false});                                    
        });

        const notificationMsg = `Quote ${req.body.quoteId} has been closed by the seller`;
        await notificationSe.createNotification('ADMIN', 'SELLER', '-1', 'QUOTE', req.body.quoteId, notificationMsg);
        await notificationSe.createNotification('SELLER', 'BUYER', getBorS[0].seller_id, 'QUOTE', req.body.quoteId, notificationMsg);

        return res.status(200).send({message: 'Success', status: true});
    }
    
}
module.exports = Quote;
