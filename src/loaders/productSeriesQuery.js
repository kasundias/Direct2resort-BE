const getPsAll = "SELECT * FROM ProductSeriesRef WHERE admin_approval='Approved'";
const getPsByCategory = "SELECT * FROM ProductSeriesRef WHERE product_category_id=? AND admin_approval='Approved'";
const getProductSeriesSingle = "SELECT ps.*,p.* FROM ProductSeriesRef pr,ProductSeries ps,Product p WHERE pr.series_url=? AND pr.product_series_ref_id=ps.product_series_ref_id AND p.product_id=ps.product_id AND pr.admin_approval='Approved' AND ps.deleted = 0 AND p.admin_approved = 1 AND p.deleted = 0";
const getProductSeriesRefDetails = "SELECT * FROM ProductSeriesRef WHERE series_url=? AND admin_approval='Approved'";
const createParentQuote = "INSERT INTO ParentQuote SET ?";
const updateParentQuoteUuid = "UPDATE ParentQuote SET quote_uuid = ? WHERE parent_quote_id = ?";
const createQuotes = "INSERT INTO SeriesQuote SET ?";
const createQuoteInstance = "INSERT INTO SeriesQuoteInstance SET ?";
const createSeriesProductsList = "INSERT INTO ProductSeriesQuote SET ?";
const createMessage = "INSERT INTO Messages SET ?";
//const getAllMessagesForAdmin = "SELECT m.*,sqi.* FROM Messages m,SeriesQuoteInstance sqi WHERE sqi.SeriesQuote_series_quote_id=? AND sqi.series_instance_id =m.series_quote_instance_id";
const getAllMessagesForAdmin = "SELECT m.* FROM Messages m,SeriesQuoteInstance sqi WHERE sqi.SeriesQuote_series_quote_id=? AND sqi.series_instance_id =m.series_quote_instance_id";

const getMessagesForBuyer = "SELECT * FROM Messages WHERE user_category=1 OR (user_category!=1 AND approval='Approved')";
const getMessagesForSeller = "SELECT * FROM Messages WHERE user_category=2 OR (user_category!=2 AND approval='Approved')";
const updateMessageApprovalByAdmin = "UPDATE Messages SET approval = ?, approved_date = ?, admin_reject_msg = ? WHERE message_id = ?";
const approveWithEditAdmin = "UPDATE Messages SET approval = ?, approved_date = ?, message_body = ? WHERE message_id = ?";
const updateQuoteInstanceApprovalByAdmin = "UPDATE SeriesQuoteInstance SET quote_admin_status='Approved',quote_approved_date=? WHERE series_instance_id = ?";
const getProductListPerQuoteInstance = "SELECT * FROM ProductSeriesQuote WHERE SeriesQuote_series_quote_id=?";
const getProductQuoteInstancebyQuote = "SELECT sqi.*,sqp.*,psq.* FROM SeriesQuoteInstance sqi,SeriesQuoteInstancePrice sqp,ProductSeriesQuote psq WHERE sqi.SeriesQuote_series_quote_id=? AND sqi.series_instance_id=sqp.SeriesQuoteInstance_series_instance_id AND psq.SeriesQuote_series_quote_id=sqi.SeriesQuote_series_quote_id ";
const createPriceRecord = "INSERT INTO SeriesQuoteInstancePrice SET ?";
const getPsCatIdByRefId = "SELECT product_category_id FROM ProductSeriesRef WHERE series_url = ?";
const getProductCategory = "SELECT product_cat_id, product_cat_name, product_cat_img FROM ProductCategories WHERE product_cat_id = ? AND deleted = 0";
const getQuoteQuoteInstancesNotApproved = "SELECT q.*,c.company_name,gp.gen_p_full_name FROM SeriesQuote q,Company c,GeneralPersonalUser gp WHERE q.Product_Company_company_id=c.company_id AND gp.gen_p_user_id=q.buyer_id";

// Seller quotes with fiter 
const getQuoteQuoteInstancesSeller = "SELECT sq.* FROM SeriesQuote sq WHERE sq.Product_Company_company_id=? AND sq.quote_uuid IN (SELECT sqi.quote_uuid FROM SeriesQuoteInstance sqi WHERE sqi.quote_admin_status='Approved' OR sqi.quote_total IS NOT NULL) ORDER BY sq.created_date DESC";
const getQuoteQuoteInstancesSellerPending = "SELECT sq.* FROM SeriesQuote sq WHERE sq.final_client_aproval = 'Pending' AND sq.Product_Company_company_id=? AND sq.submited_to_freight=0 AND sq.quote_uuid IN (SELECT sqi.quote_uuid FROM SeriesQuoteInstance sqi WHERE sqi.quote_admin_status='Approved' OR sqi.quote_total IS NOT NULL) ORDER BY sq.created_date DESC";
const getQuoteQuoteInstancesSellerApproved = "SELECT sq.* FROM SeriesQuote sq WHERE sq.final_client_aproval = 'Aproved' AND sq.ready_to_ship = 0 AND sq.Product_Company_company_id=? AND sq.submited_to_freight=0 AND sq.quote_uuid IN (SELECT sqi.quote_uuid FROM SeriesQuoteInstance sqi WHERE sqi.quote_admin_status='Approved' OR sqi.quote_total IS NOT NULL) ORDER BY sq.created_date DESC";
const getQuoteQuoteInstancesSellerRejected = "SELECT sq.* FROM SeriesQuote sq WHERE sq.final_client_aproval = 'Rejected' AND sq.Product_Company_company_id=? AND sq.submited_to_freight=0 AND sq.quote_uuid IN (SELECT sqi.quote_uuid FROM SeriesQuoteInstance sqi WHERE sqi.quote_admin_status='Approved' OR sqi.quote_total IS NOT NULL) ORDER BY sq.created_date DESC";
const getQuoteQuoteInstancesSellerReadyToShip = "SELECT sq.* FROM SeriesQuote sq WHERE sq.ready_to_ship = 1 AND sq.Product_Company_company_id=? AND sq.submited_to_freight=0 AND sq.quote_uuid IN (SELECT sqi.quote_uuid FROM SeriesQuoteInstance sqi WHERE sqi.quote_admin_status='Approved' OR sqi.quote_total IS NOT NULL) ORDER BY sq.created_date DESC";
const getQuoteQuoteInstancesSellerSubmittedToLp = "SELECT sq.* FROM SeriesQuote sq WHERE sq.submited_to_freight = 1 AND sq.Product_Company_company_id=? AND sq.quote_uuid IN (SELECT sqi.quote_uuid FROM SeriesQuoteInstance sqi WHERE sqi.quote_admin_status='Approved' OR sqi.quote_total IS NOT NULL) ORDER BY sq.created_date DESC"; 

// Buyer quote list filter All
const getQuoteQuoteInstancesBuyer = "SELECT * FROM SeriesQuote WHERE buyer_id=? ORDER BY created_date DESC";
// Buyer quote list filter Pending / Approved / Rejected
const getQuoteQuoteInstancesBuyerPAR = "SELECT * FROM SeriesQuote WHERE buyer_id=? AND final_client_aproval = ? AND ready_to_ship = 0 AND submited_to_freight = 0 ORDER BY created_date DESC";
// Buyer quote list filter Ready to Ship
const getQuoteQuoteInstancesReadyToShip = "SELECT * FROM SeriesQuote WHERE buyer_id=? AND final_client_aproval = 'Aproved' AND ready_to_ship = 1 AND submited_to_freight = 0 ORDER BY created_date DESC";
// Buyer quote list filter Submitted to LP
const getQuoteQuoteInstancesSubmittedToLP = "SELECT * FROM SeriesQuote WHERE buyer_id=? AND final_client_aproval = 'Aproved' AND ready_to_ship = 1 AND submited_to_freight = 1 ORDER BY created_date DESC";

const getLastQuoteInstanceId = "SELECT quote_instance_id FROM QuoteInstance WHERE Quotes_quote_id=? ORDER BY quote_instance_id DESC LIMIT 1";
//for admin
const getSerQuoInst = "SELECT * FROM SeriesQuoteInstance WHERE quote_uuid = ?";
const getMessBySerQuoInst = "SELECT * FROM Messages WHERE series_quote_instance_id=?";
const getProductsBySerQuoInst = "SELECT psq.*,p.product_name,p.product_imgs,p.product_price FROM ProductSeriesQuote psq,Product p WHERE psq.quote_uuid=? AND p.product_id = psq.Product_product_id";
const getPricesByProductsBySerQuoInst = "SELECT * FROM SeriesQuoteInstancePrice WHERE SeriesQuoteInstance_series_instance_id=? AND product_id=?";

//for seller
const getSerQuoInstSeller = "SELECT * FROM SeriesQuoteInstance WHERE quote_uuid=?";
const getMessBySerQuoInstSeller = "SELECT * FROM Messages WHERE series_quote_instance_id=? AND (user_category=2 OR (user_category!=2 AND approval='Approved'))";
const removeProductFromSeries = "UPDATE ProductSeries SET deleted = 1 WHERE product_id = ? AND product_series_ref_id = ?;"
const updateProductSeriesUrl = "UPDATE Product SET product_series_url = NULL, is_series_product = 0 WHERE product_id = ?";
const updateSeriesRef = "UPDATE ProductSeriesRef SET ? WHERE product_series_ref_id = ? AND company_id = ?";
const deleteSeries = "UPDATE ProductSeriesRef SET deleted = 1 WHERE product_series_ref_id = ? AND company_id = ?";

//for buyer
const getSerQuoInstBuyer = "SELECT * FROM SeriesQuoteInstance WHERE quote_uuid=?";
const getMessBySerQuoInstBuyer = "SELECT * FROM Messages WHERE series_quote_instance_id=? AND (user_category=1 OR (user_category=2 AND approval='Approved'))";

//seller update first record
const updateSeriesQuoteInstance = "UPDATE SeriesQuoteInstance SET manufacture_leadtime = ?, dirrect_to_resort_fee=?,duty_fee=?,repacking_handling=?,quote_total=?,created_date=? WHERE series_instance_id=?";
const checkIfFirst = "SELECT quote_total FROM SeriesQuoteInstance WHERE series_instance_id=?";
//seller createQuotes
const sellerCreateQuoteInstance = "INSERT INTO SeriesQuoteInstance SET ?"
//buyer approve series quote
const buyerApproveQuoteInstanceFinal = "UPDATE SeriesQuoteInstance SET quote_approved=1 WHERE series_instance_id=? AND quote_uuid = ?";
const buyerApproveQuoteFinal = "UPDATE SeriesQuote SET final_client_aproval='Aproved',approved_quote_instance_id=? WHERE quote_uuid = ?";
//admin apprve series quote
const adminApproveQuoteInstanceFinal = "UPDATE SeriesQuoteInstance SET quote_admin_status='Approved' WHERE series_instance_id=?";
const adminApproveQuoteFinal = "UPDATE SeriesQuote SET final_admin_aproval='Aproved' WHERE series_quote_id=?";

const getSeriesQuotebyQuoteId="SELECT * FROM SeriesQuote WHERE quote_uuid=?";

const changeToReadyToShip="UPDATE SeriesQuote SET ready_to_ship=1 WHERE series_quote_id=? AND final_client_aproval='Aproved'";
const showReadyToShipPerSeller = "SELECT * FROM SeriesQuote WHERE ready_to_ship=1 AND Product_Company_company_id=? AND submited_to_freight=0"

//admin reject quoteInstance
const rejectQuoteInstance = "UPDATE SeriesQuoteInstance SET quote_admin_status= ?,admin_rejected_msg=? WHERE series_instance_id=?";
const rejectOnlyMessage = "UPDATE Messages SET approval='Rejected' WHERE message_id=?";
const checkIfBuyerRejected = "SELECT buyer_reject FROM SeriesQuoteInstance WHERE series_instance_id = ?";

//admin quote details
const getQuoteMainAdmin = "SELECT q.*,c.company_name AS seller_company_name, bc.company_name AS buyer_company_name FROM SeriesQuote q, Company c, Company bc, GeneralPersonalUser gp WHERE q.quote_uuid = ? AND q.Product_Company_company_id = c.company_id AND q.buyer_id = gp.gen_p_user_id AND gp.Company_company_id = bc.company_id";

const approvePsAdmin = "UPDATE ProductSeriesRef SET admin_approval='Approved' WHERE product_series_ref_id=?";
const rejectPsAdmin = "UPDATE ProductSeriesRef SET admin_approval='Rejected' WHERE product_series_ref_id=?";

// Filter product series
const getPsAdmin = "SELECT ps.*,pc.product_cat_name,c.company_name FROM ProductSeriesRef ps,ProductCategories pc,Company c WHERE ps.product_category_id=pc.product_cat_id AND c.company_id=ps.company_id AND ps.deleted = 0 ORDER BY updated_date DESC";
const getPsAdminAPR = "SELECT ps.*,pc.product_cat_name,c.company_name FROM ProductSeriesRef ps,ProductCategories pc,Company c WHERE ps.admin_approval = ? AND ps.product_category_id=pc.product_cat_id AND c.company_id=ps.company_id AND ps.deleted = 0 ORDER BY updated_date DESC";
const getPsAdminDeleted = "SELECT ps.*,pc.product_cat_name,c.company_name FROM ProductSeriesRef ps,ProductCategories pc,Company c WHERE ps.product_category_id=pc.product_cat_id AND c.company_id=ps.company_id AND ps.deleted = 1 ORDER BY updated_date DESC";

const getPsProducts="SELECT ps.*,p.product_name, p.product_imgs, p.product_item_code, p.product_url, p.admin_approved FROM ProductSeries ps,Product p WHERE ps.product_id=p.product_id AND ps.product_series_ref_id=? AND ps.deleted = 0";
const getSeriesUrl = "SELECT series_url, created_by FROM ProductSeriesRef WHERE product_series_ref_id = ?";
const getSeriesProduct = "SELECT * FROM ProductSeries WHERE product_series_ref_id = ?";

const updateManufacturingLeadTime="UPDATE SeriesQuote SET manufacture_leadtime=? WHERE series_quote_id=?";
const getMinLpVal= "SELECT MIN(bid_total_price) AS minval,sea_frieght_data_json,air_frieght_data_json FROM LogisticPatnerBid WHERE ParentQuote_parent_quote_id=?";

//Shop
const getPsByCategoryShop = "SELECT * FROM ProductSeriesRef WHERE product_category_id=? AND admin_approval='Approved' AND deleted = 0 ORDER BY created_date DESC LIMIT 8";
const getPsAllShop = "SELECT * FROM ProductSeriesRef WHERE admin_approval='Approved' AND deleted = 0 ORDER BY created_date DESC LIMIT 8";

const getFrieghtDataByQuote = "Select * FROM QuoteFreightData WHERE quote_uuid = ?";

const updateLastUpdatedDateSeriesQuote = "UPDATE SeriesQuote SET last_updated_date = ? WHERE quote_uuid = ?";

// Get all series quotes
const getAllSeriesQuotes = "SELECT sq.*, c.company_name AS seller_company_name, bc.company_name AS buyer_company_name FROM SeriesQuote sq, Company c, Company bc, GeneralPersonalUser gpu WHERE sq.Product_Company_company_id = c.company_id AND sq.buyer_id = gpu.gen_p_user_id AND gpu.Company_company_id = bc.company_id ORDER BY sq.last_updated_date DESC";
const getAllSeriesQuotesAP = "SELECT sq.*, c.company_name AS seller_company_name, bc.company_name AS buyer_company_name FROM SeriesQuote sq, Company c, Company bc, GeneralPersonalUser gpu WHERE sq.final_client_aproval = ? AND sq.Product_Company_company_id = c.company_id AND sq.buyer_id = gpu.gen_p_user_id AND gpu.Company_company_id = bc.company_id ORDER BY sq.last_updated_date DESC";
const getAllSeriesQuotesReadyToShip = "SELECT sq.*, c.company_name AS seller_company_name, bc.company_name AS buyer_company_name FROM SeriesQuote sq, Company c, Company bc, GeneralPersonalUser gpu WHERE sq.ready_to_ship = 1 AND sq.submited_to_freight = 0 AND sq.Product_Company_company_id = c.company_id AND sq.buyer_id = gpu.gen_p_user_id AND gpu.Company_company_id = bc.company_id ORDER BY sq.last_updated_date DESC";
const getAllSeriesQuotesSubmitedToLp = "SELECT sq.*, c.company_name AS seller_company_name, bc.company_name AS buyer_company_name FROM SeriesQuote sq, Company c, Company bc, GeneralPersonalUser gpu WHERE sq.ready_to_ship = 1 AND sq.submited_to_freight = 1 AND sq.Product_Company_company_id = c.company_id AND sq.buyer_id = gpu.gen_p_user_id AND gpu.Company_company_id = bc.company_id ORDER BY sq.last_updated_date DESC";

const getAdminEmailAdress = 'SELECT admin_email FROM AdminUser';
const checkIfQuotePending = 'SELECT quote_admin_status, quote_total, buyer_reject, quote_approved FROM SeriesQuoteInstance WHERE quote_uuid = ? ORDER BY created_date DESC LIMIT 2';
const getCompanyId = 'SELECT sqi.SeriesQuote_series_quote_id, sq.series_quote_id, sq.Product_Company_company_id FROM SeriesQuoteInstance sqi, SeriesQuote sq WHERE series_instance_id = ? AND sqi.SeriesQuote_series_quote_id = sq.series_quote_id';
const getBuyerId = 'SELECT sqi.quote_uuid, sq.quote_uuid, sq.buyer_id, sq.seller_id FROM SeriesQuoteInstance sqi, SeriesQuote sq WHERE series_instance_id = ? AND sqi.quote_uuid = sq.quote_uuid';

const getToUserId = "SELECT seller_id, buyer_id FROM SeriesQuote WHERE quote_uuid = ?";
const getMsgData = "SELECT * FROM Messages WHERE message_id = ?";

const checkIfBuyerHasQuote = "SELECT * FROM SeriesQuote WHERE buyer_id = ? AND quote_uuid = ?";
const checkifQuoteInstanceApproved =  "SELECT quote_admin_status FROM SeriesQuoteInstance WHERE quote_uuid = ?";
const updateQuoteInstace = "UPDATE SeriesQuoteInstance SET quote_admin_status = 'Approved' WHERE quote_uuid = ?";

module.exports = {
    getPsAllQuery: getPsAll,
    getPsByCategoryQuery: getPsByCategory,
    getProductSeriesSingleQuery: getProductSeriesSingle,
    getProductSeriesRefDetailsQuery: getProductSeriesRefDetails,
    addParentQuote: createParentQuote,
    updateParentQuoteUuidQuery: updateParentQuoteUuid,
    addQuotes: createQuotes,
    addQuoteInstance: createQuoteInstance,
    addSeriesProductsList: createSeriesProductsList,
    addMessage: createMessage,
    getPsCatIdByRefIdQuery: getPsCatIdByRefId,
    getProductCategoryQuery: getProductCategory,
    
    // Get all series quotes
    getQuoteQuoteInstancesNotApprovedQuery: getQuoteQuoteInstancesNotApproved,
    getAllSeriesQuotesQuery: getAllSeriesQuotes,
    getAllSeriesQuotesAPQuery: getAllSeriesQuotesAP,
    getAllSeriesQuotesReadyToShipQuery: getAllSeriesQuotesReadyToShip,
    getAllSeriesQuotesSubmitedToLpQuery: getAllSeriesQuotesSubmitedToLp,

    getAllMessagesForAdminQuery: getAllMessagesForAdmin,
    getProductQuoteInstancebyQuoteQuery: getProductQuoteInstancebyQuote,
//for admin
    getSerQuoInstQuery: getSerQuoInst,
    getMessBySerQuoInstQuery : getMessBySerQuoInst,
    getProductsBySerQuoInstQuery: getProductsBySerQuoInst,
    getPricesByProductsBySerQuoInstQuery: getPricesByProductsBySerQuoInst,
    //for seller
    getSerQuoInstSellerQuery : getSerQuoInstSeller,
    getMessBySerQuoInstSellerQuery : getMessBySerQuoInstSeller,

    //for buyer
    getSerQuoInstBuyerQuery : getSerQuoInstBuyer,
    getMessBySerQuoInstBuyerQuery : getMessBySerQuoInstBuyer,

    //adminapproval
    updateMessageApprovalByAdminQuery : updateMessageApprovalByAdmin,
    updateQuoteInstanceApprovalByAdminQuery : updateQuoteInstanceApprovalByAdmin,
    getMsgDataQuery: getMsgData,
    
    //SELLER SIDE
    updateSeriesQuoteInstanceQuery : updateSeriesQuoteInstance,
    checkIfFirstQuery : checkIfFirst,
    checkIfQuotePendingQuery : checkIfQuotePending,
    sellerCreateQuoteInstanceQuery : sellerCreateQuoteInstance,
    createPriceRecordQuery :createPriceRecord,
    removeProductFromSeriesQuery: removeProductFromSeries,
    updateProductSeriesUrlQuery: updateProductSeriesUrl,

    // Buyer quote list filter All
    getQuoteQuoteInstancesBuyerQuery : getQuoteQuoteInstancesBuyer,
    // Buyer quote list filter Pending / Approved / Rejected
    getQuoteQuoteInstancesBuyerPARQuery : getQuoteQuoteInstancesBuyerPAR,
    // Buyer quote list filter Ready to Ship
    getQuoteQuoteInstancesReadyToShipQuery : getQuoteQuoteInstancesReadyToShip,
    // Buyer quote list filter Submitted to LP
    getQuoteQuoteInstancesSubmittedToLPQuery : getQuoteQuoteInstancesSubmittedToLP,

    updateSeriesRefQuery: updateSeriesRef,
    deleteSeriesQuery: deleteSeries,
        // Seller filter All
        getQuoteQuoteInstancesSellerQuery : getQuoteQuoteInstancesSeller,
        // Seller filter Pending
        getQuoteQuoteInstancesSellerPendingQuery : getQuoteQuoteInstancesSellerPending,
        // Seller filter Approved
        getQuoteQuoteInstancesSellerApprovedQuery : getQuoteQuoteInstancesSellerApproved,
        // Seller filter Rejected
        getQuoteQuoteInstancesSellerRejectedQuery : getQuoteQuoteInstancesSellerRejected,
        // Seller filter Ready to ship
        getQuoteQuoteInstancesSellerReadyToShipQuery : getQuoteQuoteInstancesSellerReadyToShip,
        // Seller filter Submitted to LP
        getQuoteQuoteInstancesSellerSubmittedToLpQuery : getQuoteQuoteInstancesSellerSubmittedToLp,

    //final approval
    buyerApproveQuoteInstanceFinalQuery : buyerApproveQuoteInstanceFinal,
    buyerApproveQuoteFinalQuery : buyerApproveQuoteFinal,

    getSeriesQuotebyQuoteIdQuery : getSeriesQuotebyQuoteId,
    changeToReadyToShipQuery : changeToReadyToShip,
    showReadyToShipPerSellerQuery : showReadyToShipPerSeller,
    getFrieghtDataByQuoteQuery: getFrieghtDataByQuote,

    rejectQuoteInstanceQuery : rejectQuoteInstance,
    rejectOnlyMessageQuery : rejectOnlyMessage,
    checkIfBuyerRejectedQuery: checkIfBuyerRejected,

    getQuoteMainAdminQuery : getQuoteMainAdmin,

    approvePsAdminQuery : approvePsAdmin,
    rejectPsAdminQuery : rejectPsAdmin,
    
    // Product Series filter All
    getPsAdminQuery : getPsAdmin,
    // Product series Approved / Pending / Rejected
    getPsAdminAPRQuery : getPsAdminAPR,
    // Product series Deleted
    getPsAdminDeletedQuery : getPsAdminDeleted,
    
    
    getPsProductsQuery : getPsProducts,
    getSeriesUrlQuery: getSeriesUrl,
    getSeriesProductQuery: getSeriesProduct,

    updateManufacturingLeadTimeQuery : updateManufacturingLeadTime,

    getMinLpValQuery : getMinLpVal,

    //Shop
    getPsByCategoryShopQuery: getPsByCategoryShop,
    getPsAllShopQuery: getPsAllShop,

    // Update last updated date SeriesQuote
    updateLastUpdatedDateSeriesQuoteQuery: updateLastUpdatedDateSeriesQuote,

    getAdminEmailAdressQuery: getAdminEmailAdress,
    getCompanyIdQuery: getCompanyId,
    getBuyerIdQuery: getBuyerId,

    getToUserIdQuery: getToUserId,
    checkIfBuyerHasQuoteQuery: checkIfBuyerHasQuote,

    approveWithEditAdminQuery: approveWithEditAdmin,
    checkifQuoteInstanceApprovedQuery: checkifQuoteInstanceApproved,
    updateQuoteInstaceQuery: updateQuoteInstace
};

