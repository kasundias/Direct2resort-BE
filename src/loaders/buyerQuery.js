const quoteInstanceBuyerReject = "UPDATE QuoteInstance SET client_reject = 1 WHERE Quotes_quote_id = ? AND quote_instance_id = ?";
const updateClientApproval = "UPDATE Quotes SET approved_quote_instance_id = ?, final_client_aproval = 'Approved', last_updated_date = ? WHERE quote_id = ?";
const quoteInstanceApproval = "UPDATE QuoteInstance SET quote_approved = 1, quote_approved_date = ? WHERE Quotes_quote_id = ? AND quote_instance_id = ?";

const checkIfUserHasQuote = "SELECT * FROM SeriesQuote WHERE quote_uuid = ? AND buyer_id = ?";
const sellerRejectQuoteWithMsg = "UPDATE SeriesQuoteInstance SET buyer_reject = 1, buyer_rejected_msg = ? WHERE series_instance_id = ? AND quote_uuid = ?";

const getQuoteQuoteInstancesSubmittedToLP = "SELECT quote_uuid FROM SeriesQuote WHERE buyer_id=? AND logistic_bid_admin_aproval = '1' ORDER BY created_date DESC";
const getAdminAprovedBid = "SELECT selectedBidId, quote_uuid, lpBidId, freightType, freightTotal, freightData, freightEta, status, created_date FROM AdminSelectedBid WHERE quote_uuid = ?";

const checkIfBuyerHas = "SELECT * FROM AdminSelectedBid WHERE buyerId = ? AND lpBidId = ?";
const updateLsrBuyer = "UPDATE AdminSelectedBid SET status = 'Approved' WHERE  quote_uuid = ? AND buyerId = ? AND lpBidId = ? AND selectedBidId = ?";
const rejectLsrAuto = "UPDATE AdminSelectedBid SET status = 'Rejected' WHERE quote_uuid = ? AND NOT selectedBidId = ?";
const updateLpBid = "UPDATE LogisticPatnerBid SET bid_status = 'Buyer Approved' WHERE logistic_partner_bid_id = ? AND quote_uuid = ?";
const rejectLpBid = "UPDATE LogisticPatnerBid SET bid_status = 'Rejected' WHERE quote_uuid = ? AND NOT logistic_partner_bid_id = ?"
const updateSeriesQuote = "UPDATE SeriesQuote SET buyer_apporved_frieght_method = ? WHERE quote_uuid = ? AND buyer_id = ?";

module.exports = {
    quoteInstanceBuyerRejectQuery: quoteInstanceBuyerReject,    
    updateClientApprovalQuery: updateClientApproval,
    quoteInstanceApprovalQuery: quoteInstanceApproval,

    checkIfUserHasQuoteQuery: checkIfUserHasQuote,
    sellerRejectQuoteWithMsgQuery: sellerRejectQuoteWithMsg,

    getQuoteQuoteInstancesSubmittedToLPQuery: getQuoteQuoteInstancesSubmittedToLP,
    getAdminAprovedBidsQuery: getAdminAprovedBid,
    checkIfBuyerHasQuery: checkIfBuyerHas,
    updateLsrBuyerQuery: updateLsrBuyer,
    updateLpBidQuery: updateLpBid,
    rejectLsrAutoQuery: rejectLsrAuto,
    rejectLpBidQuery: rejectLpBid,
    updateSeriesQuoteQuery: updateSeriesQuote
};
