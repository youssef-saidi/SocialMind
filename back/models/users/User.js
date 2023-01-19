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
        user_status: {
            type: DataType.BOOLEAN,
            allowNull: false
        },
        user_active: {
            type: DataType.BOOLEAN,
            allowNull: false
        },
    },{
        timestamps: true,
        classMethods: {
            associate: (models) => {

            }
        },
        instanceMethods: {
            toJSON: () => {

            }
        },
        hooks: {
            afterFind: function( result ) {
                if(
                    result &&
                    result._options &&
                    result._options.includeValidated &&
                    result.UserMeta
                ) {
                    const UserMeta = result.UserMeta;
                    result.UserMeta = {};

                    UserMeta.map( m => result.UserMeta[m.dataValues.meta_key] = m.dataValues.meta_value);

                    return result.setDataValue('UserMeta', result.UserMeta)


                }

                return result;
            }
        }
    });
    return User

}