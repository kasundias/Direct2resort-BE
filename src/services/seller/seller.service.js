var sellerQuery = require('../../loaders/sellerQuery');
var GeneralQueryService = require('../../services/util/util.service');
const jwt = require('jsonwebtoken');
const generalQuery = new GeneralQueryService();
var moment = require('moment');
var isBase64 = require('is-base64');
const nanoId = require('nanoid');

const { inspect } = require('util');
const lodash = require('lodash');
const transform = lodash.transform;
const isEqual = lodash.isEqual;
const isArray = lodash.isArray;
const isObject = lodash.isObject;

const NotificationService = require('../../services/util/notification.service');
const UtilService = require('../../services/util/util.service');
const notificationSe = new NotificationService();
const utilS = new UtilService();

class Seller {
    async getProductCategories(req,res) {

        const response = await generalQuery.asynqQuery(sellerQuery.getAllCategoriesQuery);

        return res.status(200).send({message: 'Success', data: response});
    }

    async getSubProductCategories(req,res) {

        const response = await generalQuery.asynqQuery(sellerQuery.getSubCatsByCatIdQuery, [req.params.catId]);
        return res.status(200).send({message: 'Success', data: response});
    }

    async getProductsBySubCat(req,res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        if(!decoded) return res.status(401).send('Access Denied');

        const response = await generalQuery.asynqQuery(sellerQuery.getProductsBySubCatQuery, [req.params.subCatId, decoded.companyId]);
        return res.status(200).send({message: 'Success', data: response});
    }
    
    async getProductsByCat(req,res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        if(!decoded) return res.status(401).send('Access Denied');

        const response = await generalQuery.asynqQuery(sellerQuery.getProductsByCatQuery, [req.params.subCatId, decoded.companyId]);
        return res.status(200).send({message: 'Success', data: response});
    }
    async getProductsByCatPs(req,res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        if(!decoded) return res.status(401).send('Access Denied');

        const response = await generalQuery.asynqQuery(sellerQuery.getProductsByCatPsQuery, [req.params.subCatId, decoded.companyId]);
        return res.status(200).send({message: 'Success', data: response});
    }
    async updateReadyToShipStatus(req,res) {

        var dateTime = new Date();
        const response = await generalQuery.asynqQuery(sellerQuery.updateReadyToShipStatusQuery, [dateTime,req.params.quoteId]);
        return res.status(200).send({message: 'Success', data: response});
    }
    async getQuoteIfReadyToShip(req,res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        if(!decoded) return res.status(401).send('Access Denied');

        console.log(decoded.companyId);
        const dataSet={
            Product_Company_company_id :decoded.companyId
        }
        const response = await generalQuery.asynqQuery(sellerQuery.getQuoteIfReadyToShipQuery,[decoded.companyId,1]);
        return res.status(200).send({message: 'Success', data: response});
    }

    async getQuotesSubmitedToLp(req,res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        if(!decoded) return res.status(401).send('Access Denied');

        const response = await generalQuery.asynqQuery(sellerQuery.getQuotesSubmitedToLPQuery, decoded.companyId);
        return res.status(200).send(response);
    }

    async addProductSeries(req,res) {
        console.log(req.body);
    }

    async getSingleProduct(req,res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        if(!decoded) return res.status(401).send('Access Denied');
        
        const response = await generalQuery.asynqQuery(sellerQuery.getSingleProductQuery, [decoded.companyId, req.params.productId]);
        const productAttrs = await generalQuery.asynqQuery(sellerQuery.getProdSpecAttrByProductQuery, [decoded.companyId, req.params.productId]);
        const productCustomTabs = await generalQuery.asynqQuery(sellerQuery.getProductCustomTabsQuery, [decoded.companyId, req.params.productId]);

        return res.status(200).send({productInfo: response[0], productAttrs: productAttrs, customTabs: productCustomTabs});
    }

    async updateProduct(req,res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        if(!decoded) return res.status(401).send('Access Denied');
        
        const editedProduct = req.body.editedProduct;
        const beforeEditProduct = req.body.beforeEdit;

        //console.log(editedProduct);
        //console.log(beforeEditProduct);

        function difference(origObj, newObj) {
            function changes(newObj, origObj) {
              let arrayIndexCounter = 0
              return transform(newObj, function (result, value, key) {
                if (!isEqual(value, origObj[key])) {
                  let resultKey = isArray(origObj) ? arrayIndexCounter++ : key
                  result[resultKey] = (isObject(value) && isObject(origObj[key])) ? changes(value, origObj[key]) : value
                }
              })
            }
            return changes(newObj, origObj)
          }
         
        const updatedFields = difference(beforeEditProduct, editedProduct)
        const updatedReadbleFields = utilS.productFieldNames(Object.keys(updatedFields));

        const newImgs = [];
        const productImgs = [];
        const brandLogo = [];

        for (var index = 0; index < editedProduct.product_imgs.length; index++) {
            if(isBase64(editedProduct.product_imgs[index], {allowMime: true})) {
                newImgs.push(editedProduct.product_imgs[index]);
            } else {
                productImgs.push(editedProduct.product_imgs[index]);
            }         
        }

        if(newImgs.length > 0) {            
            const uploadedImgs = await generalQuery.uploadImagesToSpace(newImgs, 'product-images');
            productImgs.push(...uploadedImgs);
        }

        if(isBase64(editedProduct.brandLogo[0], {allowMime: true})) {
            const uploadNewBrandLogo = await generalQuery.uploadImagesToSpace(editedProduct.brandLogo, 'product-images');
            brandLogo.push(...uploadNewBrandLogo);
        } else {
            brandLogo.push(...editedProduct.brandLogo);
        }

        const productDetails = {
            product_name: editedProduct.product_name,
            product_desc: editedProduct.product_desc,
            product_imgs: productImgs.toString(),
            product_logo: brandLogo.toString(),
            min_order_qty: editedProduct.min_order_qty,
            product_unit: editedProduct.product_unit,
            product_spec_desc: editedProduct.product_spec_desc,
            product_qty: editedProduct.product_qty,
            product_price: editedProduct.product_price,
            product_sample_price: editedProduct.product_sample_price,
            admin_approved: 0,
            country: editedProduct.product_country,
            product_variants : JSON.stringify(editedProduct.product_variants),
            last_updated: new Date(),
            offer_samples: editedProduct.offer_samples,
            sustainable_product: editedProduct.sustainable_product,
            duty: editedProduct.duty
        };

        const response = await generalQuery.asynqQuery(sellerQuery.updateProductQuery, [productDetails, editedProduct.product_id, decoded.companyId]);       
        for (var i = 0; i < editedProduct.product_specifications.length; i++){
            const productSpecUpdate = await generalQuery.asynqQuery(sellerQuery.updateProductSpectAttrQuery, [editedProduct.product_specifications[i].attr_value, editedProduct.product_id, editedProduct.product_specifications[i].product_spec_attr_id, decoded.companyId]);
        }
        
        for (var i = 0; i < editedProduct.customTabs.length; i++){
            if(editedProduct.customTabs[i].product_cus_tab_id) {
                const tabData = {
                    product_cus_tab_name: editedProduct.customTabs[i].product_cus_tab_name,
                    product_cus_tab_desc: editedProduct.customTabs[i].product_cus_tab_desc
                }

                const productSpecUpdate = await generalQuery.asynqQuery(sellerQuery.sellerUpdateCustomTabQuery, 
                [
                    tabData,
                    decoded.companyId,
                    editedProduct.product_id, 
                    editedProduct.customTabs[i].product_cus_tab_id, 
                ]);
            } else {
                const productCustomTabDetails = {
                    product_cus_tab_name: editedProduct.customTabs[i].product_cus_tab_name,
                    product_cus_tab_desc: editedProduct.customTabs[i].product_cus_tab_desc,
                    Product_product_id: editedProduct.product_id,
                    Product_Company_company_id: decoded.companyId
                };    
                const productCustomTabRes = await generalQuery.asynqQuery(sellerQuery.createProductCustomTabQuery, productCustomTabDetails);
            }

            
        }
        
        const notificationMsg = `Product ${editedProduct.product_name} has been updated by the seller. ${(await updatedReadbleFields).toString()}`;
        await notificationSe.createNotification('ADMIN', 'SELLER', '-1', 'PRODUCT', editedProduct.product_url, notificationMsg);

        return res.status(200).send(response);
    }

    
    
    
    // async getQuoteIfReadyToShip(req,res) {
    //     const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
    //     console.log(decoded.companyId);
    //     const dataSet={
    //         Product_Company_company_id :decoded.companyId
    //     }
    //     const response = await generalQuery.asynqQueryNoParams(sellerQuery.getQuoteIfReadyToShipQuery,[decoded.companyId,1]);
    //     return res.status(200).send({message: 'Success', data: response});
    // }
    

    async saveQuoteFreightForward(req,res) {
        const nanoIdGen = nanoId.customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8);  
        const quoteUniqueId = nanoIdGen(); 
       

        var product; var response; var dateTime = new Date();
        var newDateObj = moment(dateTime).add(2, 'days').toDate();

        const saveProduct = {
            quote_uuid: req.body.quote_uuid,
            quote_frieght_uuid: quoteUniqueId,
            boxTypeData: JSON.stringify(req.body.boxTypeData),
            sellerMsg: req.body.sellerMsg,
            created_date: dateTime,
            boxType: req.body.boxType,
            destination: req.body.destination,
            origin: req.body.origin,
            bid_expired_in: newDateObj,
            frieght_type: req.body.frieght_type
        };
        
        const checkIfSubmitedToFrieght = await generalQuery.asynqQuery(sellerQuery.checkIfQuoteSubmitedToLpQuery, [req.body.quote_uuid]).catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });        

        if(checkIfSubmitedToFrieght.length === 0) {
            product = await generalQuery.asynqQuery(sellerQuery.saveQuoteExtraDetailsQuery,saveProduct).catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
    
            await generalQuery.asynqQuery(sellerQuery.updateQuoteFrightForwardedDateQuery,[dateTime,req.body.quote_uuid]).catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
    
            response = await generalQuery.asynqQuery(sellerQuery.updateQuoteFrieghtStatusQuery,[req.body.quote_uuid]).catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });

            const notificationMsg = `Quote ${req.body.quote_uuid} has been submited to the Logistic Partner.`;
            await notificationSe.createNotification('ADMIN', 'SELLER', '-1', 'QUOTE', req.body.quote_uuid, notificationMsg);

            const lpNotification = `Quote ${req.body.quote_uuid} is now open for Bid`;
            await notificationSe.createNotification('LP', 'SELLER', '-1', 'QUOTE', req.body.quote_uuid, lpNotification);

            return res.status(200).send({message:'Quote submited to LP', status: true});
        } else {
            return res.status(400).send({message:'Already Submitted to LP', status: false});
        }      
    }

        
    async getQuoteFrightForLPList(req,res) {
        const response = await generalQuery.asynqQueryNoParams(sellerQuery.getQuoteFrightForLPQuery);
        return res.status(200).send({message: 'Success', data: response});
    }

    async getQuoteFrightForLPListSingle(req,res) {
        const response = await generalQuery.asynqQuery(sellerQuery.getQuoteFrightLPSingleQuery,[req.params.frightDataId]);
        return res.status(200).send({message: 'Success', data: response});
    }

    


    async getQuoteFreightData(req,res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const response = await generalQuery.asynqQuery(sellerQuery.getQuoteFreightDataQuery, [req.params.quoteId, decoded.companyId]);
        return res.status(200).send(response);
    }
    async updateMakeOutOfStock(req,res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const response = await generalQuery.asynqQuery(sellerQuery.updateMakeOutOfStockQuery, [1,req.params.product_id, decoded.companyId]);
        return res.status(200).send(response);
    }
    async updateMakeInOfStock(req,res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const response = await generalQuery.asynqQuery(sellerQuery.updateMakeOutOfStockQuery, [0,req.params.product_id, decoded.companyId]);
        return res.status(200).send(response);
    }
    async deleteProduct(req,res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const response = await generalQuery.asynqQuery(sellerQuery.deleteProductQuery, [req.params.product_id, decoded.companyId]);
        return res.status(200).send(response);
    }
    async getDuty(req,res) {
        const response = await generalQuery.asynqQuery(sellerQuery.getDutyQuery);
        return res.status(200).send(response);
    }
    async getProductSeriesList(req,res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);

        const response = await generalQuery.asynqQuery(sellerQuery.getProductSeriesListQuery,[decoded.companyId]);
        return res.status(200).send(response);
    }
    async getProductSeriesSingle(req,res) {

        const response = await generalQuery.asynqQuery(sellerQuery.getProductSeriesSingleQuery,[req.params.product_series_ref_id]);
        return res.status(200).send(response);
    }
    async getProductSeriesRefDetails(req,res) {
        const response = await generalQuery.asynqQuery(sellerQuery.getProductSeriesRefDetailsQuery,[req.params.product_series_ref_id]);
        return res.status(200).send(response);
    }
    

}

module.exports = Seller;
