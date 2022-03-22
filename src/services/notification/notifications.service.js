const jwt = require('jsonwebtoken');

const notificationQuery = require('../../loaders/notificationQuery');
const generalQueryService = require('../../services/util/util.service');
const generalQuery = new generalQueryService();

class Notifications {
    async getNotifications(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        let userType;
        let userId;

        if(decoded.userType === 1) {
            userType = 'BUYER';
            userId = decoded.id;
        } else if(decoded.userType === 2) {
            userType = 'SELLER';
            userId = decoded.id;
        } else if(decoded.userType === 'Admin') {
            userType = 'ADMIN';
            userId = -1;
        } else if(decoded.userType === 3) {
            userType = 'LP';
            userId = -1;
        }
        
        const response = await generalQuery.asynqQuery(notificationQuery.getNotificationsQuery, [userId, userType])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });
        
        const unSeenCount = await generalQuery.asynqQuery(notificationQuery.unSeenNotificationCountQuery, [userId, userType])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });

        return res.status(200).send({message:'Success', notificationList: response, unSeenCount: unSeenCount[0].NotificationCount});    
    }

    async notificationSeen(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        let userId;
        
        if(decoded.userType === 'Admin') {
            userId = -1;
        } else {
            userId = decoded.id;
        }

        const userHasNotification = await generalQuery.asynqQuery(notificationQuery.checkIfUserHasNotificationQuery, [req.body.notificationId, userId])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });
        
        if(userHasNotification.length) {
            if(userHasNotification[0].notification_id === req.body.notificationId) {                
                const notificationSeen = await generalQuery.asynqQuery(notificationQuery.setNotificationSeenQuery, [userId, userHasNotification[0].notification_type_id])
                .catch(error => {
                    return res.status(400).send({message: error.code, status: false}); 
                });
                return res.status(200).send({message:'Notification Updated', status: true}); 
            } else {
                return res.status(400).send({message:'No Notification found for this ID', status: false}); 
            }
        } else {
            return res.status(400).send({message:'No Notification found for this ID', status: false}); 
        }
    }

    async notificationsClear(req, res) {
        console.log(req.body);
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        let userId;
        let userType;

       
        if(decoded.userType === 'Admin') {
            userId = -1;
        } else {
            userId = decoded.id;
        }

        if(decoded.userType === 'Admin') {
            userType = "ADMIN";
        } else if(decoded.userType === 1) {
            userType = "BUYER";
        } else if(decoded.userType === 2) {
            userType = "SELLER";
        } else if(decoded.userType === 3) {
            userType = "LP";
        }

        console.log(userType);
        const userHasNotification = await generalQuery.asynqQuery(notificationQuery.checkIfUserHasNotificationByTypeIdQuery, [userId, userType, req.body.notification_type, req.body.typeId])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });

        console.log(userHasNotification);

        if(userHasNotification.length) {
            const notificationSeen = await generalQuery.asynqQuery(notificationQuery.clearNotificationQuery, [userId, userType, req.body.notification_type, req.body.typeId])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });
            return res.status(200).send({message:'Notification Updated', status: true}); 
        } else {
            return res.status(200).send({message:'No Notification found', status: false}); 
        }
    }
}

module.exports = Notifications;
