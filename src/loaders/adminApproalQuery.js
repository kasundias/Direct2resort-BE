const getGeneralPersonalUser ="SELECT gen_p_user_id,gen_p_full_name,Company_company_id,gen_p_is_admin, gen_p_email, gen_p_ivys_admin_aproval,UserCategory_user_category_id FROM GeneralPersonalUser WHERE ?";
const getCompany="SELECT * FROM Company WHERE ?";
const updateGenaralStatus = "UPDATE GeneralPersonalUser SET gen_p_ivys_admin_aproval = ? WHERE gen_p_user_id = ?";
const updateCompayStatus = "UPDATE Company SET company_ivys_admin_aproval = ? WHERE company_id = ?";
const deleteGenaralUser = "DELETE FROM GeneralPersonalUser WHERE ?";
const deleteCompany = "DELETE FROM Company WHERE ?";

// Product filter
const getAllProduct = "SELECT p.*, pc.product_cat_id, pc.product_cat_name, co.company_id, co.company_name, spc.sub_prod_cat_id, spc.sub_prod_cat_name FROM Product p, ProductCategories pc, SubProductCategories spc, Company co WHERE p.SubProductCategories_sub_prod_cat_id = spc.sub_prod_cat_id AND p.SubProductCategories_ProductCategories_product_cat_id = pc.product_cat_id AND p.Company_company_id = co.company_id ORDER BY last_updated DESC";
const getAllProductApprovedNotApproved = "SELECT p.*, pc.product_cat_id, pc.product_cat_name, co.company_id, co.company_name, spc.sub_prod_cat_id, spc.sub_prod_cat_name FROM Product p, ProductCategories pc, SubProductCategories spc, Company co WHERE p.admin_approved = ? AND p.SubProductCategories_sub_prod_cat_id = spc.sub_prod_cat_id AND p.SubProductCategories_ProductCategories_product_cat_id = pc.product_cat_id AND p.Company_company_id = co.company_id ORDER BY last_updated DESC";
const getAllProductDeleted = "SELECT p.*, pc.product_cat_id, pc.product_cat_name, co.company_id, co.company_name, spc.sub_prod_cat_id, spc.sub_prod_cat_name FROM Product p, ProductCategories pc, SubProductCategories spc, Company co WHERE p.deleted = 1 AND p.SubProductCategories_sub_prod_cat_id = spc.sub_prod_cat_id AND p.SubProductCategories_ProductCategories_product_cat_id = pc.product_cat_id AND p.Company_company_id = co.company_id ORDER BY last_updated DESC";
const getAllProductFeatured = "SELECT p.*, pc.product_cat_id, pc.product_cat_name, co.company_id, co.company_name, spc.sub_prod_cat_id, spc.sub_prod_cat_name FROM Product p, ProductCategories pc, SubProductCategories spc, Company co WHERE p.featured_product = 1 AND p.SubProductCategories_sub_prod_cat_id = spc.sub_prod_cat_id AND p.SubProductCategories_ProductCategories_product_cat_id = pc.product_cat_id AND p.Company_company_id = co.company_id ORDER BY last_updated DESC";

const updateQuoteAdmin = "UPDATE SeriesQuote SET ? WHERE quote_id=?";
const deleteQuotesAdmin = "UPDATE SeriesQuote SET ? WHERE ?";
const getAllQuotes = "SELECT q.*, gpu.gen_p_user_id, gpu.gen_p_full_name, co.company_id, co.company_name FROM SeriesQuote q, GeneralPersonalUser gpu, Company co WHERE q.buyer_id = gpu.gen_p_user_id AND q.Product_Company_company_id = co.company_id";

//All sellers filters
const getAllGenUsers = "SELECT gpu.Company_company_id, gpu.UserCategory_user_category_id, gpu.created_date, gpu.gen_p_email, gpu.gen_p_is_admin, gpu.gen_p_full_name, gpu.gen_p_ivys_admin_aproval, gpu.gen_p_user_id, gpu.verified, c.company_name FROM GeneralPersonalUser gpu, Company c WHERE UserCategory_user_category_id = ? AND gpu.Company_company_id = c.company_id ORDER BY created_date DESC";
const getAllGenUsersAID = "SELECT gpu.Company_company_id, gpu.UserCategory_user_category_id, gpu.created_date, gpu.gen_p_email, gpu.gen_p_is_admin, gpu.gen_p_full_name, gpu.gen_p_ivys_admin_aproval, gpu.gen_p_user_id, gpu.verified, c.company_name FROM GeneralPersonalUser gpu, Company c WHERE UserCategory_user_category_id = ? AND gen_p_ivys_admin_aproval = ? AND gpu.Company_company_id = c.company_id ORDER BY created_date DESC";
const getAllGenUsersEmailVerify = "SELECT gpu.Company_company_id, gpu.UserCategory_user_category_id, gpu.created_date, gpu.gen_p_email, gpu.gen_p_is_admin, gpu.gen_p_full_name, gpu.gen_p_ivys_admin_aproval, gpu.gen_p_user_id, gpu.verified, c.company_name FROM GeneralPersonalUser gpu, Company c WHERE UserCategory_user_category_id = ? AND verified = ? AND gpu.Company_company_id = c.company_id ORDER BY created_date DESC";

const statusUpdateUser = "UPDATE GeneralPersonalUser SET gen_p_ivys_admin_aproval? WHERE quote_id=?";
const adminUser = "INSERT INTO AdminUser SET ?";
const getAllAdminUsers = "SELECT admin_user_id, admin_fName, admin_lName, admin_email, admin_contact_number  FROM AdminUser";
const adminAproveProduct = "UPDATE Product SET admin_approved = ?, featured_product = 0 WHERE product_id = ?";
const adminGetQuoteInstance = "SELECT * FROM SeriesQuoteInstance WHERE Quotes_quote_id = ?";
const adminGetQuoteById = "SELECT q.*, gpu.gen_p_user_id, gpu.gen_p_full_name, co.company_id, co.company_name FROM SeriesQuote q, GeneralPersonalUser gpu, Company co WHERE q.series_quote_id = ? AND q.buyer_id = gpu.gen_p_user_id AND q.Product_Company_company_id = co.company_id";
const addCategory = "INSERT INTO ProductCategories SET ?";
const getAllCategories = "SELECT * FROM ProductCategories WHERE deleted = 0";
const addSubCategory = "INSERT INTO SubProductCategories SET ?";
const getAllSubCategories = "SELECT * FROM SubProductCategories";
const addCatSpecAttr = "INSERT INTO CategorySpecificationAttributes SET ?";
const getAllCatAttrs = "SELECT * FROM CategorySpecificationAttributes";

// Get all series quotes
const getAllSeriesQuotes = "SELECT q.*,c.company_name,gp.gen_p_full_name FROM SeriesQuote q,SeriesQuoteInstance qi,Company c,GeneralPersonalUser gp WHERE qi.Quotes_quote_id=q.series_quote_id AND q.Product_Company_company_id=c.company_id AND gp.gen_p_user_id=q.buyer_id";

const adminApproveQuoteInstance = "UPDATE SeriesQuoteInstance SET quote_admin_status='Approved',dirrect_to_resort_fee=?,repacking_handling=?,duty_fee=?,owner_margin=?  WHERE quote_instance_id=?";
const adminApproveBuyerQuoteInstance = "UPDATE SeriesQuoteInstance SET quote_admin_status='Approved To Seller' WHERE quote_instance_id=?";
const getFees = "SELECT markup_percentage FROM MarkupValues";
const getSellerFee = "SELECT seller_price FROM SeriesQuoteInstance WHERE quote_instance_id=?";
const getQuoteQuoteInstancesApproved = "SELECT q.*,c.company_name,gp.gen_p_full_name FROM SeriesQuote q,SeriesQuoteInstance qi,Company c,GeneralPersonalUser gp WHERE q.final_client_aproval = 'Approved' AND qi.Quotes_quote_id=q.series_quote_id AND qi.quote_admin_status = 'Approved' AND q.Product_Company_company_id=c.company_id AND gp.gen_p_user_id=q.buyer_id";
const toggleFeatuedProduct = "UPDATE Product SET featured_product = ? WHERE product_id = ?";
const lpbidlist = "SELECT q.quote_uuid, q.submited_to_freight_date, q.logistic_bid_admin_aproval, q.buyer_apporved_frieght_method, qf.bid_expired_in, qf.quote_frieght_uuid, c.company_name AS sellername,gpu.gen_p_full_name AS buyername FROM QuoteFreightData qf,SeriesQuote q,Company c,GeneralPersonalUser gpu WHERE q.quote_uuid=qf.quote_uuid AND c.company_id=q.Product_Company_company_id AND q.buyer_id=gpu.gen_p_user_id ORDER BY q.submited_to_freight_date DESC";
//const lpbidlist = "SELECT q.*,lp.*,c.company_name AS sellername,gpu.gen_p_full_name AS buyername FROM Quotes q,LogisticPatnerBid lp,Company c,GeneralPersonalUser gpu  WHERE q.logistic_bid_admin_aproval=0  AND q.ParentQuote_parent_quote_id=lp.ParentQuote_parent_quote_id AND c.company_id=q.Product_Company_company_id AND q.buyer_id=gpu.gen_p_user_id";
const lpbidviewAirF = "SELECT q.*,qf.*,lp.*,c.company_name AS lpname,gpu.gen_p_full_name AS buyername FROM QuoteFreightData qf,SeriesQuote q,LogisticPatnerBid lp,Company c,GeneralPersonalUser gpu WHERE q.quote_uuid=? AND q.quote_uuid = qf.quote_uuid AND q.quote_uuid=lp.quote_uuid AND c.company_id=lp.Company_company_id AND q.buyer_id=gpu.gen_p_user_id ORDER BY lp.airFreightTotal";
const lpbidviewSeaF = "SELECT q.*,qf.*,lp.*,c.company_name AS lpname,gpu.gen_p_full_name AS buyername FROM QuoteFreightData qf,SeriesQuote q,LogisticPatnerBid lp,Company c,GeneralPersonalUser gpu WHERE q.quote_uuid=? AND q.quote_uuid = qf.quote_uuid AND q.quote_uuid=lp.quote_uuid AND c.company_id=lp.Company_company_id AND q.buyer_id=gpu.gen_p_user_id ORDER BY lp.seaFreightTotal";
const lpbidviewtop = "SELECT q.*,qf.*,c.company_name AS sellername,gpu.gen_p_full_name AS buyername FROM QuoteFreightData qf,SeriesQuote q,Company c,GeneralPersonalUser gpu WHERE q.quote_uuid=? AND q.quote_uuid=qf.quote_uuid AND c.company_id=q.Product_Company_company_id AND q.buyer_id=gpu.gen_p_user_id ";

//const lpbidview="SELECT q.*,lp.* FROM Quotes q,LogisticPatnerBid lp WHERE q.quote_id=?  AND q.ParentQuote_parent_quote_id=lp.ParentQuote_parent_quote_id ORDER BY lp.bid_total_price";
const getlpDetailedView = "SELECT q.*,qf.*,lp.*, c.company_name AS lpName FROM QuoteFreightData qf,SeriesQuote q,LogisticPatnerBid lp, Company c WHERE lp.logistic_partner_bid_id=? AND q.quote_uuid=qf.quote_uuid AND q.quote_uuid=lp.quote_uuid AND c.company_id=lp.Company_company_id";
const approveLpBidlpTable = "UPDATE LogisticPatnerBid SET bid_status='Approved' WHERE logistic_partner_bid_id=?";
const approvelpBidQuotesTable = "UPDATE SeriesQuote SET logistic_bid_admin_aproval=1 WHERE quote_uuid=?";
const rejectAllBidslpTable = "UPDATE LogisticPatnerBid SET bid_status='Rejected' WHERE logistic_partner_bid_id NOT IN (?) AND quote_uuid=?";
//const getMinBidByQuote = "SELECT MIN(lp.bid_total_price) AS minval FROM LogisticPatnerBid lp,QuoteFreightData qf,Quotes q WHERE qf.Quotes_quote_id=q.quote_id AND lp.ParentQuote_parent_quote_id=q.ParentQuote_parent_quote_id AND qf.quote_freight_data_id =?";
const getCompanyDetailsByUser = "SELECT c.* FROM Company c,GeneralPersonalUser g WHERE c.company_id=g.Company_company_id AND g.gen_p_user_id=?";
const getDutyVal = "SELECT duty, country FROM Product WHERE product_id=?";
const getCompanyByUser = "SELECT * FROM Company WHERE company_id = ?";
const updateCategory = "UPDATE ProductCategories SET ? WHERE product_cat_id = ?";
const deleteCategory = "UPDATE ProductCategories SET deleted = 1 WHERE product_cat_id = ?";;

// Sample request
const getSampleRequestsAll = `SELECT sr.*, p.product_name, p.product_price, p.product_sample_price, p.Company_company_id AS product_company, p.product_imgs,
c.company_name AS seller_company, gpu.gen_p_full_name AS buyer_name
FROM SampleRequests sr, Product p, Company c, GeneralPersonalUser gpu
WHERE sr.product_id = p.product_id
AND p.Company_company_id = c.company_id
AND sr.buyer_email = gpu.gen_p_email
ORDER BY requested_date DESC`;
const getSampleRequestsStatus = `SELECT sr.*, p.product_name, p.product_price, p.product_sample_price, p.Company_company_id AS product_company, p.product_imgs,
c.company_name AS seller_company, gpu.gen_p_full_name AS buyer_name
FROM SampleRequests sr, Product p, Company c, GeneralPersonalUser gpu
WHERE sr.product_id = p.product_id
AND sr.sample_status = ?
AND p.Company_company_id = c.company_id
AND sr.buyer_email = gpu.gen_p_email
ORDER BY requested_date DESC`;
const smapleReqMarkAsShipped = "UPDATE SampleRequests SET sample_status = 'Shipped', shipped_date = ? WHERE sample_req_id = ?";
const getSampleBuyerEmail = `SELECT sr.product_id, sr.buyer_email, p.product_name, p.product_url
FROM SampleRequests sr,
Product p 
WHERE sample_req_id = ?
AND sr.product_id = p.product_id;`

const getDutyRate = "SELECT rate, safta_rate FROM duty_tbl WHERE duty_id = ?";


const getCountByQuote = "SELECT COUNT(lp.bid_total_price) AS count FROM LogisticPatnerBid lp,QuoteFreightData qf,SeriesQuote q WHERE qf.quote_uuid=q.quote_uuid AND lp.quote_uuid=q.quote_uuid AND qf.quote_frieght_uuid =?";

const checkQuoteShippingMethod = "SELECT frieght_method FROM SeriesQuote WHERE quote_uuid = ?";

const submitBid = "INSERT INTO AdminSelectedBid SET ?";

const updateLpBid = "UPDATE LogisticPatnerBid SET approved_bid_type = ?, bid_status = 'In Review' WHERE logistic_partner_bid_id = ?";

const updateSeriesQuote = "UPDATE SeriesQuote SET logistic_bid_admin_aproval = 1 WHERE quote_uuid = ?";  

const checkIfAdminSubmitedBidForBuyer = "SELECT logistic_bid_admin_aproval FROM SeriesQuote WHERE quote_uuid = ?";

const getSubmittedBids = "SELECT * FROM AdminSelectedBid WHERE quote_uuid = ?";

module.exports = {
    getGeneralPersonalUser : getGeneralPersonalUser,
    getCompany : getCompany,
    updateGenaralStatus : updateGenaralStatus,
    updateCompayStatus : updateCompayStatus,
    deleteGenaralUser: deleteGenaralUser,
    deleteCompany:deleteCompany,
    
    // Product filter get all
    getAllProductQuery: getAllProduct,
    // Product filter Admin approved / not approved
    getAllProductApprovedNotApprovedQuery: getAllProductApprovedNotApproved,
    // Product filter deleted
    getAllProductDeletedQuery: getAllProductDeleted,
    // Product filter Featured
    getAllProductFeaturedQuery: getAllProductFeatured,

    updateQuoteAdminQuery: updateQuoteAdmin,
    deleteQuotesAdminQuery: deleteQuotesAdmin,
    getAllQuotesQuey: getAllQuotes,

    //Get users filter All
    getAllGenUsersQuery: getAllGenUsers,
    //Get users filter Active/Inactive/Deleted
    getAllGenUsersAIDQuery: getAllGenUsersAID,
    //Get users filter Email Verified/Unverified
    getAllGenUsersEmailVerifyQuery: getAllGenUsersEmailVerify,

    statusUpdateUserQuery: statusUpdateUser,
    adminUserInsertQuery: adminUser,
    getAllAdminUsersQuery: getAllAdminUsers,
    adminAproveProductQuery: adminAproveProduct,
    adminGetQuoteInstanceQuery: adminGetQuoteInstance,
    adminGetQuoteByIdQuery: adminGetQuoteById,

    // Get quotes filter All
    getAllSeriesQuotesQuery : getAllSeriesQuotes,
    
    addCategoryQuery: addCategory,
    updateCategoryQuery: updateCategory,
    deleteCategoryQuery: deleteCategory,
    getAllCategoriesQuery: getAllCategories,

    addSubCategoryQuery: addSubCategory,
    getAllSubCategoriesQuery: getAllSubCategories,
    addCatSpecAttrQuery: addCatSpecAttr,
    getAllCatAttrsQuery: getAllCatAttrs,
    adminApproveQuoteInstanceQuery : adminApproveQuoteInstance,
    getFeesQuery : getFees,
    getSellerFeeQuery : getSellerFee,
    adminApproveBuyerQuoteInstanceQuery : adminApproveBuyerQuoteInstance,
    getQuoteQuoteInstancesApprovedQuery: getQuoteQuoteInstancesApproved,
    toggleFeatuedProductQuery: toggleFeatuedProduct,
    lpbidlistQuery : lpbidlist,
    lpbidviewAirFQuery : lpbidviewAirF,
    lpbidviewSeaFQuery: lpbidviewSeaF,
    getlpDetailedViewQuery : getlpDetailedView,
    approveLpBidlpTableQuery : approveLpBidlpTable,
    approvelpBidQuotesTableQuery : approvelpBidQuotesTable,
    rejectAllBidslpTableQuery : rejectAllBidslpTable,
   // getMinBidByQuoteQuery : getMinBidByQuote
   getCompanyDetailsByUserQuery : getCompanyDetailsByUser,
   getDutyValQuery : getDutyVal,

   getDutyRateQuery : getDutyRate,

   getCompanyByUserQuery: getCompanyByUser,

   lpbidviewtopQuery : lpbidviewtop,

   // Sample request
   getSampleRequestsAllQuery: getSampleRequestsAll,
   getSampleRequestsStatusQuery: getSampleRequestsStatus,
   smapleReqMarkAsShippedQuery: smapleReqMarkAsShipped,
   getSampleBuyerEmailQuery: getSampleBuyerEmail,

   getCountByQuoteQuery: getCountByQuote,

   checkQuoteShippingMethodQuery: checkQuoteShippingMethod,
   
   submitBidQuery: submitBid,
   updateLpBidQuery: updateLpBid,
   updateSeriesQuoteQuery: updateSeriesQuote,
   checkIfAdminSubmitedBidForBuyerQuery: checkIfAdminSubmitedBidForBuyer,
   getSubmittedBidsQuery: getSubmittedBids

};
