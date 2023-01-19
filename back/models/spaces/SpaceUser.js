module.exports = (sequelize, DataType) => {
    const SpaceUser = sequelize.define("SpaceUser", {
        space_id: {
            type: DataType.BIGINT(60),
            allowNull: false,
        },
        user_id: {
            type: DataType.BIGINT(60),
            allowNull: false,
        },
        is_owner: {
            type: DataType.BOOLEAN,
            allowNull: false
        }

    });
    return SpaceUser
}