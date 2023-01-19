module.exports = (sequelize, DataType) => {
    const UserMeta = sequelize.define("UserMeta", {
        user_id: {
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

    return UserMeta
}