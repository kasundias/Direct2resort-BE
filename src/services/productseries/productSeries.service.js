var psQuery = require('../../loaders/productSeriesQuery');
var productQuery = require('../../loaders/productQuery');
var util = require('../../services/util/util.service');
const jwt = require('jsonwebtoken');
const { response } = require('express');
const { normalLogin } = require('../../loaders/userQuery');
const utilService = new util();
var GeneralQueryService = require('../../services/util/util.service');
const generalQuery = new GeneralQueryService();
var adminAppQuery = require('../../loaders/adminApproalQuery');
var isBase64 = require('is-base64');
const nanoId = require('nanoid');

const NotificationService = require('../../services/util/notification.service');
const notificationSe = new NotificationService();

class ProductSeries {

    async getProductSeriesAllByCategory(req, res) {
        if(req.body.categoryId > 0) {
            const getPsList = await utilService.asynqQuery(psQuery.getPsAllQuery);
            if (!getPsList) {
                return res.status(400).send({ message: getPsList });
            }
            return res.status(200).send({ message: 'Success', data: getPsList });

        } else {
            const getPsList = await utilService.asynqQuery(psQuery.getPsByCategoryQuery, [req.body.categoryId]);
            if (!getPsList) {
                return res.status(400).send({ message: getPsList });
            }
            return res.status(200).send({ message: 'Success', data: getPsList });
        }
      
    }
    async getProductSeriesSingle(req, res) {
        const getPsList = await utilService.asynqQuery(psQuery.getProductSeriesSingleQuery, [req.params.productSeriesRefId]);
        if(getPsList.length) {
            return res.status(200).send({ message: 'Success', data: getPsList });
        } else {
            return res.status(400).send({ message: 'No Results Found', status: false});
        }
    }
    async getProductSeriesRefDetails(req, res) {
        const getPsList = await utilService.asynqQuery(psQuery.getProductSeriesRefDetailsQuery, [req.params.productSeriesURL]);
        if(getPsList.length) {
            return res.status(200).send({ message: 'Success', data: getPsList });
        } else {
            return res.status(400).send({ message: 'Not Results Found', status: false});
        }
    }
    async createQuote(req, res) {

        const nanoIdGen = nanoId.customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6);  
        const quoteUniqueId = nanoIdGen();    
        let quoteUuid;

        var quoteProductsList;
        
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        var dateTime = new Date();
        const parentQuoteDetails = {
            parent_quote_create_date: dateTime, freight_method: req.body.freight_method
        };

        const reponse = await utilService.asynqQuery(psQuery.addParentQuote, parentQuoteDetails)
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });
        
        quoteUuid = `${quoteUniqueId}${reponse.insertId}`;

        const updateParentQuoteUuid = await utilService.asynqQuery(psQuery.updateParentQuoteUuidQuery, [quoteUuid, reponse.insertId])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });
        
        if (reponse.insertId) {
            const quoteDetails = {
                quote_uuid: quoteUuid,
                buyer_id: decoded.id, ParentQuote_parent_quote_id: reponse.insertId,
                Product_Company_company_id: req.body.Product_Company_company_id,
                created_date: dateTime,
                last_updated_date: dateTime,
                seller_id: req.body.product_created_by,
                frieght_method: req.body.freightMethod
            };

            const quoteResponse = await utilService.asynqQuery(psQuery.addQuotes, quoteDetails)
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
                        
            for (var a = 0; a < req.body.productsList.length; a++) {
                var productDetails = {
                    Product_product_id: req.body.productsList[a].product_id,
                    SeriesQuote_ParentQuote_parent_quote_id: reponse.insertId,
                    quantity: req.body.productsList[a].qty,
                    quote_uuid: quoteUuid
                };

                quoteProductsList = await utilService.asynqQuery(psQuery.addSeriesProductsList, productDetails)
                .catch(error => {
                    return res.status(400).send({message: error.code, status: false}); 
                });                
            }

            if (quoteResponse.insertId) {
                const quoteInstanceDetails = {
                    SeriesQuote_ParentQuote_parent_quote_id: reponse.insertId,
                    quote_uuid: quoteUuid
                };

                const quoteInstanceDet = await utilService.asynqQuery(psQuery.addQuoteInstance, quoteInstanceDetails)
                .catch(error => {
                    return res.status(400).send({message: error.code, status: false}); 
                });

                if (quoteInstanceDet.insertId) {
                    const messageDetails = {
                        message_body: req.body.buyer_msg,
                        series_quote_instance_id: quoteInstanceDet.insertId,
                        created_date: dateTime,
                        user_category: 1,
                        series_quote_id: quoteUuid,
                        from_user_id: decoded.id,
                        to_user_id: req.body.product_created_by
                    };

                    const message = await utilService.asynqQuery(psQuery.addMessage, messageDetails)
                    .catch(error => {
                        return res.status(400).send({message: error.code, status: false}); 
                    });                    
                }
            }
        }

        await notificationSe.createNotification('ADMIN', 'BUYER', '-1', 'QUOTE', quoteUuid, 'New Quote Request from a buyer');
        return res.status(200).send({ message: 'Quote created successfull', status: true });
    }

    async getCatAndSeriesList(req, res) {
        const getCategoryId = await utilService.asynqQuery(psQuery.getPsCatIdByRefIdQuery, req.params.seriesUrl);
        if(getCategoryId.length) {
            const getCategoryInfo = await utilService.asynqQuery(psQuery.getProductCategoryQuery, getCategoryId[0].product_category_id);
            const getSeriesList = await utilService.asynqQuery(psQuery.getPsByCategoryQuery, getCategoryId[0].product_category_id);
            return res.status(200).send({
                categoryInfo: getCategoryInfo[0],
                seriesList: getSeriesList
            });
        } else {
            return res.status(400).send({message: 'No Results Found', status: false});
        }
        
    }

    async getQuoteQuoteInstancesNotApproved(req, res) {
        const isAdmin = await utilService.tokenCheckAdmin(req.header('authorization'));
        if(!isAdmin) return res.status(401).send('Access Denied');
        let quoteList;

        if(req.body.filter === 'Pending' || req.body.filter === 'Aproved') {
            quoteList = await utilService.asynqQuery(psQuery.getAllSeriesQuotesAPQuery, [req.body.filter])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'readyToShip') {
            quoteList = await utilService.asynqQuery(psQuery.getAllSeriesQuotesReadyToShipQuery)
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'submitedToLp') {
            quoteList = await utilService.asynqQuery(psQuery.getAllSeriesQuotesSubmitedToLpQuery)
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else {
            quoteList = await utilService.asynqQuery(psQuery.getAllSeriesQuotesQuery)
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        }        

        return res.status(200).send({ message: 'Success', data: quoteList, status: true });
    }

    async getProductQuoteInstancebyQuote(req, res) {
        const isAdmin = await utilService.tokenCheckAdmin(req.header('authorization'));
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);

        if (isAdmin) {
            var temp1;
            var temp2;
            const quoteMain = await utilService.asynqQuery(psQuery.getQuoteMainAdminQuery, [req.params.productQuoteSeriesId]);

            const quotations = await utilService.asynqQuery(psQuery.getSerQuoInstQuery, [req.params.productQuoteSeriesId]);
            for (var a = 0; a < quotations.length; a++) {
                quotations[a].messages = await utilService.asynqQuery(psQuery.getMessBySerQuoInstQuery, [quotations[a].series_instance_id]);
                temp1=quotations[a].messages;
                var products = await utilService.asynqQuery(psQuery.getProductsBySerQuoInstQuery, [req.params.productQuoteSeriesId]);
                for (var b = 0; b < products.length; b++) {
                    products[b].pricing  = await utilService.asynqQuery(psQuery.getPricesByProductsBySerQuoInstQuery, [quotations[a].series_instance_id, products[b].Product_product_id]);
                    temp2= products[b].pricing ;
                    if ( products[b].pricing == null ) {
                        products[b].pricing = {
                            series_q_instance_price: null,
                            seller_unit_price: null,
                            seller_price: null,
                            quantity: null,
                            SeriesQuoteInstance_series_instance_id: null,
                            SeriesQuoteInstance_SeriesQuote_series_quote_id: null,
                            SeriesQuoteInstance_SeriesQuote_ParentQuote_parent_quote_id: null,
                            product_id: null
                        };
                    }
                }
                quotations[a].pricingProducts = products;
            }
            const data={
                quotations,quoteMain
            };
            if (!data) {
                return res.status(400).send({
                    data: data

                });
            }
            return res.status(200).send({
                data: data
            });
        }
        else if (decoded.userType == 2) {            
            let quoteFreightData;
            const quoteMain = await utilService.asynqQuery(psQuery.getSeriesQuotebyQuoteIdQuery, [req.params.productQuoteSeriesId])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
      
            if(quoteMain[0].submited_to_freight > 0) {
                quoteFreightData = await utilService.asynqQuery(psQuery.getFrieghtDataByQuoteQuery, [req.params.productQuoteSeriesId])
                .catch(error => {
                    return res.status(400).send({message: error.code, status: false}); 
                });
            }
            
            const quotations = await utilService.asynqQuery(psQuery.getSerQuoInstSellerQuery, [req.params.productQuoteSeriesId]);
            for (var a = 0; a < quotations.length; a++) {
                quotations[a].messages = await utilService.asynqQuery(psQuery.getMessBySerQuoInstSellerQuery, [quotations[a].series_instance_id])
                .catch(error => {
                    return res.status(400).send({message: error.code, status: false}); 
                });

                var products = await utilService.asynqQuery(psQuery.getProductsBySerQuoInstQuery, [req.params.productQuoteSeriesId])
                .catch(error => {
                    return res.status(400).send({message: error.code, status: false}); 
                });

                for (var b = 0; b < products.length; b++) {
                    products[b].pricing = await utilService.asynqQuery(psQuery.getPricesByProductsBySerQuoInstQuery, [quotations[a].series_instance_id, products[b].Product_product_id])
                    .catch(error => {
                        return res.status(400).send({message: error.code, status: false}); 
                    });

                    if (!products[b].pricing ||Object.keys(products[b].pricing).length === 0 || products[b].pricing == null || products[b].pricing.length < 1 || products[b].pricing == undefined) {
                        products[b].pricing = {
                            series_q_instance_price: null,
                            seller_unit_price: null,
                            seller_price: null,
                            quantity: null,
                            SeriesQuoteInstance_series_instance_id: null,
                            SeriesQuoteInstance_SeriesQuote_series_quote_id: null,
                            SeriesQuoteInstance_SeriesQuote_ParentQuote_parent_quote_id: normalLogin,
                            product_id: null
                        };
                    }
                }
                quotations[a].pricingProducts = products;
            }
            
            const data = {
                quotations,
                quoteMain,
                quoteFreightData
            };

            return res.status(200).send({data: data});
        }
        else if (decoded.userType == 1) {
            // Buyer
            const quoteMain = await utilService.asynqQuery(psQuery.getSeriesQuotebyQuoteIdQuery, [req.params.productQuoteSeriesId])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });

            const quotations = await utilService.asynqQuery(psQuery.getSerQuoInstBuyerQuery, [req.params.productQuoteSeriesId])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });

            for (var a = 0; a < quotations.length; a++) {
                
                quotations[a].messages = await utilService.asynqQuery(psQuery.getMessBySerQuoInstBuyerQuery, [quotations[a].series_instance_id])
                .catch(error => {
                    return res.status(400).send({message: error.code, status: false}); 
                });

                var products = await utilService.asynqQuery(psQuery.getProductsBySerQuoInstQuery, [req.params.productQuoteSeriesId])
                .catch(error => {
                    return res.status(400).send({message: error.code, status: false}); 
                });

                if(quotations[a].quote_admin_status === 'Approved' || quotations[a].quote_admin_status === 'Buyer Rejected') {
                    
                    for (var b = 0; b < products.length; b++) {
                        products[b].pricing = await utilService.asynqQuery(psQuery.getPricesByProductsBySerQuoInstQuery, [quotations[a].series_instance_id, products[b].Product_product_id])
                        .catch(error => {
                            return res.status(400).send({message: error.code, status: false}); 
                        });

                        if (products[b].pricing == null ) {
                            products[b].pricing = {
                                series_q_instance_price: null,
                                seller_unit_price: null,
                                seller_price: null,
                                quantity: null,
                                SeriesQuoteInstance_series_instance_id: null,
                                SeriesQuoteInstance_SeriesQuote_series_quote_id: null,
                                SeriesQuoteInstance_SeriesQuote_ParentQuote_parent_quote_id: null,
                                product_id: null
                            };
                        }
                    }
                
                } else {
                    quotations[a].duty_fee = null;
                    quotations[a].dirrect_to_resort_fee = null;
                    quotations[a].repacking_handling = null;
                    quotations[a].quote_total = null;
                    quotations[a].manufacture_leadtime = null;
                    quotations[a].admin_rejected_msg = null;
                    quotations[a].quote_admin_status = null;
                }

                quotations[a].pricingProducts = products;
                
            }

            const data = {
                quotations,
                quoteMain
            };

            return res.status(200).send({ data: data });

        } else {
            return res.status(401).send({ message: "user not found" });
        }

    }
    async updateMessageApprovalByAdmin(req, res) {
        var dateTime = new Date();
        let rejectMsg = null;
        let updateMsg;

        if(req.body.status === 'Rejected' || req.body.status === 'Edited') {
            rejectMsg = req.body.rejectMsg
        }
        
       
        const getMsgData = await utilService.asynqQuery(psQuery.getMsgDataQuery, [req.body.messageId]);
        
        if(req.body.status === 'Edited' || req.body.status === 'Approved') {
            const checkIfInstanceApproved = await utilService.asynqQuery(psQuery.checkifQuoteInstanceApprovedQuery, [req.body.quoteUuid]);

            if(checkIfInstanceApproved.length) {
                if(checkIfInstanceApproved[0].quote_admin_status === 'Pending') {
                    const updateQuoteInstance = await utilService.asynqQuery(psQuery.updateQuoteInstaceQuery, [req.body.quoteUuid]);
                }
            }  
        }              

        if(req.body.status === 'Edited') {
            updateMsg = await utilService.asynqQuery(psQuery.approveWithEditAdminQuery,['Approved', dateTime, rejectMsg, req.body.messageId]);
        } else {
            updateMsg = await utilService.asynqQuery(psQuery.updateMessageApprovalByAdminQuery,[req.body.status, dateTime, rejectMsg, req.body.messageId]);
        }
      
        if(req.body.status === 'Rejected') {
            if(req.body.userType === 1) {
                // Send Seller Notification
                const notificationMsg = `Your message/quote rejected by Admin for Quote ${req.body.quoteUuid}`;
                await notificationSe.createNotification('BUYER', 'ADMIN', getMsgData[0].from_user_id, 'QUOTE', req.body.quoteUuid, notificationMsg);
            } else if(req.body.userType === 2) {
                // Send Seller Reject Notification
                const notificationMsg = `Your message/quote rejected by Admin for Quote ${req.body.quoteUuid}`;
                await notificationSe.createNotification('SELLER', 'ADMIN', getMsgData[0].from_user_id, 'QUOTE', req.body.quoteUuid, notificationMsg);
            }
        } else if(req.body.status === 'Approved' || req.body.status === 'Edited') {
            if(req.body.userType === 1) {
                // Send Seller Notification
                const notificationMsg = `You have new message from a buyer for Quote ${req.body.quoteUuid}`;
               // await notificationSe.createNotification('SELLER', 'ADMIN', getMsgData[0].to_user_id, 'QUOTE', req.body.quoteUuid, notificationMsg);
            } else if(req.body.userType === 2) {
                // Send Seller Reject Notification
                const notificationMsg = `Your new message from a seller for Quote ${req.body.quoteUuid}`;
               // await notificationSe.createNotification('BUYER', 'ADMIN', getMsgData[0].to_user_id, 'QUOTE', req.body.quoteUuid, notificationMsg);
            }
        }

        return res.status(200).send({ message: 'Success', data: updateMsg });

    }
    async updateQuoteInstanceApprovalByAdmin(req, res) {
        const getBuyerSellerId = await utilService.asynqQuery(psQuery.getBuyerIdQuery, [req.body.series_instance_id])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });
        
        var dateTime = new Date();
        const getPsList = await utilService.asynqQuery(psQuery.updateQuoteInstanceApprovalByAdminQuery,[dateTime,req.body.series_instance_id]);
        if (!getPsList) {
            return res.status(400).send({ message: getPsList });
        }

        if(getBuyerSellerId.length) {
            //user_type: 1 = Buyer | user_type: 2 = Seller | user_type: 4 = Admin
            if(req.body.user_type === 1) {
                const notificationMsg = `You have new updates for Quote ${getBuyerSellerId[0].quote_uuid}`;
                await notificationSe.createNotification('SELLER', 'ADMIN', getBuyerSellerId[0].seller_id, 'QUOTE', getBuyerSellerId[0].quote_uuid, notificationMsg);

            } else if(req.body.user_type === 2) {                
                const notificationMsg = `You have new updates for Quote ${getBuyerSellerId[0].quote_uuid}`;
                await notificationSe.createNotification('BUYER', 'ADMIN', getBuyerSellerId[0].buyer_id, 'QUOTE', getBuyerSellerId[0].quote_uuid, notificationMsg);
            }            
        }
        
        return res.status(200).send({ message: 'Success', data: getPsList });

    }     
    async getQuoteQuoteInstancesSellerQuery(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        let quoteList;

        if(req.body.filter === 'pending') {
            quoteList = await utilService.asynqQuery(psQuery.getQuoteQuoteInstancesSellerPendingQuery,[decoded.companyId])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'approved') {
            quoteList = await utilService.asynqQuery(psQuery.getQuoteQuoteInstancesSellerApprovedQuery,[decoded.companyId])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'rejected') {
            quoteList = await utilService.asynqQuery(psQuery.getQuoteQuoteInstancesSellerRejectedQuery,[decoded.companyId])
            .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'readyToShip') {
            quoteList = await utilService.asynqQuery(psQuery.getQuoteQuoteInstancesSellerReadyToShipQuery,[decoded.companyId])
            .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'submittedToLp') {
            quoteList = await utilService.asynqQuery(psQuery.getQuoteQuoteInstancesSellerSubmittedToLpQuery,[decoded.companyId])
            .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
            });
        } else {
            quoteList = await utilService.asynqQuery(psQuery.getQuoteQuoteInstancesSellerQuery,[decoded.companyId])
            .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
            });
        }

        return res.status(200).send({ message: 'Success', data: quoteList });

} 
    async getQuoteQuoteInstancesBuyer(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        let quoteList;

        if(req.body.filter === 'all') {
            quoteList = await utilService.asynqQuery(psQuery.getQuoteQuoteInstancesBuyerQuery,[decoded.id])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'pending') {
            quoteList = await utilService.asynqQuery(psQuery.getQuoteQuoteInstancesBuyerPARQuery,[decoded.id, 'Pending'])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'approved') {
            quoteList = await utilService.asynqQuery(psQuery.getQuoteQuoteInstancesBuyerPARQuery,[decoded.id, 'Aproved'])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'rejected') {
            quoteList = await utilService.asynqQuery(psQuery.getQuoteQuoteInstancesBuyerPARQuery,[decoded.id, 'Rejected'])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'readyToShip') {
            quoteList = await utilService.asynqQuery(psQuery.getQuoteQuoteInstancesReadyToShipQuery,[decoded.id])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'submittedToLp') {
            quoteList = await utilService.asynqQuery(psQuery.getQuoteQuoteInstancesSubmittedToLPQuery,[decoded.id])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        }

        return res.status(200).send({ message: 'Success', data: quoteList });
    }

    async sellerCreateQuoteInstance(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const getToUserId = await utilService.asynqQuery(psQuery.getToUserIdQuery, [req.body.quote_uuid])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });

        const checkIfQuotePending = await utilService.asynqQuery(psQuery.checkIfQuotePendingQuery,[req.body.quote_uuid])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });
        
        if(checkIfQuotePending[0].quote_total > 0 && checkIfQuotePending[0].buyer_reject === 0 && checkIfQuotePending[0].quote_approved === 0 && (checkIfQuotePending[0].quote_admin_status === 'Approved' || checkIfQuotePending[0].quote_admin_status === 'Pending')) {
            return res.status(500).send({message: 'Cannot submit new quote until buyer response to the last quote', status: false});
        }
        
        var totalDuty=0;
        var insertSellerQo;
        var messageOne;
        var messageTwo;
        var updateSellerQo;
        var messageThree;
        var messageFour;

        let adminEmailList = [];

        const adminEmails = await utilService.asynqQueryNoParams(psQuery.getAdminEmailAdressQuery)
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });
        
        if(adminEmails.length > 0) {
            adminEmails.forEach(adminEmail => {
                adminEmailList.push(adminEmail.admin_email);
            });
        }
        
        const getPsList = await utilService.asynqQuery(psQuery.checkIfFirstQuery,[req.body.series_instance_id])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });
        
        for(var a=0;a<req.body.products.length;a++){
            let dutyRatePercentage = 0;
            var getDutyId = await generalQuery.asynqQuery(adminAppQuery.getDutyValQuery,[req.body.products[a].product_id])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });

            const dutyRate = await generalQuery.asynqQuery(adminAppQuery.getDutyRateQuery, [getDutyId[0].duty])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });

            if (getDutyId[0].country==='LK' || getDutyId[0].country==='AF' || getDutyId[0].country==='BD' || 
                getDutyId[0].country==='BT' || getDutyId[0].country==='IN' || getDutyId[0].country==='MV' || 
                getDutyId[0].country==='NP' || getDutyId[0].country==='PK') {

                dutyRatePercentage = dutyRate[0].safta_rate;
            } else {
                dutyRatePercentage = dutyRate[0].rate;
            }

            totalDuty = totalDuty+((dutyRatePercentage/100) * req.body.products[a].amount);
        }

        const fees = await generalQuery.asynqQuery(adminAppQuery.getFeesQuery);
        const direct2rest=(fees[0].markup_percentage/100)*req.body.total;
        const repacking=(fees[1].markup_percentage/100)*req.body.total;
        const ownermargin=direct2rest+repacking;
        var dateTime = new Date();        
        
        const dataToQuoteInstance = {
            dirrect_to_resort_fee: direct2rest,
            repacking_handling: repacking,
            quote_total : req.body.total+direct2rest+repacking,
            duty_fee : totalDuty,
            quote_uuid : req.body.quote_uuid,
            SeriesQuote_ParentQuote_parent_quote_id : req.body.parent_quote_id,
            created_date : dateTime,
            manufacture_leadtime: req.body.manufacture_leadtime
        };
        
        var tot=req.body.total+direct2rest+repacking;
        
        if(getPsList[0].quote_total!=null){
            insertSellerQo = await utilService.asynqQuery(psQuery.sellerCreateQuoteInstanceQuery, dataToQuoteInstance)
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });

            const messageDetails = {
                message_body: req.body.quoteRemark,
                series_quote_instance_id: insertSellerQo.insertId,
                created_date: dateTime,
                user_category: 2,
                series_quote_id: req.body.quote_uuid,
                from_user_id: decoded.id,
                to_user_id: getToUserId[0].buyer_id
            };
            
            messageOne = await utilService.asynqQuery(psQuery.addMessage, messageDetails)
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });

            for(var a=0;a<req.body.products.length;a++){
                const pricingDetails = {
                    seller_unit_price: req.body.products[a].unit_price,
                    seller_price: req.body.products[a].amount,
                    quantity: req.body.products[a].qty,
                    SeriesQuoteInstance_series_instance_id: insertSellerQo.insertId,
                    quote_uuid: req.body.quote_uuid,
                    SeriesQuoteInstance_SeriesQuote_ParentQuote_parent_quote_id: req.body.parent_quote_id,
                    product_id : req.body.products[a].product_id     
                };

                messageTwo = await utilService.asynqQuery(psQuery.createPriceRecordQuery, pricingDetails)
                .catch(error => {
                    return res.status(400).send({message: error.code, status: false}); 
                });
            }
            
            // await utilService.asynqQuery(psQuery.updateManufacturingLeadTimeQuery,[req.body.manufacture_leadtime,req.body.series_quote_id]);

        } else { 
            updateSellerQo = await utilService.asynqQuery(psQuery.updateSeriesQuoteInstanceQuery,[req.body.manufacture_leadtime, direct2rest,totalDuty,repacking,tot,dateTime,req.body.series_instance_id])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
            
            const messageDetails = {
                message_body: req.body.quoteRemark,
                series_quote_instance_id: req.body.series_instance_id,
                created_date: dateTime,
                user_category: 2,
                series_quote_id: req.body.quote_uuid,
                from_user_id: decoded.id,
                to_user_id: getToUserId[0].buyer_id
            };

            messageThree = await utilService.asynqQuery(psQuery.addMessage, messageDetails)
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });

            for(var a=0;a<req.body.products.length;a++){
                const pricingDetails = {
                    seller_unit_price: req.body.products[a].unit_price,
                    seller_price: req.body.products[a].amount,
                    quantity: req.body.products[a].qty,
                    SeriesQuoteInstance_series_instance_id: req.body.series_instance_id,
                    quote_uuid: req.body.quote_uuid,
                    SeriesQuoteInstance_SeriesQuote_ParentQuote_parent_quote_id: req.body.parent_quote_id,
                    product_id : req.body.products[a].product_id 
                };
                
                messageFour = await utilService.asynqQuery(psQuery.createPriceRecordQuery, pricingDetails)
                .catch(error => {
                    return res.status(400).send({message: error.code, status: false}); 
                });
            }
        }
      
        const updateLastUpdatedTimeSeriesQuote = await utilService.asynqQuery(psQuery.updateLastUpdatedDateSeriesQuoteQuery, [dateTime, req.body.quote_uuid])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });

        const notificationMsg = `New quote submited for the Quote ${req.body.quote_uuid}`;
        await notificationSe.createNotification('ADMIN', 'SELLER', '-1', 'QUOTE', req.body.quote_uuid, notificationMsg);
        return res.status(200).send({ message: 'Quote submited', status: true });
    }

    async sendMessaageQuote(req, res) {
        let toUser;
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const getToUserId = await utilService.asynqQuery(psQuery.getToUserIdQuery, [req.body.quote_uuid])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });

        var dateTime = new Date();

        if(decoded.userType === 1) {
            toUser = getToUserId[0].seller_id;
        } else if(decoded.userType === 2) {
            toUser = getToUserId[0].buyer_id;
        }

        const messageDetails = {
            message_body: req.body.quoteMessage,
            series_quote_instance_id: req.body.series_instance_id,
            created_date: dateTime,
            user_category: decoded.userType,
            from_user_id: decoded.id,
            to_user_id: toUser,
            series_quote_id: req.body.quote_uuid
        };

        const msgInsert = await utilService.asynqQuery(psQuery.addMessage, messageDetails)
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });

        if(msgInsert.insertId > 0) {
            const updateLastUpdatedTimeSeriesQuote = await utilService.asynqQuery(psQuery.updateLastUpdatedDateSeriesQuoteQuery, [dateTime, req.body.series_quote_id])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        }      
        
        const notificationMsg = `New message received for the Quote ${req.body.quote_uuid}`;
        await notificationSe.createNotification('ADMIN', 'SELLER', '-1', 'QUOTE', req.body.quote_uuid, notificationMsg);

        return res.status(200).send({ data: msgInsert, msg: 'Message sent successfully', status: true });
    }

    async buyerApproveQuoteFinal(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        if(decoded.id > 0) {
            const checkIfUserHasQuote = await utilService.asynqQuery(psQuery.checkIfBuyerHasQuoteQuery, [decoded.id, req.body.quote_id])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });

            if(checkIfUserHasQuote.length > 0) {                
                const getBuyerSellerId = await utilService.asynqQuery(psQuery.getToUserIdQuery, [req.body.quote_id])
                .catch(error => {
                    return res.status(400).send({message: error.code, status: false}); 
                });

                var dateTime = new Date();    
                const getCategoryId = await utilService.asynqQuery(psQuery.buyerApproveQuoteInstanceFinalQuery, [req.body.series_instance_id, req.body.quote_id]);
                const response = await utilService.asynqQuery(psQuery.buyerApproveQuoteFinalQuery, [req.body.series_instance_id, req.body.quote_id]);
                
                const notificationMsgToSeller = `Congratulation! Buyer has approved your Quote ${req.body.quote_id}`;
                await notificationSe.createNotification('SELLER', 'BUYER', getBuyerSellerId[0].seller_id, 'QUOTE', req.body.quote_id, notificationMsgToSeller);

                const notificationMsgToAdmin = `Congratulation! Buyer has approved Quote ${req.body.quote_id}`;
                await notificationSe.createNotification('ADMIN', 'BUYER', '-1', 'QUOTE', req.body.quote_id, notificationMsgToAdmin);

                return res.status(200).send({
                    approvedList: response
                });
            }            
        } else {
            return res.status(400).send({status: false, msg: 'Authentication failed'});
        }        
    }
    async changeToReadyToShipQuery(req, res) {
        const response = await utilService.asynqQuery(psQuery.changeToReadyToShipQuery, [req.body.series_quote_id]);
        return res.status(200).send({
            data: response
        });
    }
    async showReadyToShipPerSellerQuery(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const response = await utilService.asynqQuery(psQuery.showReadyToShipPerSellerQuery, [decoded.companyId]);
        return res.status(200).send({
            data: response
        });
    }
    async rejectQuoteInstanceQuery(req, res) {
        const notificationToUserId = await utilService.asynqQuery(psQuery.getToUserIdQuery, [req.body.quote_id])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });

        const checkIfBuyerRejected = await utilService.asynqQuery(psQuery.checkIfBuyerRejectedQuery, [req.body.series_instance_id])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });
        
        let rejectStatus;

        if(checkIfBuyerRejected[0].buyer_reject === 1) {
            rejectStatus = 'Buyer Rejected';
            let notificationMsg = `Quote rejected by Buyer for Quote ${req.body.quote_id}`;
            await notificationSe.createNotification('SELLER', 'ADMIN', notificationToUserId[0].seller_id, 'QUOTE', req.body.quote_id, notificationMsg);
        } else {
            rejectStatus = 'Rejected';
            let notificationMsg = `Quote rejected by Admin for Quote ${req.body.quote_id}`;
            await notificationSe.createNotification('SELLER', 'ADMIN', notificationToUserId[0].seller_id, 'QUOTE', req.body.quote_id, notificationMsg);
        }
        
        const response = await utilService.asynqQuery(psQuery.rejectQuoteInstanceQuery, [rejectStatus, req.body.quoteMessage,req.body.series_instance_id])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });
        
        // var dateTime = new Date();

        // const messageDetails = {
        //     message_body: req.body.quoteMessage,
        //     series_quote_instance_id: req.body.series_instance_id,
        //     created_date: dateTime,
        //     user_category: 4,
        //     approval : 'Approved'
        // };
        // const getCategoryId = await utilService.asynqQuery(psQuery.addMessage, messageDetails);
        return res.status(200).send({
            data: response
        });
    }
    async rejectOnlyMessageQuery(req, res) {
        const response = await utilService.asynqQuery(psQuery.rejectOnlyMessageQuery, [req.body.messageId]);       
        return res.status(200).send({
            data: response
        });
    }

    async approvePsAdmin(req, res) {
        const getSeriesUrl = await utilService.asynqQuery(psQuery.getSeriesUrlQuery, [req.body.psId]);
        if(getSeriesUrl.length > 0) {
            const apporveProductSeriesRef = await utilService.asynqQuery(psQuery.approvePsAdminQuery, [req.body.psId]); 
            const getProductList = await utilService.asynqQuery(psQuery.getSeriesProductQuery, [req.body.psId]);
            if(getProductList.length) {
                for (let index = 0; index < getProductList.length; index++) {
                    await generalQuery.asynqQuery(productQuery.updatePsURLOnApprovalQuery,[getSeriesUrl[0].series_url, getProductList[index].product_id])
                }
            }
        }

        let notificationMsg = `Admin approved and published your product series #${req.body.psId}`;
        await notificationSe.createNotification('SELLER', 'ADMIN', getSeriesUrl[0].created_by, 'PRODUCT_SERIES', req.body.psId, notificationMsg);
        
        return res.status(200).send({message: 'Product Series approved', status: true});
    }

    async rejectPsAdmin(req, res) {
        const getSeriesUrl = await utilService.asynqQuery(psQuery.getSeriesUrlQuery, [req.body.psId]);

        const rejectPsSeries = await utilService.asynqQuery(psQuery.rejectPsAdminQuery, [req.body.psId]);       
        if(rejectPsSeries.affectedRows > 0) {
            const getProductList = await utilService.asynqQuery(psQuery.getSeriesProductQuery, [req.body.psId]);
            if(getProductList.length) {
                for (let index = 0; index < getProductList.length; index++) {
                    await generalQuery.asynqQuery(productQuery.updatePsURLQuery,[null, getProductList[index].product_id])
                }
            }
        }

        let notificationMsg = `Admin rejected and unpublished your product series #${req.body.psId}`;
        await notificationSe.createNotification('SELLER', 'ADMIN', getSeriesUrl[0].created_by, 'PRODUCT_SERIES', req.body.psId, notificationMsg);

        return res.status(200).send({message: 'Product Series rejected', status: true});
    }
    
    async getPsAdmin(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        let psList;

        if(req.body.filter === 'Approved' || req.body.filter === 'Pending' || req.body.filter === 'Rejected') {
            psList = await utilService.asynqQuery(psQuery.getPsAdminAPRQuery,[req.body.filter])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'Deleted') {
            psList = await utilService.asynqQuery(psQuery.getPsAdminDeletedQuery)
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else {
            psList = await utilService.asynqQuery(psQuery.getPsAdminQuery)
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        }
 
        if(psList.length) {
            for(var a = 0; a < psList.length; a++) {
                var prodDetails = await utilService.asynqQuery(psQuery.getPsProductsQuery,[psList[a].product_series_ref_id])
                .catch(error => {
                    return res.status(400).send({message: error.code, status: false}); 
                });
                  
                psList[a].prodDetails = prodDetails;
            }
        }
        
        return res.status(200).send({ data: psList });
    }
    
    async getMinLpVal(req, res) {
        const response = await utilService.asynqQuery(psQuery.getMinLpValQuery,[req.params.ParentQuote_parent_quote_id])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });
       
        return res.status(200).send({ data: response });
    }

    async removeProductFromSeries(req, res) {
        const removeProduct = await utilService.asynqQuery(psQuery.removeProductFromSeriesQuery,[req.body.product_id, req.body.product_series_ref_id]);
        if(removeProduct.affectedRows > 0) {
            const productDetails = {
                is_series_product: 0,
                product_series_url: null
            };

            const r = await generalQuery.asynqQuery(productQuery.updateProductQurey,[productDetails, req.body.product_id]);

            const updateProduct = await utilService.asynqQuery(psQuery.updateProductSeriesUrlQuery,[req.body.product_id]);
            if(updateProduct.affectedRows > 0) {
                return res.status(200).send({message: 'Product removed', status: true});
            } else {
                return res.status(400).send({message: 'Product removing failed', status: false});
            }            
        } else {
            return res.status(400).send({message: 'Product removing failed', status: false});
        }
    }

    async updateProductSeries(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);

        let bannerImg = '';
        if(req.body.product_series_banner === null) {
            return res.status(400).send({message: 'Please upload banner image', status: false});
        }

        if(isBase64(req.body.product_series_banner, {allowMime: true}) && req.body.product_series_banner !== null) {
            const uploadedImgs = await generalQuery.uploadImagesToSpace([req.body.product_series_banner], 'series-banners');
            bannerImg = uploadedImgs.toString();
        } else {
            bannerImg = req.body.product_series_banner;
        }

        const seriesRefData = {
            product_series_name: req.body.product_series_name,
            product_series_desc: req.body.product_series_desc,
            product_series_banner: bannerImg,
            admin_approval: 'Pending',
            updated_date: new Date()
        }

        const updateSeriesRef = await utilService.asynqQuery(psQuery.updateSeriesRefQuery, [seriesRefData, req.body.product_series_ref_id, decoded.companyId]);

        if(req.body.product_id.length > 0) {

            for (var a = 0; a < req.body.product_id.length; a++){
                var productSeriesDetails = {    
                    product_id: req.body.product_id[a],
                    product_series_ref_id: req.body.product_series_ref_id,
                };

                const productDetails = {
                    is_series_product: 1,
                    product_series_url: null
                };

                const checkIfProductHas = await generalQuery.asynqQuery(productQuery.checkIfSeriesAlreadyHasProductQuery, [req.body.product_id[a], req.body.product_series_ref_id]);
                
                if(checkIfProductHas.length === 0) {
                    await generalQuery.asynqQuery(productQuery.addProductSeries, productSeriesDetails);
                }
 
                const updatePsURL = await generalQuery.asynqQuery(productQuery.updatePsURLQuery, [req.body.series_url, req.body.product_id[a]]);    
                await generalQuery.asynqQuery(productQuery.updateProductQurey,[productDetails, req.body.product_id[a]]);
            }
        }

        return res.status(200).send({message: 'Product series updated', status: true});
    }

    async deleteProductSeries(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const deleteSeriesRef = await utilService.asynqQuery(psQuery.deleteSeriesQuery, [req.body.seriesRefId, decoded.companyId]);
        
        if(deleteSeriesRef.affectedRows > 0) {
            const getProductList = await utilService.asynqQuery(psQuery.getSeriesProductQuery, [req.body.seriesRefId]);
            if(getProductList.length) {
                for (let index = 0; index < getProductList.length; index++) {
                    await generalQuery.asynqQuery(productQuery.updatePsURLQuery,[null, getProductList[index].product_id]);
                    await utilService.asynqQuery(psQuery.removeProductFromSeriesQuery,[getProductList[index].product_id, req.body.seriesRefId]);
                }
            }
            
            return res.status(200).send({message: 'Product series deleted', status: true});
        }  
        
        return res.status(400).send({message: 'Somethig went wrong', status: false});
    }
}
module.exports = ProductSeries;
