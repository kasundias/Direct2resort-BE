module.exports = (Sequelize, sequelize, DataTypes) => {
    const Product = sequelize.define("Product", {
        product_id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        product_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        product_imgs: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },{
        tableName: 'Product',
        timestamps: false
    });
    
    Product.associate = models => {
        Product.hasMany(models.ProductMsg)
    }

    return Product;
}