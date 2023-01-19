
let fs = require("fs"),
path = require("path"),
Sequelize = require("sequelize"),
basename = path.basename(module.filename),
db = {};
sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASS, {
		username: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIAL,
		dialectOptions: {
			connectTimeout: 60000,
		},
		pool: {
			min: 0,
			max: 5,
			acquire: 60000,
			idle: 10000
		},
		logging: 0
	}, {
		define: {
			underscored: true,
			supportBigNumbers: true
		}
	}
);


const files = []
const sortDir = (maniDir) => {
  const folders = []
  const CheckFile = (filePath) => fs.statSync(filePath).isFile()
  const sortPath = (dir) => {
	fs.readdirSync(dir)
	  .filter((file) => file.indexOf(".") !== 0 && file !== "index.js")
	  .forEach((res) => {
		const filePath = path.join(dir, res)
		if (CheckFile(filePath)) {
		  files.push(filePath)
		} else {
		  folders.push(filePath)
		}
	  })
  }
  folders.push(maniDir)
  let i = 0
  do {
	sortPath(folders[i])
	i += 1
  } while (i < folders.length)
}
sortDir(__dirname)

files.forEach((file) => {
  const model = require(file)(sequelize, Sequelize.DataTypes)
  db[model.name] = model
})

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
	db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize


db.sequelize.sync().then(() => {

	db.User.hasMany(db.UserMeta, {foreignKey: 'user_id'});
	db.UserMeta.belongsTo(db.User, {foreignKey: 'id'});

	db.Space.hasMany(db.SpaceMeta, {foreignKey: 'space_id'});
	db.SpaceMeta.belongsTo(db.Space, {foreignKey: 'id'});


	// db.Posts.hasMany(db.PostMeta, {foreignKey: 'post_id'});
	// db.PostMeta.belongsTo(db.Posts, {foreignKey: 'id'});
	// db.Posts.hasMany(db.PostsSpaceRelationships, {foreignKey: 'post_id'});
	// db.PostsSpaceRelationships.belongsTo(db.Posts, {foreignKey: 'id'});

});

module.exports = db
