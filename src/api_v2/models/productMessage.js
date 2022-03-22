module.exports = (Sequelize, sequelize, DataTypes) => {
    const ProductMsg = sequelize.define("ProductMsg", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        sellerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        buyerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        adminStatus: {
            type: DataTypes.ENUM,
            values: ['PENDING', 'REJECTED', 'APPROVED'],
            defaultValue: 'PENDING'
        },
        adminNote: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        readBySeller: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        readByBuyer: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        readByAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    ProductMsg.associate = models => {
        ProductMsg.hasMany(models.ProductMsgInstance)

        ProductMsg.belongsTo(models.Product, {
            foreignKey: {
                allowNull: false
            }
        })
    }

    return ProductMsg;
}