module.exports = (sequelize, DataType) => {
    const SpaceMeta = sequelize.define("SpaceMeta", {
        space_id: {
            type: DataType.BIGINT(60),
            allowNull: false,
        },
        meta_key: {
            type: DataType.TEXT('long'),
            allowNull: false
        },
        meta_value: {
            type: DataType.TEXT('long'),
            allowNull: false
        }

    });

    return SpaceMeta
}