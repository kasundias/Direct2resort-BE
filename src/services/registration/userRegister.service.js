var userQuery = require('../../loaders/userQuery');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var utils = require('../util/util.service');
const UtilService = new utils();
var FlakeId = require('flake-idgen');
var flakeIdGen = new FlakeId();
var intformat = require('biguint-format'), FlakeId = require('flake-idgen')
var hashPassword;

const NotificationService = require('../../services/util/notification.service');
const notificationSe = new NotificationService();

class UserRegister {
    async userLogin(req, res) {
        try {
            const userLoginValidation = Joi.object({
                email: Joi.string()
                    .required()
                    .email(),
                password: Joi.string()
                    .min(2)
                    .required(),
                userType: Joi.string()
                    .min(2)
            });

            const {error} = userLoginValidation.validate(req.body);
            if(error) return res.status(400).send({message: error.details[0].message});

            if (req.body.userType === 'Admin') {
                const response = await UtilService.asynqQuery(userQuery.adminLogin, [req.body.email]);
                const validPassT = await bcrypt.compare(req.body.password, response[0].password);
                if (validPassT){
                    const token = jwt.sign({id: response[0].admin_user_id, email: req.body.email, userType: 'Admin', name: response[0].admin_fName + ' ' + response[0].admin_lName}, process.env.TOKEN_SECRET);
                    res.header('auth-token', token).send({token: token});

                } else {
                    throw e;
                }

            } else {
                const response = await UtilService.asynqQuery(userQuery.normalLogin, [req.body.email]);
                if(response.length) {
                    const validPassT = await bcrypt.compare(req.body.password, response[0].password);
                    if (validPassT){
                        if(response[0].gen_p_ivys_admin_aproval === 'Active') {
                            const token = jwt.sign({id: response[0].gen_p_user_id, email: req.body.email, userType: response[0].UserCategory_user_category_id, name: response[0].gen_p_full_name, companyId : response[0].Company_company_id}, process.env.TOKEN_SECRET);
                            res.header('auth-token', token).send({token : token});
                        } else {
                            return res.status(400).send({message: 'Inactive account'});
                        }
                    } else {
                        return res.status(400).send({message: 'Invalid email or password'});
                    }
                } else {
                    return res.status(400).send({message: 'Invalid email or password'});
                }
            }
        } catch (e) {
            return res.status(400).send({message: 'something went wrong'});
        }
    }
    async registerUser(req, res) {
        try {

            const salt = await bcrypt.genSalt(10);
            hashPassword = await bcrypt.hash(req.body.password, salt);

        } catch (err) {

        }
        if (req.body.user_category_name === 'Admin') {
            const regUserDetails = {
                admin_email: req.body.admin_email, admin_fName: req.body.admin_fName,
                admin_lName: req.body.admin_lName, admin_contact_number: req.body.admin_contact_number, password: hashPassword
            };
            try {
                const response= await UtilService.asynqQuery(userQuery.registerAdminUser, regUserDetails);
            } catch (e) {
                return res.status(400).send({message: e});
              } finally {
                return res.status(200).send({message: 'Success'});
              }

        } else {
            const regUserDetails = {
                gen_p_full_name: req.body.gen_p_full_name, Company_company_id: req.body.Company_company_id,
                gen_p_email: req.body.gen_p_email, password: hashPassword, UserCategory_user_category_id: req.body.UserCategory_user_category_id
            };
            try {
                const response= await UtilService.asynqQuery(userQuery.registerGeneralUser, regUserDetails);
                const uni = intformat(flakeIdGen.next(), 'dec');
               // const token = jwt.sign({unique: uni, email: req.body.gen_p_email, userType: req.body.UserCategory_user_category_id, name: req.body.gen_p_full_name, companyId : req.body.Company_company_id}, process.env.TOKEN_SECRET);             
                await UtilService.asynqQuery(userQuery.updateVerficationSenderDetailsQuery,[uni, response.insertId]);
                await UtilService.sendMail('ivys@apium.io', 'direct2resort@gmail.com','email verification subject',req.headers.host+'\/api\/'+'\/auth\/'+'\/validateToken\/'+uni,uni);
            } catch (e) {
                return res.status(400).send({message: e});
              } finally {
                return res.status(200).send({message: 'Success'});
              }
        }

    }
    async getUserCategories(req, res) {
        try {
            const response= await UtilService.asynqQueryNoParams(userQuery.userCatList);
        } catch (e) {
            return res.status(400).send({message: e});
          } finally {
            return res.status(200).send({message: 'Success'});
          }
    }

    async adminLogin(req, res) {
        try {
            const adminLoginValidation = Joi.object({
                email: Joi.string()
                    .required()
                    .email(),
                password: Joi.string()
                    .min(4)
                    .required()
            });

            const {error} = adminLoginValidation.validate(req.body);
            if(error) return res.status(400).send(error.details[0].message);
            const response = await UtilService.asynqQuery(userQuery.adminLogin, [req.body.email]);
            if(!response.length) return res.status(400).send('No user found with the email');
            const validPassT = await bcrypt.compare(req.body.password, response[0].password);
            if(!validPassT) return res.status(400).send('Email or Password not valid');
            const token = jwt.sign({id: response[0].admin_user_id, email: req.body.email, userType: 'Admin', name: response[0].admin_fName + ' ' + response[0].admin_lName}, process.env.TOKEN_SECRET);
            res.header('auth-token', token).send({token: token});

        } catch (e) {
            res.status(400).send(e);
        }
    }

    async verificationMailConfirm(req, res) {
        const getUserByToken = await UtilService.asynqQuery(userQuery.getVerificationConfirmationQuery,[req.params.token]);
        let notificationTypeId;
        let notificationUserType;

        if(getUserByToken.length) {
            if(getUserByToken[0].UserCategory_user_category_id === 1) {
                notificationTypeId = 'buyer-manager';
                notificationUserType = 'BUYER';
            } else if(getUserByToken[0].UserCategory_user_category_id === 2) {
                notificationTypeId = 'seller-manager';
                notificationUserType = 'SELLER';
            } else if(getUserByToken[0].UserCategory_user_category_id === 3) {
                notificationTypeId = 'logistic-partner-manager';
                notificationUserType = 'LP';
            }
        }

        if (getUserByToken.length) {
            const newresponse = await UtilService.asynqQuery(userQuery.updateVerificationStatusQuery,[getUserByToken[0].gen_p_user_id]);
            if(newresponse.changedRows > 0) {
                let notificationMsg = `${getUserByToken[0].gen_p_full_name} (${getUserByToken[0].gen_p_email}) email verification success`;
                await notificationSe.createNotification('ADMIN', notificationUserType, '-1', 'USER_REG', notificationTypeId, notificationMsg);
                
                return res.status(200).send({status: true, message: 'Email Avaialble Verification Success'});
            } else {
                return res.status(400).send({status: false, message: 'Expired Token'});
            }
        } else {
            return res.status(400).send({status: false, message: 'Invalid Token'});
        }
    }

    async checkIfEmailExist(req, res) {
        const response = await UtilService.asynqQuery(userQuery.checkMailExistsQuery, req.body.email)
        .catch(error => {
            return res.status(400).send({message: error.code, status: false}); 
        });
        if(response.length) {
            return res.status(200).send({status: true, message: 'Email Exist'});
        } else {
            return res.status(200).send({status: false, message: 'Email Avaialble to Register'});
        }
    }
}
module.exports = UserRegister;
