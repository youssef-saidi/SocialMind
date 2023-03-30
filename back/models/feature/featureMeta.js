module.exports = (sequelize, DataType) => {
    const FeatureMeta = sequelize.define("FeatureMeta", {
        id: {
            type: DataType.BIGINT(60),
            autoIncrement: true,
            primaryKey: true
        },
          feature_id: {
            type: DataType.BIGINT(60),
            allowNull: false,
        },
        meta_key: {
            type: DataType.TEXT('long'),
            allowNull: false
        },
        meta_value: {
            type: DataType.TEXT('long'),
            allowNull: true
        }

    });
    FeatureMeta.associate = (models) => {
        FeatureMeta.belongsTo(models.Feature, {foreignKey: 'id'});
    }

    return FeatureMeta
}