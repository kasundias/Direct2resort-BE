var userQuery = require('../../loaders/userQuery');
var GeneralQueryService = require('../../services/util/util.service');
const generalQuery = new GeneralQueryService();
const bcrypt = require('bcryptjs');
var base64Img = require('base64-img');
var FlakeId = require('flake-idgen');
var flakeIdGen = new FlakeId();
var intformat = require('biguint-format'), FlakeId = require('flake-idgen');
var companyIdVal;
var hashPassword;
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const NotificationService = require('../../services/util/notification.service');
const notificationSe = new NotificationService();

class CompanyRegister {
    async registerCompany(req, res) {
        var regCompanyDetails;
        const mailCheck = await generalQuery.asynqQuery(userQuery.checkMailExistsQuery, [req.body.gen_p_email])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });

        if (!mailCheck.length) {
            const salt = await bcrypt.genSalt(10);
            hashPassword = await bcrypt.hash(req.body.password, salt);
            const uni = intformat(flakeIdGen.next(), 'dec') ;            
            const uploadedDoc = await generalQuery.uploadImagesToSpace([req.body.company_ci_doc], 'company-incop-docs');

            if (uploadedDoc){
                if (req.body.UserCategory_user_category_id===1){
                    regCompanyDetails = {
                        company_name: req.body.company_name, company_email: req.body.company_email,
                        company_website: req.body.company_website, company_street_address: req.body.company_street_address,
                        company_state: req.body.company_state, company_zip_code: req.body.company_zip_code,
                        company_city: req.body.company_city, company_country: req.body.company_country,
                        company_tp: req.body.company_tp,
                        company_vat_gst : req.body.company_vat_gst,
                        shipping_street : req.body.shipping_street,
                        shipping_city : req.body.shipping_city,
                        shipping_state : req.body.shipping_state,
                        shipping_zip_code : req.body.shipping_zip_code,
                        shipping_country : req.body.shipping_country,
                        company_ci_doc : uploadedDoc.toString(),
                        created_date: new Date()
                    };
                } else {
                    regCompanyDetails = {
                        company_name: req.body.company_name, company_email: req.body.company_email,
                        company_website: req.body.company_website, company_street_address: req.body.company_street_address,
                        company_state: req.body.company_state, company_zip_code: req.body.company_zip_code,
                        company_city: req.body.company_city, company_country: req.body.company_country,
                        company_tp: req.body.company_tp,
                        company_vat_gst : req.body.company_vat_gst,
                        company_ci_doc : uploadedDoc.toString(),
                        created_date: new Date()
                    };
                }

                const response = await generalQuery.asynqQuery(userQuery.registerCompany, regCompanyDetails)
                .catch(error => {
                    return res.status(400).send({message: error.code, status: false}); 
                });
                companyIdVal = response.insertId;

                if (companyIdVal) {
                    const regUserDetails = {
                        gen_p_full_name: req.body.gen_p_full_name, Company_company_id: companyIdVal,
                        gen_p_is_admin: 1, gen_p_email: req.body.gen_p_email, password: hashPassword,
                        UserCategory_user_category_id: req.body.UserCategory_user_category_id,
                        created_date: new Date()
                    };
                    const userIdInsert = await generalQuery.asynqQuery(userQuery.registerGeneralUser, regUserDetails)
                    .catch(error => {
                        return res.status(400).send({message: error.code, status: false}); 
                    });
                    await generalQuery.asynqQuery(userQuery.updateVerficationSenderDetailsQuery,[uni, userIdInsert.insertId])
                    .catch(error => {
                        return res.status(400).send({message: error.code, status: false}); 
                    });

                    let userCat;
                    let notificationUserType;
                    let notificationTypeId;

                    if(req.body.UserCategory_user_category_id === "1") {
                        userCat = 'Buyer';
                        notificationUserType = 'BUYER';
                        notificationTypeId = 'buyer-manager';
                    } else if(req.body.UserCategory_user_category_id === "2") {
                        userCat = 'Seller';
                        notificationUserType = 'SELLER';
                        notificationTypeId = 'seller-manager';
                    } else if(req.body.UserCategory_user_category_id === "3") {
                        userCat = 'Logistic Partner';
                        notificationUserType = 'LP';
                        notificationTypeId = 'logistic-partner-manager';
                    }

                    const htmlEmail = {
                        subject: `IVYS ${userCat} Registration`,
                        fName: req.body.gen_p_full_name,
                        verificationUrl: `${process.env.FE_PATH}/#/email-verify/${uni}`
                    };

                    const sendEmail = await generalQuery.sendMail('ivys@apium.io', req.body.gen_p_email, 'userReg', htmlEmail)
                    .catch(error => {
                        return res.status(400).send({message: error.code, status: false}); 
                    });

                    let notificationMsg = `New ${userCat} (${req.body.company_name} ${req.body.gen_p_email}) registered`;
                    await notificationSe.createNotification('ADMIN', notificationUserType, '-1', 'USER_REG', notificationTypeId, notificationMsg);

                    return res.status(200).send({status: true, message: 'Registration Successfull'});
                }
            } else {
                return res.status(400).send({status: false, message: 'CI document upload failed'});
            }
        } else {
            return res.status(400).send({status: false, message: 'Email Already Exists, Registration Failed !'});
        }
    }

    async testEmail(req, res) {
        const htmlEmail = {
            subject: 'IVYS Buyer Registration',
            fName: 'Test',
            lName: 'Last',
            verificationUrl: 'http://ivys.com/token=4738463762329'
        };

        const sendEmail = await generalQuery.sendMail('ivys@apium.io', 'ivys@apium.io', 'userReg', htmlEmail);
        console.log(sendEmail);

    }

    async forgotPassword(req, res) {
        const checkIfUserExists = await generalQuery.asynqQuery(userQuery.checkIfUserExistsByEmailQuery,[req.body.userEmail])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });
        
        if(checkIfUserExists.length > 0) {
            const pwToken = uuidv4();

            const forgetPwUpdate = await generalQuery.asynqQuery(userQuery.forgotPwTokenQuery,[pwToken, req.body.userEmail])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });

            if(forgetPwUpdate.changedRows > 0) {
                const htmlEmail = {
                    subject: `Direct2Resort Password Reset`,
                    fName: checkIfUserExists[0].gen_p_full_name,
                    pwResetUrl: `http://direct2resort.com/#/reset-password/${pwToken}`
                };

                const sendEmail = await generalQuery.sendMail('no-reply@direct2resort.com', checkIfUserExists[0].gen_p_email, 'passwordReset', htmlEmail)
                .catch(error => {
                    return res.status(400).send({message: error.code, status: false}); 
                });

                if(sendEmail) {
                    return res.status(200).send({message: 'Password reset instruction sent to your email', status: true});
                }
            }            
        } else {
            return res.status(400).send({message: 'No user found for this email address', status: false});
        }
    }

    async resetPasswordByToken(req, res) {
        const forgetPwUpdate = await generalQuery.asynqQuery(userQuery.getUserByTokenQuery,[req.body.pwToken])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });

        if(forgetPwUpdate.length > 0) {
            const salt = await bcrypt.genSalt(10);
            let hashPassword = await bcrypt.hash(req.body.newPassword, salt);
            const updatePassword = await generalQuery.asynqQuery(userQuery.updateUserPWQuery,[hashPassword, forgetPwUpdate[0].gen_p_email])
            .catch(error => {
                return res.status(400).send({message: error.code, status: false}); 
            });

            if(updatePassword.changedRows > 0) {
                return res.status(200).send({message: 'Password reset successful', status: true});
            } else {
                return res.status(400).send({message: 'Password Reset Failed', status: false}); 
            }
        } else {
            return res.status(400).send({message: 'Invalid token', status: false}); 
        }
    }

    async userInformation (req, res) {
        const decoded = jwt.verify(req.header('authorization').split(' ')[1], process.env.TOKEN_SECRET);
        let userInfo = {};

        const getUserCompanyData = await generalQuery.asynqQuery(userQuery.getUserCompanyDataQuery,[decoded.companyId])
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });

        userInfo = {
            name: decoded.name,
            email: decoded.email,
            companyName: getUserCompanyData[0].company_name,
            vatGst: getUserCompanyData[0].company_vat_gst,
            telephone: getUserCompanyData[0].company_tp,
            street: getUserCompanyData[0].company_street_address,
            city: getUserCompanyData[0].company_city,
            state: getUserCompanyData[0].company_state,
            zip: getUserCompanyData[0].company_zip_code,
            country: getUserCompanyData[0].company_country
        };

        return res.status(200).send({status: true, data: userInfo});
    }
}
module.exports = CompanyRegister;
