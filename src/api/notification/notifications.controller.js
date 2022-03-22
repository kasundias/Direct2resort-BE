const express = require('express');
const router = express.Router();

const verify = require('../../services/jwtVerify.service');

const notifications = require('../../services/notification/notifications.service');
const notificationsService = new notifications();

router.get('/getNotifications', verify, async function (req, res) {
    notificationsService.getNotifications(req, res);
});
router.post('/notificationSeen', verify, async function (req, res) {
    notificationsService.notificationSeen(req, res);
});
router.post('/notificationsClear', verify, async function (req, res) {
    notificationsService.notificationsClear(req, res);
});
module.exports = router;
