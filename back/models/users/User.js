module.exports = (sequelize, DataType) => {
    const User = sequelize.define("User", {
        id: {
            type: DataType.BIGINT(60),
            autoIncrement: true,
            primaryKey: true
        },
        user_email: {
            type: DataType.STRING(250),
            allowNull: false
        },
        user_pass: {
            type: DataType.STRING(250),
            allowNull: false
        },
        profil_number: {
            type:DataType.INTEGER,
            allowNull: false,
            defaultValue: 0

        },
        user_status: {
            type: DataType.BOOLEAN,
            allowNull: false
        },
        user_active: {
            type: DataType.BOOLEAN,
            allowNull: false
        },
    }
    );
    User.associate = (models) => {
        User.hasMany(models.UserMeta, {foreignKey: 'user_id'});
        User.hasMany(models.Profil, {foreignKey: 'user_id'});
        User.hasMany(models.Basket, {foreignKey: 'user_id'});


    }
    return User

}