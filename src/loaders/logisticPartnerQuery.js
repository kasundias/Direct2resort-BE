//const getQuoteFrightForLP = "SELECT qf.*,q.* FROM QuoteFreightData qf,Quotes q,LogisticPatnerBid lp WHERE qf.Quotes_quote_id=q.quote_id AND qf.bid_expired_in > NOW() AND q.logistic_bid_admin_aproval=0 AND lp.ParentQuote_parent_quote_id=q.ParentQuote_parent_quote_id";
const getQuoteFrightForLP = "SELECT qf.*,q.* FROM QuoteFreightData qf,SeriesQuote q WHERE qf.quote_uuid=q.quote_uuid AND qf.bid_expired_in > NOW() AND q.logistic_bid_admin_aproval=0 ORDER BY q.submited_to_freight_date DESC";
const getQuoteFrightLPSingle = "SELECT qf.*,q.* FROM QuoteFreightData qf,SeriesQuote q WHERE qf.quote_uuid=q.quote_uuid AND qf.quote_frieght_uuid =?";
const saveLogisticPartnerBid = "INSERT INTO LogisticPatnerBid SET ?";
const getMinBidByQuote = "SELECT MIN(lp.airFreightTotal) AS airMin, MIN(lp.seaFreightTotal) AS seaMin FROM LogisticPatnerBid lp,QuoteFreightData qf,SeriesQuote q WHERE qf.quote_uuid=q.quote_uuid AND lp.quote_uuid=q.quote_uuid AND qf.quote_frieght_uuid =?";
const getCountByQuote = "SELECT COUNT(lp.bid_total_price) AS coun FROM LogisticPatnerBid lp,QuoteFreightData qf,SeriesQuote q WHERE qf.quote_uuid=q.quote_uuid AND lp.quote_uuid=q.quote_uuid AND qf.quote_frieght_uuid =?";
const getBidsPerQuote="SELECT * FROM LogisticPatnerBid WHERE Company_company_id=? AND quote_uuid=?";
const checkLpIfBid = "Select * FROM LogisticPatnerBid WHERE quote_uuid = ? AND Company_company_id = ?";
const getBidHistory = "Select * FROM LogisticPatnerBid WHERE Company_company_id = ?";

module.exports = {
    getQuoteFrightForLPQuery : getQuoteFrightForLP,
    getQuoteFrightLPSingleQuery : getQuoteFrightLPSingle,
    saveLogisticPartnerBidQuery : saveLogisticPartnerBid,
    getMinBidByQuoteQuery :getMinBidByQuote,
    getCountByQuoteQuery : getCountByQuote,
    getBidsPerQuoteQuery : getBidsPerQuote,
    checkLpIfBidQuery: checkLpIfBid,
    getBidHistoryQuery: getBidHistory
};
