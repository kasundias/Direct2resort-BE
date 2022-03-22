var userQuery = require('../../loaders/userQuery');
var adminAppQuery = require('../../loaders/adminApproalQuery');
const jwt = require('jsonwebtoken');
var utils = require('../util/util.service');
const UtilService = new utils();
var GeneralQueryService = require('../../services/util/util.service');
const generalQuery = new GeneralQueryService();
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const fs = require('fs');

const NotificationService = require('../../services/util/notification.service');
const { now } = require('moment');
const notificationSe = new NotificationService();

class AdminApproal{
    async getGeneralPersonalUserStatus(req,res){

        const getGeneralPersonalUserStatus= {gen_p_ivys_admin_aproval : 'Inactive'};
        const getGeneralPersonalUser = await generalQuery.asynqQuery(adminAppQuery.getGeneralPersonalUser,getGeneralPersonalUserStatus);
        if (!getGeneralPersonalUser) {
            return res.status(400).send({message: getGeneralPersonalUser});
        }
        return res.status(200).send({message: 'Success', data: getGeneralPersonalUser});
    }
    async getCompanyStatus(req,res){

        const getCompanyStatus= {company_ivys_admin_aproval : 'Inactive'};
        const getCompany = await generalQuery.asynqQuery(adminAppQuery.getCompany,getCompanyStatus);
        if (!getCompany) {
            return res.status(400).send({message: getCompany});
        }
        return res.status(200).send({message: 'Success', data: getCompany});
    }
    async getCompanyDetailsByUser(req,res){

        const getCompany = await generalQuery.asynqQuery(adminAppQuery.getCompanyDetailsByUserQuery,[req.params.gen_p_user_id]);
        if (!getCompany) {
            return res.status(400).send({message: getCompany});
        }
        return res.status(200).send({message: 'Success', data: getCompany});
    }

    async updateCompanyStatus(req,res){
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);

        const updateGenaralPersonStatus= [req.body.company_ivys_admin_aproval, decoded.companyId];
        const updateCompanyStatus = await generalQuery.asynqQuery(adminAppQuery.updateCompayStatus,updateGenaralPersonStatus);

        if (!updateCompanyStatus) {
            return res.status(400).send({message: updateCompanyStatus});
        }
        return res.status(200).send({message: 'Success', data: updateCompanyStatus});

    }

    async deleteGenaralUser(req,res){
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const deleteGenaralUser = {gen_p_user_id:decoded.id};
        const deleteGenaral = await generalQuery.asynqQuery(adminAppQuery.deleteGenaralUser,deleteGenaralUser);

        if (!deleteGenaral) {
            return res.status(400).send({message: deleteGenaral});
        }
        return res.status(200).send({message: 'Success', data: deleteGenaral});
    }

    async deleteCompany(req,res){
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);

        const deleteCompany = {company_id:decoded.companyId};
        const deleteCompanyQuery = await generalQuery.asynqQuery(adminAppQuery.deleteCompany,deleteCompany);

        if (!deleteCompanyQuery) {
            return res.status(400).send({message: deleteCompanyQuery});
        }
        return res.status(200).send({message: 'Success', data: deleteCompanyQuery});

    }

    async updateQuoteByAdmin(req,res){
        const updateAdminQuoteStatus = {
            final_admin_aproval: req.body.final_admin_aproval,
            final_client_aproval:req.body.final_client_aproval
        };
        const updateQuoteByAdmin = await generalQuery.asynqQuery(adminAppQuery.updateQuoteAdminQuery,[updateAdminQuoteStatus,req.params.QuoteId]);
        if (!updateQuoteByAdmin) {
            return res.status(400).send({message: updateQuoteByAdmin});
        }
        return res.status(200).send({message: 'Success', data: updateQuoteByAdmin});
    }

    async deleteQuotesAdmin(req,res){
        const addDeletedValue = {
            deleted:1
        };
        const deleteQuotesAdmin = await generalQuery.asynqQuery(adminAppQuery.deleteQuotesAdminQuery,[addDeletedValue,req.params.QuoteId]);

        if (!deleteQuotesAdmin) {
            return res.status(400).send({message: deleteQuotesAdmin});
        }
        return res.status(200).send({message: 'Success: Quotes Deleted ', data: deleteQuotesAdmin});
    }

    async getAllSellers(req,res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if(!isAdmin) return res.status(401).send('Access Denied');
        let getAllSellers;

        if(req.body.filter === 'Active' || req.body.filter === 'Inactive' || req.body.filter === 'Deleted') {
            getAllSellers = await generalQuery.asynqQuery(adminAppQuery.getAllGenUsersAIDQuery,[2, req.body.filter])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'emailVerified') {
            getAllSellers = await generalQuery.asynqQuery(adminAppQuery.getAllGenUsersEmailVerifyQuery,[2, 1])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'emailNotVerified') {
            getAllSellers = await generalQuery.asynqQuery(adminAppQuery.getAllGenUsersEmailVerifyQuery,[2, 0])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else {
            getAllSellers = await generalQuery.asynqQuery(adminAppQuery.getAllGenUsersQuery,[2])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        }      

        return res.status(200).send({message: 'Success', data: getAllSellers});
    }

    async getAllBuyers(req,res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if(!isAdmin) return res.status(401).send('Access Denied');
        let getAllBuyers;

        if(req.body.filter === 'Active' || req.body.filter === 'Inactive' || req.body.filter === 'Deleted') {
            getAllBuyers = await generalQuery.asynqQuery(adminAppQuery.getAllGenUsersAIDQuery,[1, req.body.filter])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'emailVerified') {
            getAllBuyers = await generalQuery.asynqQuery(adminAppQuery.getAllGenUsersEmailVerifyQuery,[1, 1])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'emailNotVerified') {
            getAllBuyers = await generalQuery.asynqQuery(adminAppQuery.getAllGenUsersEmailVerifyQuery,[1, 0])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else {
            getAllBuyers = await generalQuery.asynqQuery(adminAppQuery.getAllGenUsersQuery,[1])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        }

        return res.status(200).send({message: 'Success', data: getAllBuyers});
    }

    async getAllLogistic(req,res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if(!isAdmin) return res.status(401).send('Access Denied');
        let getAllLogistic;
        
        if(req.body.filter === 'Active' || req.body.filter === 'Inactive' || req.body.filter === 'Deleted') {
            getAllLogistic = await generalQuery.asynqQuery(adminAppQuery.getAllGenUsersAIDQuery,[3, req.body.filter])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'emailVerified') {
            getAllLogistic = await generalQuery.asynqQuery(adminAppQuery.getAllGenUsersEmailVerifyQuery,[3, 1])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'emailNotVerified') {
            getAllLogistic = await generalQuery.asynqQuery(adminAppQuery.getAllGenUsersEmailVerifyQuery,[3, 0])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else {
            getAllLogistic = await generalQuery.asynqQuery(adminAppQuery.getAllGenUsersQuery,[3])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        }

        return res.status(200).send({message: 'Success', data: getAllLogistic});
    }

    async userStatusUpdate(req,res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if(!isAdmin) return res.status(401).send('Access Denied');

        try {
            const updateGenaralPersonStatus = [req.body.gen_p_ivys_admin_aproval, req.body.gen_p_user_id];
            const updateGenaralPerson = await generalQuery.asynqQuery(adminAppQuery.updateGenaralStatus,updateGenaralPersonStatus);
            if(!updateGenaralPerson) return res.status(400).send('Status update failed');

            return res.status(200).send({message: 'Success', data: updateGenaralPerson});
        } catch (e) {
            res.status(400).send(e);
        }
    }

    async addAdminUser(req,res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if(!isAdmin) return res.status(401).send('Access Denied');

        try {
            const adminRegValidate = Joi.object({
                email: Joi.string()
                    .required()
                    .email(),
                password: Joi.string()
                    .min(4)
                    .required(),
                fName: Joi.string()
                    .required()
                    .label('First Name'),
                lName: Joi.string()
                    .required()
                    .label('Last Name'),
                phone: Joi.string()
                    .required()
                    .label('Contact Number'),
            });

            const {error} = adminRegValidate.validate(req.body);
            if(error) return res.status(400).send(error.details[0].message);

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt);

            const adminUserData = {
                admin_email: req.body.email,
                admin_fName: req.body.fName,
                admin_lName: req.body.lName,
                admin_contact_number: req.body.phone,
                password: hashPassword
            };
            console.log(adminUserData);

            const response = await UtilService.asynqQuery(userQuery.adminLogin, [req.body.email]);
            if(response.length) return res.status(400).send('Email Already Exisits');

            const addAdminUser = await generalQuery.asynqQuery(adminAppQuery.adminUserInsertQuery, adminUserData);
            if(!addAdminUser.insertId) return res.status(400).send('Admin creation failed');

            return res.status(200).send({message: 'Success', data: addAdminUser});
        } catch (e) {
            console.log(e);
            res.status(400).send(e);
        }
    }

    async getAllAdminUsers(req,res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if(!isAdmin) return res.status(401).send('Access Denied');

        const getAllAdminusers = await generalQuery.asynqQueryNoParams(adminAppQuery.getAllAdminUsersQuery);
        if(!getAllAdminusers.length) return res.status(400).send('No Admin Users Found');

        return res.status(200).send({message: 'Success', data: getAllAdminusers});
    }

    async getAllProducts(req,res){
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if(!isAdmin) return res.status(401).send('Access Denied');

        let getAllProducts;

        if(req.body.filter === 'Approved') {
            getAllProducts = await generalQuery.asynqQuery(adminAppQuery.getAllProductApprovedNotApprovedQuery,[1])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'PendingApproval') {
            getAllProducts = await generalQuery.asynqQuery(adminAppQuery.getAllProductApprovedNotApprovedQuery,[0])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'Deleted') {
            getAllProducts = await generalQuery.asynqQuery(adminAppQuery.getAllProductDeletedQuery)
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else if(req.body.filter === 'Featured') {
            getAllProducts = await generalQuery.asynqQuery(adminAppQuery.getAllProductFeaturedQuery)
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        } else {
            getAllProducts = await generalQuery.asynqQuery(adminAppQuery.getAllProductQuery)
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
        }

        return res.status(200).send({message: 'Success', data: getAllProducts});
    }

    async approveRejectProduct(req, res){
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        let notificationMsg;

        if(!isAdmin) return res.status(401).send('Access Denied');

        const updateProduct = await generalQuery.asynqQuery(adminAppQuery.adminAproveProductQuery, [req.body.status, req.body.product_id]);
        if(updateProduct.changedRows === 0) return res.status(400).send('Aproval failed');

        if(req.body.status === 0) {
            notificationMsg = `${req.body.product_name} unpublished by Admin`;
        } else {
            notificationMsg = `${req.body.product_name} approved and published by Admin`;
        }

        await notificationSe.createNotification('SELLER', 'ADMIN', req.body.product_created_by, 'PRODUCT', req.body.product_url, notificationMsg);
        return res.status(200).send({message: 'Success', data: updateProduct});
    }   

    async getAllQuotes(req,res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if (!isAdmin){
            return res.status(401).send('Access Denied');
        }

        const getAllQuotes = await generalQuery.asynqQueryNoParams(adminAppQuery.getAllQuotesQuey);
        if (!getAllQuotes.length){
            return res.status(400).send('No Quotes Found');
        }

        return res.status(200).send({message: 'Success', data: getAllQuotes});
    }

    async getAllQuoteInstances(req,res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if (!isAdmin){
            return res.status(401).send('Access Denied');
        }
        const getAllQuoteInst = await generalQuery.asynqQuery(adminAppQuery.adminGetQuoteInstanceQuery, req.params.quoteId);

        return res.status(200).send({message: 'Success', data: getAllQuoteInst});
    }

    async getQuoteById(req,res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if (!isAdmin){
            return res.status(401).send('Access Denied');

        }
        const quote = await generalQuery.asynqQuery(adminAppQuery.adminGetQuoteByIdQuery, req.params.quoteId);

        return res.status(200).send({message: 'Success', data: quote});
    }
    async getAllQuotesUnApprovedAdmin(req,res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if (!isAdmin){
            return res.status(401).send('Access Denied');
        }
        const getAllQuotes = await generalQuery.asynqQueryNoParams(adminAppQuery.getAllSeriesQuotesQuery);
        if (!getAllQuotes.length){
            return res.status(400).send('No Quotes Found');
        }

        return res.status(200).send({message: 'Success', data: getAllQuotes});
    }

    async getAllQuotesApprovedAdmin(req,res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if (!isAdmin){
            return res.status(401).send('Access Denied');
        }
        const getAllQuotes = await generalQuery.asynqQueryNoParams(adminAppQuery.getQuoteQuoteInstancesApprovedQuery);
        if (!getAllQuotes.length){
            return res.status(400).send('No Quotes Found');
        }

        return res.status(200).send({message: 'Success', data: getAllQuotes});
    }

    async addCategory(req,res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if (!isAdmin){
            return res.status(401).send('Access Denied');
        }

        const categoryAddValidation = Joi.object({
            product_cat_id: Joi.number()
                .optional(),
            product_cat_name: Joi.string()
                .required()
                .label('Category Name'),
            product_cat_desc: Joi.string()
                .optional()
                .allow('')
                .label('Category Description'),
            product_cat_img: Joi.string()
                .required()
                .label('Category Image'),
            category_slug: Joi.string().optional().allow(null)
        });

        const {error} = categoryAddValidation.validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const removeSpecialCharactors = req.body.product_cat_name.toString().trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");

        const categoryData = {
            product_cat_name: req.body.product_cat_name,
            product_cat_desc: req.body.product_cat_desc,
            product_cat_img: req.body.product_cat_img
        };

        const category = await generalQuery.asynqQuery(adminAppQuery.addCategoryQuery, categoryData);
        if(!category.insertId) return res.status(400).send('Add new category failed');

        const slugData = {category_slug: `${removeSpecialCharactors}-${category.insertId}`};
        const updateSlug = await generalQuery.asynqQuery(adminAppQuery.updateCategoryQuery, [slugData, category.insertId]);
        
        return res.status(200).send({message: 'Success', data: category});
    }

    async updateCategory(req,res) {

        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if (!isAdmin){
            return res.status(401).send('Access Denied');
        }

        const categoryAddValidation = Joi.object({
            product_cat_id: Joi.number()
                .required(),
            product_cat_name: Joi.string()
                .required()
                .label('Category Name'),
            product_cat_desc: Joi.string()
                .optional()
                .allow('')
                .label('Category Description'),
            product_cat_img: Joi.string()
                .required()
                .label('Category Image'),
            deleted: Joi.number().optional(),
            category_slug: Joi.string().optional().allow(null)
        });

        const {error} = categoryAddValidation.validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const removeSpecialCharactors = req.body.product_cat_name.toString().trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");

        const categoryData = {
            product_cat_name: req.body.product_cat_name,
            product_cat_desc: req.body.product_cat_desc,
            product_cat_img: req.body.product_cat_img,
            category_slug: `${removeSpecialCharactors}-${req.body.product_cat_id}`
        };        
        
        const category = await generalQuery.asynqQuery(adminAppQuery.updateCategoryQuery, [categoryData, req.body.product_cat_id]);
        if(!category.affectedRows) return res.status(400).send('category update failed');

        return res.status(200).send({message: 'Success', data: category});
    }

    async deleteCategory(req,res) {
        const category = await generalQuery.asynqQuery(adminAppQuery.deleteCategoryQuery, req.params.catId);
        if(!category.changedRows) return res.status(400).send('category delete failed');

        return res.status(200).send({message: 'Success', data: category});
    }

    async getAllCategories(req,res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if (!isAdmin){
            return res.status(401).send('Access Denied');
        }
        const categoryList = await generalQuery.asynqQuery(adminAppQuery.getAllCategoriesQuery);

        return res.status(200).send({message: 'Success', data: categoryList});
    }

    async addSubCategory(req,res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if (!isAdmin){
            return res.status(401).send('Access Denied');
        }

        const subCategoryValidation = Joi.object({
            sub_prod_cat_name: Joi.string()
                .required()
                .label('Sub Category Name'),
            sub_prod_cat_desc: Joi.string()
                .optional()
                .allow('')
                .label('Sub Category Description'),
            ProductCategories_product_cat_id: Joi.number()
                .required()
                .label('Category ID')
        });

        const {error} = subCategoryValidation.validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const subCategoryData = {
            sub_prod_cat_name: req.body.sub_prod_cat_name,
            sub_prod_cat_desc: req.body.sub_prod_cat_desc,
            ProductCategories_product_cat_id: req.body.ProductCategories_product_cat_id
        };

        const subCategory = await generalQuery.asynqQuery(adminAppQuery.addSubCategoryQuery, subCategoryData);
        if(!subCategory.insertId) return res.status(400).send('Add new sub category failed');

        return res.status(200).send({message: 'Success', data: subCategory});
    }

    async getAllSubCategories(req,res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if (!isAdmin){
            return res.status(401).send('Access Denied');
        }
        const subCategoryList = await generalQuery.asynqQuery(adminAppQuery.getAllSubCategoriesQuery);

        return res.status(200).send({message: 'Success', data: subCategoryList});
    }

    async addCategorySpecAttr(req,res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if (!isAdmin){
            return res.status(401).send('Access Denied');
        }

        const catSpecValidation = Joi.object({
            cat_spec_name: Joi.string()
                .required()
                .label('Attribute Name'),
            sub_prod_cat: Joi.number()
                .optional()
                .allow('')
                .label('Sub Product Category'),
            prod_cat: Joi.number()
                .required()
                .label('Product Category')
        });

        const {error} = catSpecValidation.validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const catSpectData = {
            cat_spec_attr_metas: req.body.cat_spec_name,
            SubProductCategories_sub_prod_cat_id: req.body.sub_prod_cat,
            SubProductCategories_ProductCategories_product_cat_id: req.body.prod_cat
        };

        const catSpecAttr = await generalQuery.asynqQuery(adminAppQuery.addCatSpecAttrQuery, catSpectData);
        if(!catSpecAttr.insertId) return res.status(400).send('Add new attribute failed');

        return res.status(200).send({message: 'Success', data: catSpecAttr});
    }

    async getAllCatAttrs(req,res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if (!isAdmin){
            return res.status(401).send('Access Denied');
        }
        const catAttrs = await generalQuery.asynqQuery(adminAppQuery.getAllCatAttrsQuery);

        return res.status(200).send({message: 'Success', data: catAttrs});
    }
    async updateAdminQuoteInstanceApproval(req,res) {
        var response;
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if (!isAdmin){
            return res.status(401).send('Access Denied');
        }
       try {
        const duty =await generalQuery.asynqQuery(adminAppQuery.getDutyValQuery,[req.body.product_id]);

        const fees = await generalQuery.asynqQuery(adminAppQuery.getFeesQuery);
        const getSellerFee = await generalQuery.asynqQuery(adminAppQuery.getSellerFeeQuery,[req.body.quote_instance_id]);
        const recDuty = (duty[0].duty/100)*getSellerFee[0].seller_price;
        const direct2rest=(fees[0].markup_percentage/100)*getSellerFee[0].seller_price;
        const repacking=(fees[1].markup_percentage/100)*getSellerFee[0].seller_price;
        const ownermargin=direct2rest+repacking+recDuty;
        response = await generalQuery.asynqQuery(adminAppQuery.adminApproveQuoteInstanceQuery,[direct2rest,repacking,recDuty,ownermargin,req.body.quote_instance_id]);
    } catch (e) {
        return res.status(400).send({message: e});
       } finally {
        return res.status(200).send({message: 'Success', data: response});
       }
    }
    async getMarkupPricesInfo(req,res){
        const fees = await generalQuery.asynqQueryNoParams(adminAppQuery.getFeesQuery);
        const getSellerFee = await generalQuery.asynqQuery(adminAppQuery.getSellerFeeQuery,[req.params.quote_instance_id]);
        const duty =await generalQuery.asynqQuery(adminAppQuery.getDutyValQuery,[req.params.product_id]);
        const recDuty = (duty[0].duty/100)*getSellerFee[0].seller_price;
        const direct2rest=(fees[0].markup_percentage/100)*getSellerFee[0].seller_price;
        const repacking=(fees[1].markup_percentage/100)*getSellerFee[0].seller_price;
             const ownermargin=direct2rest+repacking+recDuty;
        const total=ownermargin+getSellerFee[0].seller_price;
        const response ={
            'Direct2resort' :direct2rest,
            'Repacking' :repacking,
            'Duty' : recDuty,
            'ownermargin' : ownermargin,
            'total' : total
         };
        return res.status(200).send({message: 'Success', data: response});
    }
    async updateAdminQuoteInstanceApprovalBuyer(req,res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if (!isAdmin){
            return res.status(401).send('Access Denied');
        }
        const response = await generalQuery.asynqQuery(adminAppQuery.adminApproveBuyerQuoteInstanceQuery,[req.body.quote_instance_id]);
        return res.status(200).send({message: 'Success', data: response});
    }

    async toggleFeaturedProduct(req,res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if (!isAdmin){
            return res.status(401).send('Access Denied');
        }
        const response = await generalQuery.asynqQuery(adminAppQuery.toggleFeatuedProductQuery,[req.body.status, req.body.product_id]);
        return res.status(200).send({message: 'Success', data: response});
    }
    
    async getlpbidlist(req,res) {
        const response = await generalQuery.asynqQuery(adminAppQuery.lpbidlistQuery);

        for (var a=0;a<response.length;a++){
            response[a].count = await generalQuery.asynqQuery(adminAppQuery.getCountByQuoteQuery,[response[a].quote_frieght_uuid]); 
        }

        return res.status(200).send({message: 'Success', data: response});
    }

    async getlpbidviewSingle(req,res) {
        const seaFreightList = [];
        const airFreightList = [];
        let submitedBids = null;
        const topheader = await generalQuery.asynqQuery(adminAppQuery.lpbidviewtopQuery,[req.params.quoteId]);
        const frieghtMethod = await generalQuery.asynqQuery(adminAppQuery.checkQuoteShippingMethodQuery, [req.params.quoteId]);
        const bidSubmitedToBuyer = await generalQuery.asynqQuery(adminAppQuery.checkIfAdminSubmitedBidForBuyerQuery, [req.params.quoteId]);
        

        if(frieghtMethod) {
            if(frieghtMethod[0].frieght_method === 'Both' || frieghtMethod[0].frieght_method === 'Sea') {
                const seaF = await generalQuery.asynqQuery(adminAppQuery.lpbidviewSeaFQuery,[req.params.quoteId]);
                seaFreightList.push(seaF);
            }
            if(frieghtMethod[0].frieght_method === 'Both' || frieghtMethod[0].frieght_method === 'Air') {
                const airF = await generalQuery.asynqQuery(adminAppQuery.lpbidviewAirFQuery,[req.params.quoteId]);
                airFreightList.push(airF);
            }
        }

        if(bidSubmitedToBuyer) {
            if(bidSubmitedToBuyer[0].logistic_bid_admin_aproval === 1) {                
                submitedBids = await generalQuery.asynqQuery(adminAppQuery.getSubmittedBidsQuery, [req.params.quoteId]);
            }
        }
        
        //  const newresponse =  await generalQuery.asynqQuery(adminAppQuery.getMinBidByQuoteQuery,[req.params.quoteId]);
       // response[0].minval = newresponse[0].minval;
        return res.status(200).send({message: 'Success', seaFrieght:seaFreightList, airFrieght: airFreightList, topheader : topheader, submitedBids: submitedBids});
    }
    
    async getlpDetailedView(req,res) {

        const response = await generalQuery.asynqQuery(adminAppQuery.getlpDetailedViewQuery,[req.params.lpBidId]);
        return res.status(200).send({message: 'Success', data: response});
    }

    async updateapproveSelectLpBid(req,res) {
        await generalQuery.asynqQuery(adminAppQuery.approveLpBidlpTableQuery,[req.body.logistic_partner_bid_id]);
        await generalQuery.asynqQuery(adminAppQuery.approvelpBidQuotesTableQuery,[req.body.quote_uuid]);
        const response =  await generalQuery.asynqQuery(adminAppQuery.rejectAllBidslpTableQuery,[req.body.logistic_partner_bid_id, req.body.quote_uuid]);
        console.log(response);
        return res.status(200).send({message: 'Success', data: response});
    }

    async getlpDetailedView(req,res) {

        const response = await generalQuery.asynqQuery(adminAppQuery.getlpDetailedViewQuery,[req.params.lpBidId]);
        return res.status(200).send({message: 'Success', data: response});
    }
    async getCompanyByUser(req, res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if (!isAdmin){
            return res.status(401).send('Access Denied');
        }
        const response = await generalQuery.asynqQuery(adminAppQuery.getCompanyByUserQuery, req.params.companyId);
        return res.status(200).send(response);
    }

    async getCategoryIcons(req, res){
        fs.readdir('./public/uploads/category-icons/', (err, files) => {
            return res.status(200).send(files);
        });
    }

    async getSampleRequests(req, res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if (!isAdmin){
            return res.status(401).send('Access Denied');
        }

        let response;

        if(req.body.filter === 'Pending' || req.body.filter === 'Shipped') {
            response = await generalQuery.asynqQuery(adminAppQuery.getSampleRequestsStatusQuery, req.body.filter);
        } else {
            response = await generalQuery.asynqQueryNoParams(adminAppQuery.getSampleRequestsAllQuery);
        }
        
        return res.status(200).send(response);
    }

    async sampleReqStatusUpdate(req, res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if (!isAdmin){
            return res.status(401).send('Access Denied');
        }

        const sampleProductData = await generalQuery.asynqQuery(adminAppQuery.getSampleBuyerEmailQuery, [req.params.reqId])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });

        const htmlEmailForBuyer = {
            subject: `Direct2SResort - Product Sample Shipped`,
            productName: sampleProductData[0].product_name,
            productUrl: `http://dev.apium.io/ivys/#/product/${sampleProductData[0].product_url}`
        };
        const sendBuyerEmail = await generalQuery.sendMail('ivys@apium.io', sampleProductData[0].buyer_email, 'buyerSampleShipped', htmlEmailForBuyer);
        
        const response = await generalQuery.asynqQuery(adminAppQuery.smapleReqMarkAsShippedQuery, [new Date(), req.params.reqId])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });
        
        return res.status(200).send(response);
    }

    async submitBidToBuyer(req, res) {
        const isAdmin = await UtilService.tokenCheckAdmin(req.header('authorization'));
        if (!isAdmin){
            return res.status(401).send('Access Denied');
        }  

        const bidIdList =  req.body.map(val => val.lpBidId);
        let sameUpdated = false;

        for(let i=0; i < req.body.length; i++) {
            const data = {
                lpBidId: req.body[i].lpBidId,
                buyerId: req.body[i].buyerId,
                freightType: req.body[i].freightType,
                freightTotal: req.body[i].freightTotal,
                freightData: req.body[i].freightData,
                lpCompanyName: req.body[i].lpCompanyName,
                quote_uuid: req.body[i].quoteUuid,
                freightEta: req.body[i].freightEta,
                created_date: new Date()
            }
           
            const submitBid = await generalQuery.asynqQuery(adminAppQuery.submitBidQuery, data)
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            }); 
           
            if(submitBid) {
                if(bidIdList.length > 0) {
                    const checkIfSameBid = bidIdList.every(val => val === bidIdList[0]);
                    if(checkIfSameBid && !sameUpdated) {
                        sameUpdated = true;
                        const updateLpBid = await generalQuery.asynqQuery(adminAppQuery.updateLpBidQuery, ['both', req.body[i].lpBidId])
                        .catch(error => {
                            return res.status(400).send({message: error.code, status: false}); 
                        });
    
                        const updateSeriesQuote = await generalQuery.asynqQuery(adminAppQuery.updateSeriesQuoteQuery, [req.body[i].quoteUuid])
                        .catch(error => {
                            return res.status(400).send({message: error.code, status: false}); 
                        });
    
                    } else if(!checkIfSameBid) {
                        const updateLpBid = await generalQuery.asynqQuery(adminAppQuery.updateLpBidQuery, [req.body[i].freightType, req.body[i].lpBidId])
                        .catch(error => {
                            return res.status(400).send({message: error.code, status: false}); 
                        });
    
                        const updateSeriesQuote = await generalQuery.asynqQuery(adminAppQuery.updateSeriesQuoteQuery, [req.body[i].quoteUuid])
                        .catch(error => {
                            return res.status(400).send({message: error.code, status: false}); 
                        });
                    }
                }
            }            
        }    

        sameUpdated = false;

        const notificationMsg = `Best shipping rate for Quote ${req.body[0].quoteUuid} updated.`;
        await notificationSe.createNotification('BUYER', 'ADMIN', req.body[0].buyerId, 'QUOTE', req.body[0].quoteUuid, notificationMsg);

        return res.status(200).send({status: true, msg: 'Bid submited to the buyer'});
    }

}
module.exports = AdminApproal;
