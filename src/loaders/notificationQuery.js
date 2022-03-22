const { getUserByTokenQuery } = require("./userQuery");

const saveNotification = "INSERT INTO dtr_notification_tbl SET ?";
const getNotifications = "SELECT notification_id, notification_type, receiver_user_type, notification_content, notification_type_id, seen, created_time FROM dtr_notification_tbl WHERE to_user_id = ? AND receiver_user_type = ? ORDER BY created_time DESC";
const unSeenNotificationCount = "SELECT COUNT(notification_id) AS NotificationCount FROM dtr_notification_tbl WHERE to_user_id = ? AND receiver_user_type = ? AND seen = 0";
const checkIfUserHasNotification = "SELECT * FROM dtr_notification_tbl WHERE notification_id = ? AND to_user_id = ?";
const setNotificationSeen = "UPDATE dtr_notification_tbl SET seen = 1 WHERE to_user_id = ? AND notification_type_id = ?";
const getUserByUser = "SELECT gen_p_full_name, gen_p_email FROM GeneralPersonalUser WHERE gen_p_user_id = ?";
const getAdminUsers = "SELECT admin_fName, admin_email from AdminUser";
const checkIfUserHasNotificationByTypeId = "SELECT * FROM dtr_notification_tbl WHERE to_user_id = ? AND receiver_user_type = ? AND notification_type = ? AND notification_type_id = ?";
const clearNotification = "UPDATE dtr_notification_tbl SET seen = 1 WHERE to_user_id = ? AND receiver_user_type = ? AND notification_type = ? AND notification_type_id = ?";

module.exports = {
    saveNotificationQuery: saveNotification,
    getNotificationsQuery: getNotifications,
    unSeenNotificationCountQuery: unSeenNotificationCount,
    checkIfUserHasNotificationQuery: checkIfUserHasNotification,
    setNotificationSeenQuery: setNotificationSeen,
    getUserByUserIdQuery: getUserByUser,
    getAdminUsersQuery: getAdminUsers,
    checkIfUserHasNotificationByTypeIdQuery: checkIfUserHasNotificationByTypeId,
    clearNotificationQuery: clearNotification
};