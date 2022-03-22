const getAllCategories = "SELECT * FROM ProductCategories WHERE deleted = 0";
const getAllSubCategories = "SELECT * FROM SubProductCategories WHERE ProductCategories_product_cat_id = ?";
const filterProducts = "SELECT * FROM Product WHERE admin_approved = 1 AND deleted = 0 AND SubProductCategories_ProductCategories_product_cat_id = ? AND SubProductCategories_sub_prod_cat_id IN (?) ORDER BY created_date DESC LIMIT ?";
const filterProductsNoSubCats = "SELECT * FROM Product WHERE admin_approved = 1 AND SubProductCategories_ProductCategories_product_cat_id = ? LIMIT ?";
const noFilterProducts = "SELECT * FROM Product WHERE admin_approved = 1 AND deleted = 0 ORDER BY created_date DESC LIMIT ?";
const liveSearchProduct = "SELECT product_id, product_name, product_url, product_imgs FROM Product WHERE admin_approved = 1 AND product_name LIKE ? LIMIT 6";
const getRelatedProducts = "SELECT * FROM Product WHERE admin_approved = 1 AND SubProductCategories_sub_prod_cat_id = ? AND product_id NOT IN (?) LIMIT 3";
const getCatBySlug = "SELECT * FROM ProductCategories WHERE category_slug = ?";
const getAllSustainableProducts = "SELECT * FROM Product WHERE admin_approved = 1 AND deleted = 0 AND sustainable_product = 1 ORDER BY created_date DESC LIMIT ?";

module.exports = {
    getAllCategoriesQuery : getAllCategories,
    getAllSubCategoriesQuery: getAllSubCategories,
    filterProductsQuery: filterProducts,
    filterProductsNoSubCatsQuery: filterProductsNoSubCats,
    noFilterProductsQuery: noFilterProducts,
    liveSearchProductQuery: liveSearchProduct,
    getRelatedProductsQuery: getRelatedProducts,
    getCatBySlugQuery: getCatBySlug,
    getAllSustainableProductsQuery: getAllSustainableProducts
};
