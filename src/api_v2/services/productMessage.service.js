const db = require('../models');
const jwt = require('jsonwebtoken');

const NotificationService = require('../../services/util/notification.service');
const notificationSe = new NotificationService();

class ProductMessage {
    async dropTable(req, res) {          
        await db.ProductMsgInstance.drop();
        await db.ProductMsg.drop(); 
        console.log("table dropped!"); 
    }  

    async buyerSendProductMsg(req, res) {  
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        if(decoded.userType === 1) {
            db.sequelize.query(`SELECT product_created_by FROM Product WHERE product_id = ${req.body.productId}`, { type: db.Sequelize.QueryTypes.SELECT }).then(seller => {
                if(seller[0].product_created_by) {
                    db.ProductMsg.create({
                        sellerId: seller[0].product_created_by,
                        buyerId: decoded.id,
                        ProductProductId: req.body.productId
                    }).then(buyerMsg => {
                        db.ProductMsgInstance.create({
                            messageContent: req.body.msgContent,
                            msgFrom: 'BUYER',
                            msgTo: 'SELLER',
                            ProductMsgUuid: buyerMsg.uuid
                        }).then(msgInstance => {
                            const notificationMsg = `New message from a buyer`;
                            notificationSe.createNotification('ADMIN', 'BUYER', '-1', 'MESSAGE', buyerMsg.uuid, notificationMsg).then(notification => {
                                res.send(msgInstance)
                            });                            
                        });
                    });
                } else {
                    res.status(400).send({status: false, statusMsg: 'No seller found for this product'});
                }                
            });
        } else {
            res.status(400).send({status: false, statusMsg: 'Only Buyers Can Send Messages'});
        }        
    }

     async getProductMsgs(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        if(decoded.userType === 1) {
            // If Buyer            
            db.ProductMsg.findAll({
                where: { buyerId: decoded.id },
                order: [
                    ['updatedAt', 'DESC']
                ],
                include: [db.Product]
            }).then(productMsg => res.send(productMsg));
        } else if(decoded.userType === 2) {
            // If Seler            
            db.ProductMsg.findAll({
                where: { 
                    sellerId: decoded.id,
                    adminStatus: "APPROVED"
                },
                order: [
                    ['updatedAt', 'DESC']
                ],
                include: [db.Product]
            }).then(productMsg => res.send(productMsg));
        } else {
            res.status(401).send('Auth Failed');
        } 
    }

    async getProductMsgInstances(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const uuid = req.params.uuid;

        if(decoded.userType === 1) {
            // If Buyer            
            db.ProductMsgInstance.findAll({
                where: { 
                    ProductMsgUuid: uuid
                },
                order: [
                    ['updatedAt', 'ASC']
                ]
            }).then(productMsgInstance => {
                let finalMsgList = [];
                productMsgInstance.forEach(msg => {
                    if(msg.msgFrom === 'BUYER') {
                        finalMsgList.push(msg);
                    } else if(msg.msgFrom === 'SELLER') {
                        if(msg.adminStatus === 'APPROVED') {
                            finalMsgList.push(msg);
                        }                        
                    }
                });
                res.send(finalMsgList);
            });
        } else if(decoded.userType === 2) {
            // If Buyer            
            db.ProductMsgInstance.findAll({
                where: { 
                    ProductMsgUuid: uuid
                },
                order: [
                    ['updatedAt', 'ASC']
                ]
            }).then(productMsgInstance => {
                let finalMsgList = [];
                productMsgInstance.forEach(msg => {
                    if(msg.msgFrom === 'SELLER') {
                        finalMsgList.push(msg);
                    } else if(msg.msgFrom === 'BUYER') {
                        if(msg.adminStatus === 'APPROVED') {
                            finalMsgList.push(msg);
                        }                        
                    }
                });                
                res.send(finalMsgList);
            });
        }
    }

    async sendMsg(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const uuid = req.body.productMsgId;

        if(decoded.userType === 1) {
            db.sequelize.query(`SELECT uuid, buyerId FROM ProductMsgs WHERE UUID = '${uuid}'`, { type: db.Sequelize.QueryTypes.SELECT }).then(buyer => {
                if(buyer[0].buyerId) {
                    db.ProductMsgInstance.create({
                        messageContent: req.body.quoteMessage,
                        msgFrom: 'BUYER',
                        msgTo: 'SELLER',
                        ProductMsgUuid: buyer[0].uuid
                    }).then(msgInstance => {
                        db.ProductMsg.update(
                            { 
                                readByAdmin: false 
                            },
                            { 
                                where: {
                                    uuid: uuid
                                }
                            }
                        ).then(updateRead => {
                            const notificationMsg = `New message from a buyer`;
                            notificationSe.createNotification('ADMIN', 'BUYER', '-1', 'MESSAGE', uuid, notificationMsg).then(notification => {
                                res.send(msgInstance);
                            });
                        });                        
                    });
                }           
            });
        } else if(decoded.userType === 2){
            db.sequelize.query(`SELECT uuid, sellerId FROM ProductMsgs WHERE UUID = '${uuid}'`, { type: db.Sequelize.QueryTypes.SELECT }).then(seller => {
                if(seller[0].sellerId) {
                    db.ProductMsgInstance.create({
                        messageContent: req.body.quoteMessage,
                        msgFrom: 'SELLER',
                        msgTo: 'BUYER',
                        ProductMsgUuid: seller[0].uuid
                    }).then(msgInstance => {
                        db.ProductMsg.update(
                            { 
                                readByAdmin: false 
                            },
                            { 
                                where: {
                                    uuid: uuid
                                }
                            }
                        ).then(updateRead => {
                            const notificationMsg = `New message from a seller`;
                            notificationSe.createNotification('ADMIN', 'SELLER', '-1', 'MESSAGE', uuid, notificationMsg).then(notification => {
                                res.send(msgInstance);
                            });
                        });                        
                    });
                }           
            });
        }        
    }

    async adminGetProductMsgs(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        console.log(decoded);
        if(decoded.userType === 'Admin') {                    
            db.ProductMsg.findAll({
                order: [
                    ['updatedAt', 'DESC']
                ],
                include: [db.Product]
            }).then(productMsg => res.send(productMsg));
        }     
    }

    async adminGetMsgInstance(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const uuid = req.params.uuid;

        if(decoded.userType === 'Admin') {      
            db.ProductMsgInstance.findAll({
                where: { 
                    ProductMsgUuid: uuid
                },
                order: [
                    ['updatedAt', 'ASC']
                ]
            }).then(productMsgInstance =>  res.send(productMsgInstance));
        }
    }

    async adminApproveProdcutMsg(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const msgUuid = req.body.msgUuid;
        const msgInstanceUuid = req.body.msgInstanceUuid;
        const msgFrom = req.body.msgFrom;
        let setUnreadMsg = {};
        let editedMsg = "";
        let adminApprovalMsg = {};
        
        if(req.body.editMsg) {
            editedMsg = req.body.editMsg;
        }
        
        if(req.body.approvalType === 'Edited') {
            adminApprovalMsg = { messageContent:  editedMsg, adminStatus: 'APPROVED' };
        } else {
            adminApprovalMsg = { adminStatus: 'APPROVED' };
        }        
        
        if(msgFrom === 'BUYER') {
            setUnreadMsg = {adminStatus: 'APPROVED', readBySeller: false};
        } else {
            setUnreadMsg = {adminStatus: 'APPROVED', readByBuyer: false}
        }        

        if(decoded.userType === 'Admin') {
            
            db.ProductMsgInstance.count({
                where: {
                    ProductMsgUuid: {
                        [db.Sequelize.Op.eq]: msgUuid
                    },
                    adminStatus: {
                        [db.Sequelize.Op.eq]: 'PENDING'
                    }
                }
            }).then(miCount => {
                if(miCount === 1) {
                    db.ProductMsg.update(
                        setUnreadMsg,
                        { 
                            where: {
                                uuid: msgUuid
                            }
                        }
                    ).then(updateRead => {
                        db.ProductMsgInstance.update(
                            adminApprovalMsg,
                            { 
                                where: {
                                    [db.Sequelize.Op.and]: [{uuid: msgInstanceUuid}, {ProductMsgUuid: msgUuid}]
                                }
                            }
                        ).then(updateRead => {
                            if(msgFrom === 'BUYER') {
                                db.sequelize.query(`SELECT uuid, sellerId FROM ProductMsgs WHERE UUID = '${msgUuid}'`, { type: db.Sequelize.QueryTypes.SELECT }).then(seller => {
                                    const notificationMsg = `New message from a buyer`;
                                    notificationSe.createNotification('SELLER', 'ADMIN', seller[0].sellerId, 'MESSAGE', msgUuid, notificationMsg).then(notification => {
                                        res.send(updateRead);
                                    });
                                });                                
                            } else if(msgFrom === 'SELLER') {
                                db.sequelize.query(`SELECT uuid, buyerId FROM ProductMsgs WHERE UUID = '${msgUuid}'`, { type: db.Sequelize.QueryTypes.SELECT }).then(buyer => {
                                    const notificationMsg = `New message from a seller`;
                                    notificationSe.createNotification('BUYER', 'ADMIN', buyer[0].buyerId, 'MESSAGE', msgUuid, notificationMsg).then(notification => {
                                        res.send(updateRead);
                                    });
                                });                                
                            }                    
                        });   
                    });    
                } else {
                    db.ProductMsgInstance.update(
                        setUnreadMsg,
                        { 
                            where: {
                                [db.Sequelize.Op.and]: [{uuid: msgInstanceUuid}, {ProductMsgUuid: msgUuid}]
                            }
                        }
                    ).then(updateRead => {
                        if(msgFrom === 'BUYER') {
                            db.sequelize.query(`SELECT uuid, sellerId FROM ProductMsgs WHERE UUID = '${msgUuid}'`, { type: db.Sequelize.QueryTypes.SELECT }).then(seller => {
                                const notificationMsg = `New message from a buyer`;
                                notificationSe.createNotification('SELLER', 'ADMIN', seller[0].sellerId, 'MESSAGE', msgUuid, notificationMsg).then(notification => {
                                    res.send(updateRead);
                                });
                            });                                
                        } else if(msgFrom === 'SELLER') {
                            db.sequelize.query(`SELECT uuid, buyerId FROM ProductMsgs WHERE UUID = '${msgUuid}'`, { type: db.Sequelize.QueryTypes.SELECT }).then(buyer => {
                                const notificationMsg = `New message from a seller`;
                                notificationSe.createNotification('BUYER', 'ADMIN', buyer[0].buyerId, 'MESSAGE', msgUuid, notificationMsg).then(notification => {
                                    res.send(updateRead);
                                });
                            });                                
                        } 
                    });  
                }
            });
        }
    }

    async adminRejectProdcutMsg(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const msgUuid = req.body.msgUuid;
        const msgInstanceUuid = req.body.msgInstanceUuid;
        const msgFrom = req.body.msgFrom;
        const rejectMsg = req.body.rejectMsg;        
        let setUnreadMsg = {};      

        if(decoded.userType === 'Admin') {            
            db.ProductMsgInstance.count({
                where: {
                    ProductMsgUuid: {
                        [db.Sequelize.Op.eq]: msgUuid
                    }
                }
            }).then(miCount => {
                if(miCount === 1) {
                    if(msgFrom === 'BUYER') {
                        setUnreadMsg = {adminStatus: 'REJECTED', readByBuyer: false, adminNote: rejectMsg};
                    } else {
                        setUnreadMsg = {adminStatus: 'REJECTED', readBySeller: false, adminNote: rejectMsg}
                    }

                    db.ProductMsg.update(
                        setUnreadMsg,
                        { 
                            where: {
                                uuid: msgUuid
                            }
                        }
                    ).then(updateRead => {
                        db.ProductMsgInstance.update(
                            { 
                                adminStatus: 'REJECTED',
                                adminNote: rejectMsg                              
                            },
                            { 
                                where: {
                                    [db.Sequelize.Op.and]: [{uuid: msgInstanceUuid}, {ProductMsgUuid: msgUuid}]
                                }
                            }
                        ).then(updateRead => {
                            if(msgFrom === 'BUYER') {
                                db.sequelize.query(`SELECT uuid, buyerId FROM ProductMsgs WHERE UUID = '${msgUuid}'`, { type: db.Sequelize.QueryTypes.SELECT }).then(buyer => {
                                    const notificationMsg = `Admin rejected your message`;
                                    notificationSe.createNotification('BUYER', 'ADMIN', buyer[0].buyerId, 'MESSAGE', msgUuid, notificationMsg).then(notification => {
                                        res.send(updateRead);
                                    });
                                });                                
                            } else if(msgFrom === 'SELLER') {
                                db.sequelize.query(`SELECT uuid, sellerId FROM ProductMsgs WHERE UUID = '${msgUuid}'`, { type: db.Sequelize.QueryTypes.SELECT }).then(seller => {
                                    const notificationMsg = `Admin rejected your message`;
                                    notificationSe.createNotification('SELLER', 'ADMIN', seller[0].sellerId, 'MESSAGE', msgUuid, notificationMsg).then(notification => {
                                        res.send(updateRead);
                                    });
                                });                                
                            } 
                        });   
                    });    
                } else {
                    if(msgFrom === 'BUYER') {
                        setUnreadMsg = {readByBuyer: false};
                    } else {
                        setUnreadMsg = {readBySeller: false}
                    }

                    db.ProductMsg.update(
                        setUnreadMsg,
                        { 
                            where: {
                                uuid: msgUuid
                            }
                        }
                    ).then(updateRead => {
                        db.ProductMsgInstance.update(
                            { 
                                adminStatus: 'REJECTED',
                                adminNote: rejectMsg                              
                            },                            
                            { 
                                where: {
                                    [db.Sequelize.Op.and]: [{uuid: msgInstanceUuid}, {ProductMsgUuid: msgUuid}]
                                }
                            }
                        ).then(updateRead => {
                            if(msgFrom === 'BUYER') {
                                db.sequelize.query(`SELECT uuid, buyerId FROM ProductMsgs WHERE UUID = '${msgUuid}'`, { type: db.Sequelize.QueryTypes.SELECT }).then(buyer => {
                                    const notificationMsg = `Admin rejected your message`;
                                    notificationSe.createNotification('BUYER', 'ADMIN', buyer[0].buyerId, 'MESSAGE', msgUuid, notificationMsg).then(notification => {
                                        res.send(updateRead);
                                    });
                                });                                
                            } else if(msgFrom === 'SELLER') {
                                db.sequelize.query(`SELECT uuid, sellerId FROM ProductMsgs WHERE UUID = '${msgUuid}'`, { type: db.Sequelize.QueryTypes.SELECT }).then(seller => {
                                    const notificationMsg = `Admin rejected your message`;
                                    notificationSe.createNotification('SELLER', 'ADMIN', seller[0].sellerId, 'MESSAGE', msgUuid, notificationMsg).then(notification => {
                                        res.send(updateRead);
                                    });
                                });                                
                            }
                        });  
                    });                    
                }
            });
        }
    }

    async setMsgSeen(req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        const msgUuid = req.body.msgUuid;

        if(decoded.userType === 1) {
            // If Buyer            
            db.sequelize.query(`SELECT uuid, buyerId FROM ProductMsgs WHERE UUID = '${msgUuid}' AND buyerId = ${decoded.id} AND readByBuyer = 0`, { type: db.Sequelize.QueryTypes.SELECT }).then(buyer => {
                if(buyer.length > 0) {
                    db.ProductMsg.update(
                        { 
                            readByBuyer: true 
                        },
                        { 
                            where: {
                                [db.Sequelize.Op.and]: [{uuid: msgUuid}, {buyerId: decoded.id}]
                            },
                            silent: true
                        }
                        
                    ).then(updateRead => res.send(updateRead)); 
                } else {
                    res.status(200).send();
                }       
            });
        } else if(decoded.userType === 2) {
            // If Seller                        
            db.sequelize.query(`SELECT uuid, sellerId FROM ProductMsgs WHERE UUID = '${msgUuid}' AND sellerId = ${decoded.id} AND readBySeller = 0`, { type: db.Sequelize.QueryTypes.SELECT }).then(seller => {                
                if(seller.length > 0) {                    
                    db.ProductMsg.update(
                        { 
                            readBySeller: true 
                        },
                        { 
                            where: {
                                [db.Sequelize.Op.and]: [{uuid: msgUuid}, {sellerId: decoded.id}]
                            },
                            silent: true
                        }
                    ).then(updateRead => res.send(updateRead)); 
                } else {
                    res.status(200).send();
                }       
            });
        } else if(decoded.userType === 'Admin') {
            // If Admin          
            db.sequelize.query(`SELECT uuid FROM ProductMsgs WHERE UUID = '${msgUuid}' AND readByAdmin = 0`, { type: db.Sequelize.QueryTypes.SELECT }).then(admin => {                
                if(admin.length > 0) {
                    db.ProductMsg.update(
                        { 
                            readByAdmin: true 
                        },
                        { 
                            where: {
                                [db.Sequelize.Op.and]: [{uuid: msgUuid}]
                            },
                            silent: true
                        }
                    ).then(updateRead => res.send(updateRead)); 
                } else {
                    res.status(200).send();
                }       
            });
        }
    }
}
module.exports = ProductMessage;
