module.exports = (sequelize, DataType) => {
    const UserMeta = sequelize.define("UserMeta", {
        id: {
            type: DataType.BIGINT(60),
            autoIncrement: true,
            primaryKey: true
        },
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
    UserMeta.associate = (models) => {
        UserMeta.belongsTo(models.User, {foreignKey: 'id',onDelete: 'CASCADE', hooks: true});
    }

    return UserMeta
}