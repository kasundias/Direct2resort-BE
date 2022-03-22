var productQuery =require('../../loaders/productQuery');
var GeneralQueryService=require('../../services/util/util.service');
const jwt = require('jsonwebtoken');
const generalQuery = new GeneralQueryService();
var base64Img = require('base64-img');
var FlakeId = require('flake-idgen');
var flakeIdGen = new FlakeId();
var intformat = require('biguint-format'), FlakeId = require('flake-idgen');
const Joi = require('@hapi/joi');

const aws = require('aws-sdk');

const NotificationService = require('../../services/util/notification.service');
const notificationSe = new NotificationService();

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new aws.S3({
    accessKeyId: 'QMPPZK7YHLJBCXA2UO27',
    secretAccessKey: '734xA8hTHQWedgSV7fOA9SwhSbOPFXFmNVbA9WV7f/8',
    endpoint: spacesEndpoint
});

class Products{

     async addProducts (req,res)  {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);

        const uploadedImgs = await generalQuery.uploadImagesToSpace(req.body.product_imgs, 'product-images');
        const brandLogo = await generalQuery.uploadImagesToSpace(req.body.brandLogo, 'product-images');        

        if(uploadedImgs) {
            if(brandLogo) {
                try {
            
                    /*const addProductValidation = Joi.object({
                        product_name: Joi.string().required().label('Product Name'),
                        product_desc: Joi.string().required().label('Product Description'),
                        min_order_qty: Joi.number().required().label('Min Order QTY'),
                        itemCode: Joi.required().label('Item Code'),
                    });
                    const {error} = addProductValidation.validate(req.body);            
                    if(error) return res.status(400).send(error.details[0].message);*/
                    const productNameClean = req.body.product_name.toString().trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
        
                    const productDetails= {
                        product_name: req.body.product_name,
                        product_desc: req.body.product_desc,
                        product_imgs: uploadedImgs.toString(),
                        product_logo: brandLogo.toString(),
                        SubProductCategories_sub_prod_cat_id: req.body.SubProductCategories_sub_prod_cat_id,
                        SubProductCategories_ProductCategories_product_cat_id: req.body.SubProductCategories_ProductCategories_product_cat_id,
                        min_order_qty: req.body.min_order_qty,
                        product_unit: req.body.product_unit,
                        product_spec_desc: req.body.product_spec_desc,
                        product_qty: req.body.product_qty,
                        product_price: req.body.product_price,
                        product_sample_price: req.body.product_sample_price,
                        Company_company_id: decoded.companyId,
                        country: req.body.product_country,
                        product_item_code: req.body.itemCode,
                        admin_approved: 0,
                        created_date: new Date(),
                        last_updated: new Date(),
                        product_variants : JSON.stringify(req.body.product_variants),
                        offer_samples: req.body.offer_samples,
                        sustainable_product: req.body.sustainable_product,
                        product_created_by: decoded.id,
                        duty: req.body.dutyid
                    };
        
                    const response = await generalQuery.asynqQuery(productQuery.addProductQuery, productDetails);
                    const productUrl = `${productNameClean}-${response.insertId}`;
                    await generalQuery.asynqQuery(productQuery.updateProdUrl,[productUrl, response.insertId]);
        
                    if (response.insertId){
                        for (var c=0;c<req.body.customTabs.length;c++){
                            const productCustomTabDetails = {
                                product_cus_tab_name: req.body.customTabs[c].product_cus_tab_name,
                                product_cus_tab_desc: req.body.customTabs[c].product_cus_tab_desc,
                                Product_product_id: response.insertId,
                                Product_Company_company_id: decoded.companyId
                            };
                            const productCustomTabRes = await generalQuery.asynqQuery(productQuery.addProductCustomTabQuery, productCustomTabDetails);
                        }
                        for (var d=0;d<req.body.product_specifications.length;d++){
                            const productSpecAttrDetails = {
                                attr_key: req.body.product_specifications[d].attr_key,
                                attr_value: req.body.product_specifications[d].attr_value,
                                Product_product_id: response.insertId,
                                Product_Company_company_id: decoded.companyId
                            };
                            const productSpecAttrDetailsRes = await generalQuery.asynqQuery(productQuery.addProductSpecAttrQuery, productSpecAttrDetails);
                        }
                    }
                    
                    await notificationSe.createNotification('ADMIN', 'SELLER', '-1', 'PRODUCT', productUrl, 'New product added by a seller');
                    return res.status(200).send({message: 'Success'});
                } catch (e) {
                    return res.status(400).send({message: e});
                }
            } else {
                return res.status(400).send({message: 'Brand logo image size should be lower than 1MB'});
            }
        } else {
            return res.status(400).send({message: 'Product images should be lower than 1MB'});
        }        
    }

    async getProductCategories(req,res){
        const getProductCategories = await generalQuery.asynqQuery(productQuery.productCategoriesQuery);
        if (!getProductCategories) {
            return res.status(400).send({message:getProductCategories});
        }
        return res.status(200).send({message:'Success', data : getProductCategories});
    }
    async getSubProductCategories(req,res){
        const getSubProductCategories = await generalQuery.asynqQuery(productQuery.subProductCategoriesQuery,[req.params.productCatId]);
        if (!getSubProductCategories) {
            return res.status(400).send({message:getSubProductCategories});
        }
        return res.status(200).send({message:'Success', data : getSubProductCategories});
    }
    async getProductSpecificAttrs(req,res){
        const getProductSpecificAttrs = await generalQuery.asynqQuery(productQuery.productSpecAttrs,[req.params.subCategoryId]);
        if (!getProductSpecificAttrs) {
            return res.status(400).send({message:getProductSpecificAttrs});
        }
        return res.status(200).send({message:'Success', data : getProductSpecificAttrs});
    }

    async getProductListByGeneralPersonalUser(req,res){

        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        if(!decoded) return res.status(401).send('Access Denied');
        let productList;

        if(req.body.filter === 'pending') {
            productList = await generalQuery.asynqQuery(productQuery.getSellerProductListByApprovalQuery,['0', decoded.id]);
        } else if(req.body.filter === 'approved') {
            productList = await generalQuery.asynqQuery(productQuery.getSellerProductListByApprovalQuery,['1', decoded.id]);
        } else if(req.body.filter === 'inStock') {
            productList = await generalQuery.asynqQuery(productQuery.getSellerProductListByStockQuery,['0', decoded.id]);
        } else if(req.body.filter === 'outOfStock') {
            productList = await generalQuery.asynqQuery(productQuery.getSellerProductListByStockQuery,['1', decoded.id]);
        } else {
            productList = await generalQuery.asynqQuery(productQuery.getSellerProductListAllQuery,[decoded.id]);
        }
       
        
        return res.status(200).send({message:'Success', data : productList});
    }

    async saveProductSeries(req,res){
        var saveProductSeries;
        var updatePsURL;
        
        const uploadedImgs = await generalQuery.uploadImagesToSpace([req.body.product_series_banner], 'series-banners');       
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);

        const productSeriesRefDetails = {
            product_series_name: req.body.product_series_name,
            product_series_desc: req.body.product_series_desc,
            product_category_id: req.body.product_category_id,
            product_series_banner: uploadedImgs.toString(),
            created_date : new Date(),
            company_id: decoded.companyId,
            created_by: decoded.id
        };

        const productSeriesRef = await generalQuery.asynqQuery(productQuery.addProductSeriesRef,productSeriesRefDetails);
        
        const seriesNamrClean = req.body.product_series_name.toString().trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
        const productUrl = `${seriesNamrClean}-${productSeriesRef.insertId}`;

        await generalQuery.asynqQuery(productQuery.updatePsRefQuery,[productUrl,productSeriesRef.insertId]);

        for (var a=0;a<req.body.product_id.length;a++){
            var productSeriesDetails = {    
                product_id: req.body.product_id[a],
                product_series_ref_id: productSeriesRef.insertId,
            };

            const productDetails = {
                is_series_product: 1
            };

            saveProductSeries = await generalQuery.asynqQuery(productQuery.addProductSeries, productSeriesDetails);
            await generalQuery.asynqQuery(productQuery.updateProductQurey,[productDetails, req.body.product_id[a]]);
        }
        let seriesNotificationMsg = `New product series added by a seller #${productSeriesRef.insertId}`;
        await notificationSe.createNotification('ADMIN', 'SELLER', '-1', 'PRODUCT_SERIES', productSeriesRef.insertId, seriesNotificationMsg);
        return res.status(200).send({message:'Success', data : saveProductSeries});
    }
    async updateProducts(req, res){
        const productDetails = {
            product_name: req.body.product_name, product_desc : req.body.product_desc, product_imgs: req.body.product_imgs,
            min_order_qty: req.body.min_order_qty, product_status: req.body.product_status, product_unit: req.body.product_unit,
            product_spec_desc: req.body.product_spec_desc, product_qty: req.body.product_qty, product_logo: req.body.product_logo,
            product_price: req.body.product_price, product_sample_price: req.body.product_sample_price, shipping_method: req.body.shipping_method

        };
        const updateProducts = await generalQuery.asynqQuery(productQuery.updateProductQurey,[productDetails,req.params.productId]);
            if (!updateProducts){
                return res.status(400).send({message:updateProducts});
            }
            return res.status(200).send({message:'Success', data : updateProducts});
    }

    async deleteProduct(req, res){
        const deletetUpdateStatus ={
            deleted:1
        };
        const deleteProduct = await generalQuery.asynqQuery(productQuery.deleteProductQuery,[deletetUpdateStatus, req.params.productId]);
        if (!deleteProduct){
            return res.status(400).send({message:deleteProduct});
        }
        return res.status(200).send({message:'Success', data : deleteProduct});
    }

    async publishProduct(req, res){
        const saveProduct ={
           sellerPublished:req.body.sellerPublished
        };
        const publishProduct = await generalQuery.asynqQuery(productQuery.saveProductsQuery,[saveProduct, req.params.productId]);
        if (!publishProduct){
            return res.status(400).send({message:publishProduct});
        }
        return res.status(200).send({message:'Success', data : publishProduct});
    }
    async getAllProducts(req,res){

        const response = await generalQuery.asynqQuery(productQuery.getAllProds);
        if (!response){
            return res.status(400).send({message:response});
        }
        return res.status(200).send({message:'Success', data : response});
    }
    async getProductInfoByUrl(req,res){
        var product;
        var variants;
        var customTabs;
        var productSpecAttr;
        var relatedProducts;
        var productCatInfo;
        try {
            product = await generalQuery.asynqQuery(productQuery.productByUrl,[req.params.productUrl]);
            productCatInfo = await generalQuery.asynqQuery(productQuery.getProductCatsByUrlQuery,[req.params.productUrl]);
            variants = await generalQuery.asynqQuery(productQuery.getProductVariantByProduct,[product[0].product_id]);
            customTabs = await generalQuery.asynqQuery(productQuery.getProdCustTabsByProduct,[product[0].product_id]);
            productSpecAttr = await generalQuery.asynqQuery(productQuery.getProdSpecAttrByProduct,[product[0].product_id]);
            relatedProducts = await generalQuery.asynqQuery(productQuery.getRelatedProductsQuery, [product[0].SubProductCategories_sub_prod_cat_id, product[0].product_id]);
               
            return res.status(200).send({message:'Success', data : {
                product, variants, customTabs, productSpecAttr, relatedProducts, productCatInfo
            }});

        } catch (e){
            return res.status(400).send({message:'Product Not Found'});
        }

    }
    async getProductInfoByUrlForSeller(req,res){
        var product;
        var variants;
        var customTabs;
        var productSpecAttr;
        var relatedProducts;
        try {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);

         product = await generalQuery.asynqQuery(productQuery.getProductByUrlForSellerQuery,[req.params.productUrl,decoded.companyId]);
         variants = await generalQuery.asynqQuery(productQuery.getProductVariantByProduct,[product[0].product_id]);
         customTabs = await generalQuery.asynqQuery(productQuery.getProdCustTabsByProduct,[product[0].product_id]);
         productSpecAttr = await generalQuery.asynqQuery(productQuery.getProdSpecAttrByProduct,[product[0].product_id]);
         relatedProducts = await generalQuery.asynqQuery(productQuery.getRelatedProductsQuery, [product[0].SubProductCategories_sub_prod_cat_id, product[0].product_id]);
         return res.status(200).send({message:'Success', data : {product, variants, customTabs, productSpecAttr, relatedProducts}});

        } catch (e){
            return res.status(400).send({message:'Product Not Found'});
        }

    }
    async getProductByUrlForAdmin(req,res){
        var product;
        var variants;
        var customTabs;
        var productSpecAttr;
        var relatedProducts;
        try {

         product = await generalQuery.asynqQuery(productQuery.getProductByUrlForAdminQuery,[req.params.productUrl]);
         variants = await generalQuery.asynqQuery(productQuery.getProductVariantByProduct,[product[0].product_id]);
         customTabs = await generalQuery.asynqQuery(productQuery.getProdCustTabsByProduct,[product[0].product_id]);
         productSpecAttr = await generalQuery.asynqQuery(productQuery.getProdSpecAttrByProduct,[product[0].product_id]);
         relatedProducts = await generalQuery.asynqQuery(productQuery.getRelatedProductsQuery, [product[0].SubProductCategories_sub_prod_cat_id, product[0].product_id]);
         return res.status(200).send({message:'Success', data : {product, variants, customTabs, productSpecAttr, relatedProducts}});

        } catch (e){
            return res.status(400).send({message:'Product Not Found'});
        }

    }
    async getProductInfoByUrlForAdmin(req,res){
        var product;
        var variants;
        var customTabs;
        var productSpecAttr;
        var relatedProducts;
        try {

         product = await generalQuery.asynqQuery(productQuery.getProductByUrlForSellerQuery,[req.params.productUrl]);
         variants = await generalQuery.asynqQuery(productQuery.getProductVariantByProduct,[product[0].product_id]);
         customTabs = await generalQuery.asynqQuery(productQuery.getProdCustTabsByProduct,[product[0].product_id]);
         productSpecAttr = await generalQuery.asynqQuery(productQuery.getProdSpecAttrByProduct,[product[0].product_id]);
         relatedProducts = await generalQuery.asynqQuery(productQuery.getRelatedProductsQuery, [product[0].SubProductCategories_sub_prod_cat_id, product[0].product_id]);
         return res.status(200).send({message:'Success', data : {product, variants, customTabs, productSpecAttr, relatedProducts}});

        } catch (e){
            return res.status(400).send({message:'Product Not Found'});
        }

    }
    async getProductByCategory(req,res){
        var product;
        try {
         product = await generalQuery.asynqQuery(productQuery.getProductByCategory,[req.params.categoryId]);
         return res.status(200).send({message:'Success', data : product});

        } catch (e){
            return res.status(400).send({message:e});
        }

    }
    async getProductBySubCategory(req,res){
        var product;
        try {
         product = await generalQuery.asynqQuery(productQuery.getProductBySubCategory,[req.params.subCategoryId]);
         return res.status(200).send({message:'Success', data : product});

        } catch (e){
            return res.status(400).send({message:e});
        }

    }

    async getAllFeaturedProductList(req,res) {
        const response = await generalQuery.asynqQuery(productQuery.getAllFeaturedProductsQuery);
        if (!response){
            return res.status(400).send({message:response});
        }
        return res.status(200).send({message:'Success', data : response});
    }

    async getProductsBySubCategoriesBySeller(req,res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const response = await generalQuery.asynqQuery(productQuery.getProductsBySubCategoriesBySellerQuery,[req.params.subCategoryId,decoded.id]);
        if (!response){
            return res.status(400).send({message:response});
        }
        return res.status(200).send({message:'Success', data : response});
    }

    async getTopSellers(req,res) {
        const response = await generalQuery.asynqQueryNoParams(productQuery.getTopSellersQuery);
        if (!response){
            return res.status(400).send({message:response});
        }
        return res.status(200).send({message:'Success', data : response});
    }
    async getNewProducts(req,res) {
        const response = await generalQuery.asynqQueryNoParams(productQuery.getNewProductsQuery);
        if (!response){
            return res.status(400).send({message:response});
        }
        return res.status(200).send({message:'Success', data : response});
    }

    async sendSampleReq(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const sampleReqData = {
            product_id: req.body.productId,
            buyer_note: req.body.note,
            buyer_email: decoded.email,
            shipped_date: null,
            requested_date: new Date(),
            sample_status: 'Pending'
        }
        
        if(decoded.userType === 1) {
            const getProductUrl = await generalQuery.asynqQuery(productQuery.getProductUrlQuery, req.body.productId)
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });

            const getSellerEmail = await generalQuery.asynqQuery(productQuery.getProductSellerEmailQuery, req.body.productId)
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });

            const sellerEmail = getSellerEmail[0].gen_p_email;
            const sellerName = getSellerEmail[0].gen_p_full_name;

            if(sellerEmail) {
                const htmlEmail = {
                    subject: `Direct2SResort - Product Sample Request`,
                    fullName: sellerName,
                    productName: getProductUrl[0].product_name,
                    productUrl: `http://dev.apium.io/ivys/#/product/${getProductUrl[0].product_url}`
                };
                const sendEmail = await generalQuery.sendMail('ivys@apium.io', sellerEmail, 'sampleReqSellerNotifiy', htmlEmail);

                const htmlEmailForBuyer = {
                    subject: `Direct2SResort - Product Sample Request Recived`,
                    productName: getProductUrl[0].product_name,
                    productUrl: `http://dev.apium.io/ivys/#/product/${getProductUrl[0].product_url}`
                };
                const sendBuyerEmail = await generalQuery.sendMail('ivys@apium.io', decoded.email, 'buyerReqSampleNotifiy', htmlEmailForBuyer);

                const sendSampleReq = await generalQuery.asynqQuery(productQuery.saveSampleReqQuery, sampleReqData)
                .catch(error => {
                    return res.status(400).send({message: error.code, status: false}); 
                });

                if(sendSampleReq.insertId > 0) {
                    return res.status(200).send({message:'Your request has been  submited', status: true});
                } else {
                    return res.status(400).send({message:'Something went wrong please try again', status: false}); 
                } 
            } else {
                return res.status(400).send({message:'Seller email not found', status: false}); 
            }                    
        } else {
            return res.status(400).send({message:'Only buyers can request samples', status: false}); 
        }
    }
}
module.exports = Products;
