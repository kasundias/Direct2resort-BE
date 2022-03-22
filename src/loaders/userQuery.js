const getUserByEmailAdmin="SELECT admin_fName,admin_lName,admin_user_id,password,admin_email FROM AdminUser WHERE admin_email=?";
const getUserByEmail="SELECT gen_p_full_name,gen_p_user_id,password,gen_p_ivys_admin_aproval,UserCategory_user_category_id,gen_p_email,Company_company_id FROM GeneralPersonalUser WHERE gen_p_email=? AND verified=1";
const createAdminUser="INSERT INTO AdminUser SET ?";
const createGeneralUser="INSERT INTO GeneralPersonalUser SET ?";
const createUserAuth="INSERT INTO UserAuth SET ?";
const createCompany="INSERT INTO Company SET ?";
const getUserCategoriesList = "SELECT * FROM UserCategory";
const checkUserActive = "SELECT gen_p_full_name,gen_p_user_id,gen_p_ivys_admin_aproval,UserCategory_user_category_id,gen_p_email,Company_company_id FROM GeneralPersonalUser WHERE gen_p_email=?";
const updateVerficationSenderDetails = "UPDATE GeneralPersonalUser SET token = ? WHERE gen_p_user_id = ?";
const getVerificationConfirmation = "SELECT * FROM GeneralPersonalUser WHERE token = ?";
const updateVerificationStatus = "UPDATE GeneralPersonalUser SET verified = 1 WHERE gen_p_user_id = ?";
const checkMailExists = "SELECT * FROM GeneralPersonalUser WHERE gen_p_email=?";
const liveEmailExist = "";

const checkIfUserExistsByEmail = "SELECT gen_p_full_name, gen_p_email FROM GeneralPersonalUser WHERE gen_p_email = ?";
const forgotPwToken = "UPDATE GeneralPersonalUser SET is_pw_reset = 1, pw_reset_token = ? WHERE gen_p_email = ?";
const getUserByToken = "SELECT gen_p_user_id, gen_p_full_name, gen_p_email FROM GeneralPersonalUser WHERE is_pw_reset = 1 AND pw_reset_token = ?";
const updateUserPW = "UPDATE GeneralPersonalUser SET password = ?, pw_reset_token = NULL, is_pw_reset = 0 WHERE gen_p_email = ?";

const getSellersByCompanyId = 'SELECT gen_p_email FROM GeneralPersonalUser WHERE Company_company_id = ?';
const getUserEmailById = 'SELECT gen_p_email FROM GeneralPersonalUser WHERE gen_p_user_id = ?';
const getUserCompanyData = "SELECT * FROM Company WHERE company_id = ?";

module.exports = {
    adminLogin : getUserByEmailAdmin,
    normalLogin : getUserByEmail,
    checkUserActiveQuery: checkUserActive,
    registerAdminUser : createAdminUser,
    registerGeneralUser : createGeneralUser,
    registerUserAuth : createUserAuth,
    registerCompany : createCompany,
    userCatList : getUserCategoriesList,
    updateVerficationSenderDetailsQuery : updateVerficationSenderDetails,
    getVerificationConfirmationQuery : getVerificationConfirmation,
    updateVerificationStatusQuery : updateVerificationStatus,
    checkMailExistsQuery : checkMailExists,
    liveEmailExistQuery: liveEmailExist,

    checkIfUserExistsByEmailQuery: checkIfUserExistsByEmail,
    forgotPwTokenQuery: forgotPwToken,
    getUserByTokenQuery: getUserByToken,
    updateUserPWQuery: updateUserPW,

    getSellersByCompanyIdQuery: getSellersByCompanyId,
    getUserEmailByIdQuery: getUserEmailById,

    getUserCompanyDataQuery: getUserCompanyData
};
