const createProductQuery = "INSERT INTO Product SET ?";
const createProductVariantQuery = "INSERT INTO ProductVariants SET ?";
const createProductCustomTabQuery="INSERT INTO ProductCustomTab SET ?";
const createProductSpecAttrQuery = "INSERT INTO ProductSpecificationAttributes SET ?";
const getProductCategories= "SELECT * FROM ProductCategories";
const getSubProductCategories = "SELECT * FROM SubProductCategories WHERE ProductCategories_product_cat_id=?";
const getProductSpecificAttrs = "SELECT * FROM CategorySpecificationAttributes WHERE SubProductCategories_sub_prod_cat_id =?";
const createProductSeries = "INSERT INTO ProductSeries SET ?";
const createProductSeriesRef = "INSERT INTO ProductSeriesRef SET ?";

// Seller get pending / approved product list
const getSellerProductListByApproval = "SELECT * FROM Product p, SubProductCategories s, ProductCategories pc WHERE p.admin_approved = ? AND p.Company_company_id IN (SELECT Company_company_id FROM GeneralPersonalUser WHERE gen_p_user_id = ?) AND p.deleted=0 AND p.SubProductCategories_sub_prod_cat_id=s.sub_prod_cat_id AND p.SubProductCategories_ProductCategories_product_cat_id=pc.product_cat_id ORDER BY p.last_updated DESC";
// Seller get all product list
const getSellerProductListAll = "SELECT * FROM Product p, SubProductCategories s, ProductCategories pc WHERE p.Company_company_id IN (SELECT Company_company_id FROM GeneralPersonalUser WHERE gen_p_user_id = ?) AND p.deleted=0 AND p.SubProductCategories_sub_prod_cat_id=s.sub_prod_cat_id AND p.SubProductCategories_ProductCategories_product_cat_id=pc.product_cat_id ORDER BY p.last_updated DESC";
// Seller get stock product list
const getSellerProductListByStock = "SELECT * FROM Product p, SubProductCategories s, ProductCategories pc WHERE p.out_of_stock = ? AND p.Company_company_id IN (SELECT Company_company_id FROM GeneralPersonalUser WHERE gen_p_user_id = ?) AND p.deleted=0 AND p.SubProductCategories_sub_prod_cat_id=s.sub_prod_cat_id AND p.SubProductCategories_ProductCategories_product_cat_id=pc.product_cat_id ORDER BY p.last_updated DESC";

const updateProduct = "UPDATE Product SET ? WHERE product_id=?";
const deleteProduct = "UPDATE Product SET ? WHERE product_id=?";
const saveProducts = "UPDATE Product SET ? WHERE product_id=?";
const updateAddProductUrl = "UPDATE Product SET product_url=? WHERE product_id =?";
const getAllProducts = "SELECT * FROM Product WHERE admin_approved = 1 AND deleted=0";
const getProductByUrl = "SELECT * FROM Product WHERE product_url=? AND deleted=0 AND admin_approved=1";
const getProductVariantByProductQuery = "SELECT * FROM ProductVariants WHERE Product_product_id=?";
const getProdCustTabsByProductQuery = "SELECT * FROM ProductCustomTab WHERE Product_product_id=?";
const getProdSpecAttrByProductQuery = "SELECT * FROM ProductSpecificationAttributes WHERE Product_product_id=?";
const getProductByCategoryQuery = "SELECT * FROM Product WHERE SubProductCategories_ProductCategories_product_cat_id =? AND deleted=0";
const getProductBySubCategoryQuery = "SELECT * FROM Product WHERE SubProductCategories_sub_prod_cat_id  =? AND deleted=0";
const getAllFeaturedProducts = "SELECT * FROM Product WHERE admin_approved = 1 AND featured_product = 1 AND deleted=0 AND  out_of_stock=0";
const getProductsBySubCategoriesBySeller = "SELECT * FROM Product WHERE SubProductCategories_ProductCategories_product_cat_id =? AND Company_company_id IN (SELECT Company_company_id FROM GeneralPersonalUser WHERE gen_p_user_id = ?)";
const getRelatedProducts = "SELECT product_id, SubProductCategories_sub_prod_cat_id, product_name, product_url, product_imgs, min_order_qty, product_unit FROM Product WHERE admin_approved = 1 AND  out_of_stock=0 AND deleted=0 AND SubProductCategories_sub_prod_cat_id = ? AND product_id NOT IN (?) LIMIT 5";
const getTopSellers = "SELECT p.* FROM Product p,ProductSeriesQuote psq WHERE p.admin_approved = 1 AND p.deleted = 0 AND p.product_id = psq.Product_product_id GROUP BY psq.Product_product_id ORDER BY COUNT(psq.quote_uuid) DESC LIMIT 10";
const getNewProducts = " SELECT * FROM Product WHERE admin_approved=1 AND deleted=0 ORDER BY product_id desc  LIMIT 10";
const getProductByUrlForSeller = "SELECT * FROM Product WHERE product_url=? AND deleted=0 AND Company_company_id=?";
const getProductByUrlForAdmin = "SELECT * FROM Product WHERE product_url=? AND deleted=0";
const updateProductDuty = "UPDATE Product SET duty=? WHERE product_id=?";
const getSellerCountry = "SELECT company_country FROM Company WHERE company_id=?";
const getDutySingle = "SELECT rate,safta_rate FROM duty_tbl WHERE duty_id=?";

const updatePsURL = "UPDATE Product SET product_series_url=?, is_series_product = 0 WHERE product_id=?";
const updatePsURLOnApproval = "UPDATE Product SET product_series_url=?, admin_approved = 1 WHERE product_id=?";
const updatePsRef = "UPDATE ProductSeriesRef SET series_url=? WHERE product_series_ref_id=?";

const getProductCatsByUrl = "SELECT pc.product_cat_id, pc.product_cat_name, psc.sub_prod_cat_id, psc.sub_prod_cat_name FROM ProductCategories pc, Product p, SubProductCategories psc WHERE p.product_url = ? AND p.SubProductCategories_ProductCategories_product_cat_id = pc.product_cat_id AND p.SubProductCategories_sub_prod_cat_id = psc.sub_prod_cat_id";

// Sample Requests
const saveSampleReq = "INSERT INTO SampleRequests SET ?";

const getProductSellerEmail = `SELECT p.product_id, p.product_created_by, p.Company_company_id, gpu.gen_p_email, gpu.gen_p_full_name
FROM Product p,
GeneralPersonalUser gpu
WHERE product_id = ?
AND p.product_created_by = gpu.gen_p_user_id`;

const getProductUrl = "SELECT product_url, product_name FROM Product WHERE product_id = ?";

const checkIfSeriesAlreadyHasProduct = 'SELECT * FROM ProductSeries WHERE product_id = ? AND product_series_ref_id = ? AND deleted = 0';

module.exports = {
    addProductQuery : createProductQuery,
    addProductVariantQuery : createProductVariantQuery,
    addProductCustomTabQuery : createProductCustomTabQuery,
    addProductSpecAttrQuery : createProductSpecAttrQuery,
    productCategoriesQuery : getProductCategories,
    subProductCategoriesQuery : getSubProductCategories,
    productSpecAttrs : getProductSpecificAttrs,
    addProductSeries : createProductSeries,
    checkIfSeriesAlreadyHasProductQuery: checkIfSeriesAlreadyHasProduct,
    addProductSeriesRef : createProductSeriesRef,

    // Seller filter pending / approved product list
    getSellerProductListByApprovalQuery : getSellerProductListByApproval,
    // Seller filter all product list
    getSellerProductListAllQuery : getSellerProductListAll,
    // Seller filter in-stock / out of stock product list
    getSellerProductListByStockQuery : getSellerProductListByStock,

    updateProductQurey : updateProduct,
    deleteProductQuery: deleteProduct,
    saveProductsQuery: saveProducts,
    updateProdUrl: updateAddProductUrl,
    getAllProds: getAllProducts,
    productByUrl : getProductByUrl,
    getProductVariantByProduct : getProductVariantByProductQuery,
    getProdCustTabsByProduct : getProdCustTabsByProductQuery,
    getProdSpecAttrByProduct : getProdSpecAttrByProductQuery,
    getProductByCategory : getProductByCategoryQuery,
    getProductBySubCategory : getProductBySubCategoryQuery,
    getAllFeaturedProductsQuery: getAllFeaturedProducts,
    getProductsBySubCategoriesBySellerQuery : getProductsBySubCategoriesBySeller,
    getRelatedProductsQuery: getRelatedProducts,
    getTopSellersQuery : getTopSellers,
    getNewProductsQuery : getNewProducts,
    getProductByUrlForSellerQuery : getProductByUrlForSeller,
    getProductByUrlForAdminQuery : getProductByUrlForAdmin,
    updateProductDutyQuery : updateProductDuty,
    getSellerCountryQuery : getSellerCountry,
    getDutySingleQuery : getDutySingle,

    updatePsURLQuery : updatePsURL,
    updatePsURLOnApprovalQuery: updatePsURLOnApproval,

    updatePsRefQuery : updatePsRef,
    getProductCatsByUrlQuery: getProductCatsByUrl,

    // Sample Requests
    saveSampleReqQuery: saveSampleReq,
    getProductSellerEmailQuery: getProductSellerEmail,
    getProductUrlQuery: getProductUrl
};

