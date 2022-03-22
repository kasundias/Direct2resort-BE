const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');

var psQuery = require('../../loaders/productSeriesQuery');
var shopQueries = require('../../loaders/shopQueries');
var GeneralQueryService = require('../../services/util/util.service');
var productSeries=require('../../services/productseries/productSeries.service');
const productSeriesService=new productSeries();
const generalQuery = new GeneralQueryService();

class ShopPage {
    async getCategories(req,res) {
        const response = await generalQuery.asynqQuery(shopQueries.getAllCategoriesQuery);
        return res.status(200).send({message: 'Success', data: response});
    }

    async getSubCategories(req,res) {
        const catBySlug = await generalQuery.asynqQuery(shopQueries.getCatBySlugQuery, [req.params.catId]);
        if(catBySlug.length) {
            const response = await generalQuery.asynqQuery(shopQueries.getAllSubCategoriesQuery, [catBySlug[0].product_cat_id]);
            return res.status(200).send({message: 'Success', data: response});
        } else {
            return res.status(400).send({message: 'No Sub Categories Found'});
        }        
    }

    async filterProducts(req,res) {
        const subCatIdsArr = req.body.subCatIds;
        let product;
        let productSeries;

        
        if(subCatIdsArr.length > 0) {
            const catBySlug = await generalQuery.asynqQuery(shopQueries.getCatBySlugQuery, [req.body.categoryId]);
            if(catBySlug.length) {
                product = await generalQuery.asynqQuery(shopQueries.filterProductsQuery, [catBySlug[0].product_cat_id, subCatIdsArr, req.body.page]);   
                productSeries = await generalQuery.asynqQuery(psQuery.getPsByCategoryShopQuery, [catBySlug[0].product_cat_id]);
            } else {
                return res.status(400).send({message: 'No Sub Categories Found'});
            }
        } else if(req.body.categoryId !== 'all' && req.body.categoryId !== 'sustainable-products') {
            const catBySlug = await generalQuery.asynqQuery(shopQueries.getCatBySlugQuery, [req.body.categoryId]);
            if(catBySlug.length) {
                product = await generalQuery.asynqQuery(shopQueries.filterProductsNoSubCatsQuery, [catBySlug[0].product_cat_id, req.body.page]);
                productSeries = await generalQuery.asynqQuery(psQuery.getPsByCategoryShopQuery, [catBySlug[0].product_cat_id]);
            } else {
                return res.status(400).send({message: 'No Results Found'});
            }
        } else if(req.body.categoryId === 'sustainable-products') {
            product = await generalQuery.asynqQuery(shopQueries.getAllSustainableProductsQuery, [req.body.page]);
            productSeries = [];
        } else {
            product = await generalQuery.asynqQuery(shopQueries.noFilterProductsQuery,[req.body.page]);
            productSeries = await generalQuery.asynqQuery(psQuery.getPsAllShopQuery);
        }

        const response = {
            product,
            productSeries
        }

        return res.status(200).send({message: 'Success', product: product,productSeries : productSeries});
    }

    async liveSearchProduct(req,res) {
        const response = await generalQuery.asynqQuery(shopQueries.liveSearchProductQuery, "%"+req.params.searchString+"%");
                
        return res.status(200).send(response);
    }

    async getRelatedProducts(req, res) {
        const relatedProducts = await generalQuery.asynqQuery(shopQueries.getRelatedProductsQuery, [req.body.sub_prod_cat, req.body.product_id])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });
                
        return res.status(200).send(relatedProducts);
    }
}

module.exports = ShopPage;
