var express = require('express');
var router = express.Router();
var userRegister=require('../../services/registration/userRegister.service');
var companyRegister=require('../../services/registration/companyRegister.service');
const UserRegisterService =new userRegister();
const CompanyRegisterService=new companyRegister();

router.post('/login', async function (req, res) {
   UserRegisterService.userLogin(req,res);
});
router.post('/registration', async function (req, res) {
   const registerDet = await UserRegisterService.registerUser(req,res);
});
router.post('/companyRegistration', async function (req, res) {
    const registerDet = await CompanyRegisterService.registerCompany(req,res);
 });
router.get('/getUserCategories', async function (req, res) {
   const userCategories = await UserRegisterService.getUserCategories(req,res);
});
router.post('/adminLogin', async function (req, res) {   
   UserRegisterService.adminLogin(req, res);
});

router.get('/validateToken/:token', async function (req, res) {   
   UserRegisterService.verificationMailConfirm(req, res);
});
 
router.get('/testEmail', async function (req, res) {   
   CompanyRegisterService.testEmail(req, res);
});

router.post('/checkIfEmailExist', async function (req, res) {   
   UserRegisterService.checkIfEmailExist(req, res);
});

router.post('/forgotPassword', async function (req, res) {   
   CompanyRegisterService.forgotPassword(req, res);
});

router.post('/resetPasswordByToken', async function (req, res) {   
   CompanyRegisterService.resetPasswordByToken(req, res);
});

router.get('/userInformation', async function (req, res) {   
   CompanyRegisterService.userInformation(req, res);
});

module.exports = router;
