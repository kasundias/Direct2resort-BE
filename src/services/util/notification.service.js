const GeneralQueryService = require('../../services/util/util.service');
const generalQuery = new GeneralQueryService();
const notificationQuery = require('../../loaders/notificationQuery');

class NotificationService {
    async createNotification(rUserType, sUserType, toUserId, nType, ntId, nContent) {
        const notificationData = {
            receiver_user_type: rUserType,
            sender_user_type: sUserType,
            to_user_id: toUserId,
            notification_type: nType,
            notification_type_id: ntId,
            notification_content: nContent,
            seen: 0,
            created_time: new Date()
        };
        
        const response = await generalQuery.asynqQuery(notificationQuery.saveNotificationQuery, notificationData);
        let userName, userEmail;

        if(toUserId != -1) {
            const userData = await generalQuery.asynqQuery(notificationQuery.getUserByUserIdQuery, [toUserId]);
            
            userName = userData[0].gen_p_full_name;
            userEmail = userData[0].gen_p_email;
        } else {
            const adminUserData = await generalQuery.asynqQueryNoParams(notificationQuery.getAdminUsersQuery);
            userName = 'Admin';
            userEmail = [];

            adminUserData.forEach(adminUser => {
                userEmail.push(adminUser.admin_email)
            });
        }
        
        const notificationEmailTpl = {
            subject: `Direct2SResort - You recived a new notification`,
            name: userName,
            notificationMsg: nContent,
            loginUrl: `http://direct2resort.com/#/login`
        };

        const sendBuyerEmail = await generalQuery.sendMail('admin@direct2resort.com', userEmail, 'notificationEmail', notificationEmailTpl);

        if(sendBuyerEmail) {
            return true;
        } else {
            return false;
        }

    }    
}

module.exports = NotificationService;