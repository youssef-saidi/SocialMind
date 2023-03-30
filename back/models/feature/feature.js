module.exports = (sequelize, DataType) => {
    const Feature = sequelize.define("Feature", {
        id: {
            type: DataType.BIGINT(60),
            autoIncrement: true,
            primaryKey: true
        },
        feature_name: {
            type: DataType.STRING(250),
            allowNull: false
        },
     
    }
    );
    Feature.associate = (models) => {
        Feature.hasMany(models.FeatureMeta, {foreignKey: 'feature_id'});
        Feature.hasMany(models.Basket, {foreignKey: 'feature_id'});


    }
    return Feature

}