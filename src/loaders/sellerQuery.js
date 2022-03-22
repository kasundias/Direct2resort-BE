const getAllCategories = "SELECT * FROM ProductCategories";
const getSubCatsByCatId = "SELECT * FROM SubProductCategories WHERE ProductCategories_product_cat_id = ?";
const getProductsBySubCat = "SELECT product_id, product_name, product_imgs, admin_approved, Company_company_id FROM Product WHERE SubProductCategories_sub_prod_cat_id = ? AND admin_approved = 1 AND Company_company_id = ? AND deleted=0";
const getProductsByCat = "SELECT product_id, product_name, product_imgs, admin_approved, Company_company_id FROM Product WHERE SubProductCategories_ProductCategories_product_cat_id = ? AND admin_approved = 1 AND Company_company_id = ? AND deleted=0";
const getProductsByCatPs = "SELECT product_id, product_name, product_imgs, admin_approved, Company_company_id FROM Product p WHERE p.SubProductCategories_ProductCategories_product_cat_id = ? AND p.Company_company_id = ? AND p.deleted = 0 AND NOT EXISTS (SELECT 1 FROM ProductSeries ps WHERE ps.product_id = p.product_id AND ps.deleted = 0)";
//"SELECT product_id, product_name, product_imgs, admin_approved, Company_company_id FROM Product WHERE SubProductCategories_ProductCategories_product_cat_id = ? AND admin_approved = 1 AND Company_company_id = ? AND deleted=0 AND product_series_url IS NULL";

const updateReadyToShipStatus = "UPDATE Quotes SET ready_to_ship=1 , ready_to_ship_date=? WHERE quote_id=? ";
const getQuoteIfReadyToShip = "SELECT * FROM Quotes WHERE Product_Company_company_id =? AND ready_to_ship =?";
const getSingleProduct = "SELECT * FROM Product WHERE Company_company_id = ? AND product_id = ? AND deleted=0";
const getProdSpecAttrByProduct = "SELECT * FROM ProductSpecificationAttributes WHERE Product_Company_company_id = ? AND Product_product_id=?";
const getProdVariants = "SELECT * FROM ProductVariants WHERE Product_Company_company_id = ? AND Product_product_id = ?";
const updateProduct = "UPDATE Product SET ? WHERE product_id = ? AND Company_company_id = ?";
const updateProductSpectAttr = "UPDATE ProductSpecificationAttributes SET attr_value = ? WHERE Product_product_id = ? AND product_spec_attr_id = ? AND Product_Company_company_id = ?";
const updateQuoteFrightForwardedDate="UPDATE SeriesQuote SET submited_to_freight_date=? WHERE quote_uuid=?";
const saveQuoteExtraDetails = "INSERT INTO QuoteFreightData SET ?";
const updateQuoteFrieghtStatus = "UPDATE SeriesQuote SET submited_to_freight=1 WHERE quote_uuid=?";
const updateProductVariants = "UPDATE ProductVariants SET ? WHERE product_variant_id = ? AND Product_product_id = ? AND Product_Company_company_id = ?";
const getQuotesSubmitedToLP = "SELECT * FROM SeriesQuote WHERE submited_to_freight = 1 AND Product_Company_company_id = ? ORDER BY submited_to_freight_date DESC";
const getQuoteFreightData = "SELECT q.submited_to_freight, q.series_quote_id, qfd.* FROM SeriesQuote q, QuoteFreightData qfd WHERE q.submited_to_freight = 1 AND q.series_quote_id = ? AND q.Product_Company_company_id = ? AND qfd.Quotes_quote_id = q.series_quote_id ORDER BY submited_to_freight_date DESC";
const updateMakeOutOfStock = "UPDATE Product SET out_of_stock=? WHERE product_id=? AND Company_company_id=? AND deleted=0";
const deleteProduct = "UPDATE Product SET deleted=1 WHERE product_id=? AND Company_company_id=?";
const getDuty="SELECT duty_id AS id,description AS name FROM duty_tbl";
const getProductSeriesList = "SELECT pr.*,pc.product_cat_name FROM ProductSeriesRef pr,ProductCategories pc WHERE pr.company_id=? AND pr.product_category_id=pc.product_cat_id AND pr.deleted = 0 ORDER BY pr.created_date DESC";
const getProductSeriesSingle = "SELECT ps.*,pc.product_cat_name,p.* FROM ProductSeriesRef pr,ProductSeries ps,ProductCategories pc,Product p WHERE pr.product_series_ref_id=? AND pr.product_series_ref_id=ps.product_series_ref_id AND pr.product_category_id=pc.product_cat_id AND p.product_id=ps.product_id AND ps.deleted = 0";
const getProductSeriesRefDetails="SELECT * FROM ProductSeriesRef WHERE product_series_ref_id=?";

const getProductCustomTabs = "SELECT * FROM ProductCustomTab WHERE Product_Company_company_id = ? AND Product_product_id = ?";
const sellerUpdateCustomTab = "UPDATE ProductCustomTab SET ? WHERE Product_Company_company_id = ? AND Product_product_id = ? AND product_cus_tab_id = ?";
const createProductCustomTab = "INSERT INTO ProductCustomTab SET ?";

const checkIfQuoteSubmitedToLp = "Select * FROM SeriesQuote WHERE quote_uuid = ? AND submited_to_freight = 1";

module.exports = {
    getAllCategoriesQuery : getAllCategories,
    getSubCatsByCatIdQuery: getSubCatsByCatId,
    getProductsBySubCatQuery: getProductsBySubCat,
    getProductsByCatQuery : getProductsByCat,
    getProductsByCatPsQuery : getProductsByCatPs,

    updateReadyToShipStatusQuery : updateReadyToShipStatus,
    getQuoteIfReadyToShipQuery : getQuoteIfReadyToShip,
    getSingleProductQuery: getSingleProduct,
    updateProductQuery: updateProduct,
    getProdSpecAttrByProductQuery: getProdSpecAttrByProduct,
    updateProductSpectAttrQuery: updateProductSpectAttr,
    getProdVariantsQuery: getProdVariants,
    saveQuoteExtraDetailsQuery : saveQuoteExtraDetails,
    updateQuoteFrieghtStatusQuery : updateQuoteFrieghtStatus,
    updateQuoteFrightForwardedDateQuery :updateQuoteFrightForwardedDate,
    updateProductVariantsQuery: updateProductVariants,
    getQuotesSubmitedToLPQuery: getQuotesSubmitedToLP,
    getQuoteFreightDataQuery: getQuoteFreightData,
    updateMakeOutOfStockQuery: updateMakeOutOfStock,
    deleteProductQuery : deleteProduct,
    getDutyQuery : getDuty,
    getProductSeriesListQuery : getProductSeriesList,
    getProductSeriesSingleQuery : getProductSeriesSingle,
    getProductSeriesRefDetailsQuery : getProductSeriesRefDetails,

    getProductCustomTabsQuery: getProductCustomTabs,
    sellerUpdateCustomTabQuery: sellerUpdateCustomTab,
    createProductCustomTabQuery: createProductCustomTab,

    checkIfQuoteSubmitedToLpQuery: checkIfQuoteSubmitedToLp
};
