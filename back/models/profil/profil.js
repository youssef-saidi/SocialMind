module.exports = (sequelize, DataType) => {
    const Profil = sequelize.define("Profil", {
        id: {
            type: DataType.BIGINT(60),
            autoIncrement: true,
            primaryKey: true
        },
         user_id: {
            type: DataType.BIGINT(60),
            allowNull: false
        },
        profil_name: {
            type: DataType.STRING(250),
            allowNull: false
        },
      
    });
    Profil.associate = (models) => {
        Profil.hasMany(models.ProfilMeta, {foreignKey: 'profil_id',onDelete: 'CASCADE', hooks: true});
        Profil.belongsTo(models.User, {foreignKey: 'user_id'});
    }
    return Profil

}