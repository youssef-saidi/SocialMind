module.exports = (sequelize, DataType) => {
    const Basket = sequelize.define("Basket", {
        id: {
            type: DataType.BIGINT(60),
            autoIncrement: true,
            primaryKey: true
        },
        deadline:{
            type:DataType.DATE,
            allowNull: false
        }
     
    }
    );
    Basket.associate = (models) => {
       
        Basket.belongsTo(models.Feature, {foreignKey: 'id'});
        Basket.belongsTo(models.User, {foreignKey: 'id'});


    }
    return Basket

}