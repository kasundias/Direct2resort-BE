const getAllChatAdmin = "SELECT * FROM chat GROUP BY thread_id ORDER BY created_date ";
const getAllChatBuyer = "SELECT * FROM chat WHERE buyer_id=? GROUP BY thread_id ORDER BY created_date  ";
const getAllChatSeller = "SELECT * FROM chat WHERE seller_id=? GROUP BY thread_id ORDER BY created_date  ";
const getSingleChatAdmin = "SELECT * FROM chat WHERE thread_id=? ORDER BY created_date"
const getSingleChatNonAdmin = "SELECT * FROM chat WHERE thread_id=? AND (user_id=? OR admin_approval='Approved') ORDER BY created_date"

const createNewChat = "INSERT INTO chat SET ?";
const updateAdminApproval= "UPDATE chat SET admin_approval='Approved' WHERE chat_id=?";
const getThreadId= "SELECT thread_id FROM chat WHERE chat_id=?";

module.exports = {
    getAllChatAdminQuery: getAllChatAdmin,
    createNewChatQuery : createNewChat,
    getSingleChatQuery : getSingleChatAdmin,
    getAllChatBuyerQuery : getAllChatBuyer,
    getAllChatSellerQuery : getAllChatSeller,
    getSingleChatNonAdminQuery : getSingleChatNonAdmin,
    updateAdminApprovalQuery : updateAdminApproval,
    getThreadIdQuery : getThreadId
};
