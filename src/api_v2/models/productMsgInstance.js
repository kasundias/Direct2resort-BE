module.exports = (Sequelize, sequelize, DataTypes) => {
    const ProductMsgInstance = sequelize.define("ProductMsgInstance", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        messageContent: {
            type: DataTypes.TEXT
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
        msgFrom: {
            type: DataTypes.ENUM,
            values: ['BUYER', 'SELLER']
        },
        msgTo: {
            type: DataTypes.ENUM,
            values: ['BUYER', 'SELLER']
        } 
    });

    ProductMsgInstance.associate = models => {
        ProductMsgInstance.belongsTo(models.ProductMsg, {
            foreignKey: {
                allowNull: false
            }
        })
    }

    return ProductMsgInstance;
}