module.exports = (sequelize, DataType) => {
    const Space = sequelize.define("Space", {
        id: {
            type: DataType.BIGINT(60),
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataType.STRING(250),
            allowNull: false
        },
        slug: {
            type: DataType.STRING(250),
            allowNull: false
        },
        status: {
            type: DataType.BOOLEAN,
            allowNull: false
        }
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
                    result.SpaceMeta
                ) {
                    const SpaceMeta = result.SpaceMeta;
                    result.SpaceMeta = {};

                    SpaceMeta.map( m => result.SpaceMeta[m.dataValues.meta_key] = m.dataValues.meta_value);

                    return result.setDataValue('SpaceMeta', result.SpaceMeta)


                }

                return result;
            }
        }
    });
    return Space
}