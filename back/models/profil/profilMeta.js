module.exports = (sequelize, DataType) => {
    const ProfilMeta = sequelize.define("ProfilMeta", {
        id: {
            type: DataType.BIGINT(60),
            autoIncrement: true,
            primaryKey: true
        },
         profil_id: {
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

    }
   );
   ProfilMeta.associate = (models) => {
    ProfilMeta.belongsTo(models.Profil, {foreignKey: 'id',onDelete: 'CASCADE', hooks: true});
}

    return ProfilMeta
}