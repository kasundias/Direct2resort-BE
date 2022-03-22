const getAllQuotesByBuyer= "SELECT * FROM Quotes WHERE buyer_id=? ORDER BY last_updated_date DESC";
const getAllQuotesByCompany= "SELECT q.* FROM Quotes q WHERE q.Product_Company_company_id=? AND q.ready_to_ship=0 AND q.quote_id IN (SELECT qi.Quotes_quote_id FROM QuoteInstance qi WHERE qi.quote_admin_status != 'To Seller') ORDER BY created_date DESC, last_updated_date DESC";
const getQuotesByBuyerId= "SELECT * FROM Quotes WHERE buyer_id=? AND quote_id=?";
const createParentQuote = "INSERT INTO ParentQuote SET ?";
const createQuotes = "INSERT INTO Quotes SET ?";
const createQuoteInstance = "INSERT INTO QuoteInstance SET ?";
const updateAdminAuthToSeller = "UPDATE QuoteInstance quote_admin_status=? WHERE quote_instance_id=?";
const updateQuoteInstanceBySeller = "UPDATE SeriesQuoteInstance seller_price=? seller_msg=? WHERE series_instance_id=?";
const updateQuoteInstanceByBuyer = "UPDATE SeriesQuoteInstance buyer_msg=? WHERE series_instance_id=?";
const getQuoteInstanceBuyer = "SELECT * FROM SeriesQuoteInstance WHERE SeriesQuote_series_quote_id=? AND quote_admin_status != 'Rejected'";
const getQuoteInstanceSeller = "SELECT * FROM SeriesQuoteInstance WHERE SeriesQuote_series_quote_id=?  AND quote_admin_status != 'Rejected'";
const updateLastUpdateddate = "UPDATE SeriesQuote SET last_updated_date=? WHERE series_quote_id=? ";
const getProductDetailsByQuote="SELECT * FROM SeriesQuote sq WHERE sq.series_quote_id=?";
const updateQuoteInstanceSeller="UPDATE SeriesQuoteInstance SET seller_price=?,seller_msg=?,seller_msg_time=?,seller_unit_price=?,quote_admin_status='To Buyer' WHERE series_instance_id=? AND (quote_admin_status='To Buyer' OR quote_admin_status='Approved To Seller')";
const getQuotesBySellerId= "SELECT * FROM SeriesQuote WHERE Product_Company_company_id=? AND series_quote_id=?";
const getLastQuoteInstanceId = "SELECT quote_instance_id FROM QuoteInstance WHERE Quotes_quote_id=? ORDER BY quote_instance_id DESC LIMIT 1";

const getLpMin="SELECT MIN(bid_total_price) FROM LogisticPatnerBid WHERE ParentQuote_parent_quote_id=?";
const getApprovedLpVal="SELECT bid_total_price FROM LogisticPatnerBid WHERE ParentQuote_parent_quote_id=? AND bid_status='Approved'";

const sellerCloseQuote = "UPDATE SeriesQuote SET seller_close_quote = 1 WHERE quote_uuid = ? AND seller_id = ?";
const buyerCloseQuote = "UPDATE SeriesQuote SET final_client_aproval = 'Close' WHERE quote_uuid = ? AND buyer_id = ?";
const getBuyerSeller = "SELECT buyer_id, seller_id FROM SeriesQuote WHERE quote_uuid = ?";

module.exports = {
    getAllQuotesByBuyerQuery : getAllQuotesByBuyer,
    getQuotesByIdQuery : getQuotesByBuyerId,
    addParentQuote : createParentQuote,
    addQuotes      : createQuotes,
    addQuoteInstance : createQuoteInstance,
    adminAuthToSeller : updateAdminAuthToSeller,
    sellerUpdateInstance :  updateQuoteInstanceBySeller,
    buyerUpdateInstance : updateQuoteInstanceByBuyer,
    updateLastUpDate: updateLastUpdateddate,
    getAllQuotesByCompanyQuery : getAllQuotesByCompany,
    getProductDetailsByQuoteQuery : getProductDetailsByQuote,
    updateQuoteInstanceSellerQuery : updateQuoteInstanceSeller,
    getQuotesBySellerIdQuery : getQuotesBySellerId,
    getLastQuoteInstanceIdQuery : getLastQuoteInstanceId,
    getQuoteInstanceBuyerQuery : getQuoteInstanceBuyer,
    getQuoteInstanceSellerQuery : getQuoteInstanceSeller,
    
    getLpMinQuery : getLpMin,
    getApprovedLpValQuery : getApprovedLpVal,

    sellerCloseQuoteQuery: sellerCloseQuote,
    buyerCloseQuoteQuery: buyerCloseQuote,
    getBuyerSellerQuery: getBuyerSeller
};
