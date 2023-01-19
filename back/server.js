require('./global');
require('dotenv').config();
const _ = require('lodash');
const Fs = require('fs');
const Path = require('path');
const Models = require("./models");
const port = process.env.PORT || 5000;
const { dataDictionary } = require("./services/helpers");
const UserRoute = require("./routes/UserRoute");
const UserRouteMeta = require("./routes/UserMetaRoute");
const Bcrypt = require('bcrypt');
const Compression = require('compression');
const Uniqid = require('uniqid');
const Cors = require('cors');
const CookieParser = require('cookie-parser');
const BodyParser = require('body-parser');
const Express = require('express');
const Router = Express.Router();
const Useragent = require('express-useragent');
const SpaceRoute = require('./routes/SpaceRoute');
const { Sequelize, sequelize } = require('./models');
const VerifyToken = global.CoreHelpers.token.verifyToken;
const DecodeToken = global.CoreHelpers.token.decodeToken;
const validateEmail = global.CoreHelpers.validateEmail;
const HashPassword = global.CoreHelpers.token.hashPassword;
const CreateToken = global.CoreHelpers.token.createToken;
const uploadDir = './media/';


let App = Express();
App.disable('x-powered-by');

App.use(Cors({
	origin: '*',
	credentials: true
}));

App.use(Useragent.express());
App.use(BodyParser.json({ limit: '3mb' }));
App.use(BodyParser.urlencoded({ limit: '3mb', extended: true }));
App.use(CookieParser());
App.use(Compression());
App.use("/", UserRoute)
App.use("/", UserRouteMeta)
App.use("/", SpaceRoute)

//Whenever you need a unique string from server.
App.post('/uniquefy', (request, response, next) => {
	response.send(Uniqid.time(Uniqid(Uniqid.process())));
	return next();
});



// App.post('/user/get/users/', async (request, response, next) => {
// 	try {
// 		let token = request.headers.token;
// 		if (!VerifyToken(token)) {
// 			return response.json({
// 				status: false,
// 				errors: ['Something went wrong please try again later1.']
// 			});
// 		}

// 		token = DecodeToken(token);

// 		if (
// 			_.isUndefined(token.id) ||
// 			_.isUndefined(token.deviceId)
// 		) {
// 			return response.json({
// 				status: false,
// 				errors: ['Something went wrong please try again later2.']
// 			});
// 		}

// 		let sql = ``
// 		sql += `SELECT u.user_email as 'email' ,u.user_active as 'active' ,um.meta_value as 'name' ,c.name as 'role'`
// 		sql += `FROM users u ,usermeta um ,userroles ur,Capabilities c `
// 		sql += `WHERE u.id=um.user_id AND u.id=ur.user_id AND um.meta_key='name' and c.id = ur.role_id;`
		
// 		const users = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });

// 		return response.json({
// 			status: true,
// 			users: users
// 		});

// 	} catch (error) {
// 		console.log(error)
// 		return response.json({
// 			status: false,
// 			errors: ['Something went wrong please try again later']
// 		});

// 	}
// });




// App.post('/inventory/get/default/columns', (request, response, next) => {
// 	try {
// 		return response.json({
// 			status: true,
// 			dataDictionary
// 		});
// 	} catch (error) {
// 		return response.json({
// 			status: false,
// 			errors: ['Something went wrong please try again later']
// 		});

// 	}
// });

// App.post('/inventory/add/inventory', async (request, response, next) => {

// 	try {

// 		const deviceId = request.headers.deviceid;
// 		let token = request.headers.token;
// 		if (!VerifyToken(token)) {
// 			return response.json({
// 				status: false,
// 				errors: ['Something went wrong please try again later1.']
// 			});
// 		}

// 		token = DecodeToken(token);

// 		if (
// 			_.isUndefined(token.id) ||
// 			_.isUndefined(token.deviceId) ||
// 			token.deviceId != deviceId
// 		) {
// 			return response.json({
// 				status: false,
// 				errors: ['Something went wrong please try again later2.']
// 			});
// 		}


// 		let errors = [];
// 		const { DealerSKU, ReferenceNumber, Brand, Series, SerialNumber, Condition, Dial, Bezel, Bracelet, Status, StatusDetails, WarrantyPaper, WarrantyDate, Box, LinkCount, AdditionalDetails, MSRPPrice, MarketplacePrice, Onlineprice, Cost, DatePurchased, Vendor, Description, Images, CustomColumn } = request.body.data;

// 		//Validate all the data coming through.
// 		if (_.isEmpty(DealerSKU)) errors = [...errors, 'Dealer SKU is required'];
// 		if (_.isEmpty(ReferenceNumber)) errors = [...errors, 'Reference Number is required'];
// 		if (_.isEmpty(Brand)) errors = [...errors, 'Brand is required'];
// 		if (_.isEmpty(Series)) errors = [...errors, 'Series is required'];
// 		if (_.isEmpty(SerialNumber)) errors = [...errors, 'Serial Number is required'];
// 		if (_.isEmpty(Condition)) errors = [...errors, 'Condition is required'];
// 		if (_.isEmpty(Dial)) errors = [...errors, 'Dial is required'];
// 		if (_.isEmpty(Status)) errors = [...errors, 'Status is required'];
// 		if (_.isEmpty(Bezel)) errors = [...errors, 'Bezel is required'];
// 		if (_.isEmpty(Bracelet)) errors = [...errors, 'Bracelet is required'];
// 		if (_.isEmpty(WarrantyPaper)) errors = [...errors, 'Warranty Paper/Card is required'];
// 		if (_.isEmpty(WarrantyDate)) errors = [...errors, 'Warranty Date is required'];
// 		if (_.isEmpty(Box)) errors = [...errors, 'Box is required'];
// 		if (_.isEmpty(LinkCount)) errors = [...errors, 'Link Count is required'];


// 		if (!_.isEmpty(errors)) { //If the errors array contains any then escape the function.
// 			return response.json({
// 				status: false,
// 				errors: errors
// 			});
// 		}

// 		// post the post in table posts
// 		const post = await Models.Posts.create({ author: token.id, content: Description, status: "published", type: "inventory" });

// 		if (_.isEmpty(post)) {
// 			return response.json({
// 				status: false,
// 				errors: ['Something went wrong please try again later3']
// 			});
// 		}

// 		const postId = post.id;
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'DealerSKU', meta_value: !_.isEmpty(DealerSKU) ? DealerSKU : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'Status', meta_value: !_.isEmpty(Status) ? Status : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'StatusDetails', meta_value: !_.isEmpty(StatusDetails) ? StatusDetails : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'ReferenceNumber', meta_value: !_.isEmpty(ReferenceNumber) ? ReferenceNumber : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'Brand', meta_value: !_.isEmpty(Brand) ? Brand : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'Series', meta_value: !_.isEmpty(Series) ? Series : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'SerialNumber', meta_value: !_.isEmpty(SerialNumber) ? SerialNumber : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'Condition', meta_value: !_.isEmpty(Condition) ? Condition : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'Dial', meta_value: !_.isEmpty(Dial) ? Dial : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'Bezel', meta_value: !_.isEmpty(Bezel) ? Bezel : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'Bracelet', meta_value: !_.isEmpty(Bracelet) ? Bracelet : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'WarrantyPaper', meta_value: !_.isEmpty(WarrantyPaper) ? WarrantyPaper : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'WarrantyDate', meta_value: !_.isEmpty(WarrantyDate) ? WarrantyDate : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'Box', meta_value: !_.isEmpty(Box) ? Box === "on" ? 'yes' : 'no' : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'LinkCount', meta_value: !_.isEmpty(LinkCount) ? LinkCount : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'AdditionalDetails', meta_value: !_.isEmpty(AdditionalDetails) ? AdditionalDetails : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'MSRPPrice', meta_value: !_.isEmpty(MSRPPrice) ? MSRPPrice : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'MarketplacePrice', meta_value: !_.isEmpty(MarketplacePrice) ? MarketplacePrice : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'Onlineprice', meta_value: !_.isEmpty(Onlineprice) ? Onlineprice : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'Cost', meta_value: !_.isEmpty(Cost) ? Cost : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'DatePurchased', meta_value: !_.isEmpty(DatePurchased) ? DatePurchased : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'Vendor', meta_value: !_.isEmpty(Vendor) ? Vendor : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'Description', meta_value: !_.isEmpty(Description) ? Description : '' });
// 		Models.PostMeta.create({ post_id: postId, meta_key: 'Images', meta_value: !_.isEmpty(Images) ? JSON.stringify(Images) : '' });
// 		if (!_.isEmpty(CustomColumn)) {
// 			CustomColumn.forEach(column => {
// 				Models.PostMeta.create({ post_id: postId, meta_key: column.key, meta_value: column.value });
// 			})
// 		}

// 		Models.PostsSpaceRelationships.create({ space_id: token.spaceId, post_id: postId });

// 		return response.json({
// 			status: true,
// 			data: {
// 				post_id: postId,
// 			},
// 			response: ['Item has been added successfully']
// 		});

// 	} catch (error) {

// 		return response.json({
// 			status: false,
// 			errors: ['Something went wrong please try again later.4']
// 		});

// 	}
// });


// App.post('/inventory/get/inventory', async (request, response, next) => {

// 	try {

// 		const limit = 50;

// 		let { order, orderBy, offset, newColumns } = request.body;
// 		const deviceId = request.headers.deviceid;
// 		let token = request.headers.token;
// 		if (!VerifyToken(token)) {
// 			return response.json({
// 				status: false,
// 				errors: ['Something went wrong please try again later.1']
// 			});
// 		}

// 		token = DecodeToken(token);

// 		if (
// 			_.isUndefined(token.id) ||
// 			_.isUndefined(token.deviceId) ||
// 			token.deviceId != deviceId
// 		) {
// 			return response.json({
// 				status: false,
// 				errors: ['Something went wrong please try again later.']
// 			});
// 		}

// 		//Make sure the current space id belongs to the corrent user scope.
// 		const SpaceUser = await Models.SpaceUser.findOne({
// 			where: {
// 				space_id: token.spaceId,
// 				user_id: token.id
// 			},
// 			raw: true,
// 		});

// 		if (_.isEmpty(SpaceUser) || SpaceUser.space_id !== token.spaceId) {
// 			return response.json({
// 				status: false,
// 				errors: ['Something went wrong please try again later.']
// 			});
// 		}

// 		//Make sure order and order by are specified.
// 		orderBy = orderBy ? orderBy : 'PR.post_id';
// 		order = order ? order : 'DESC';
// 		offset = offset ? Number(offset) : 0;
// 		let sqlColumn1 = ``;
// 		let sqlColumn2 = ``;


// 		if (!_.isUndefined(newColumns)) {
// 			newColumns.forEach(column => {
// 				sqlColumn1 += `${column.key}.meta_value AS '${column.key}', `
// 				sqlColumn2 += `LEFT JOIN PostMeta AS ${column.key} ON ${column.key}.post_id = PR.post_id AND ${column.key}.meta_key = '${column.key}' `
// 			})
// 		}

// 		//Get the posts related to this space.
// 		let sql = ``;
// 		sql += `SELECT `;
// 		sql += `P.*, `;
// 		sql += `PR.space_id,`;
// 		sql += `AdditionalDetails.meta_value AS 'AdditionalDetails', `;
// 		sql += `Bezel.meta_value AS 'Bezel', `;
// 		sql += `Box.meta_value AS 'Box', `;
// 		sql += `Bracelet.meta_value AS 'Bracelet', `;
// 		sql += `Brand.meta_value AS 'Brand', `;
// 		sql += `Condition.meta_value AS 'Condition', `;
// 		sql += `Cost.meta_value AS 'Cost', `;
// 		sql += `DatePurchased.meta_value AS 'DatePurchased', `;
// 		sql += `DealerSKU.meta_value AS 'DealerSKU', `;
// 		sql += `Description.meta_value AS 'Description', `;
// 		sql += `Dial.meta_value AS 'Dial', `;
// 		sql += `Images.meta_value AS 'Images', `;
// 		sql += `LinkCount.meta_value AS 'LinkCount', `;
// 		sql += `MarketplacePrice.meta_value AS 'MarketplacePrice', `;
// 		sql += `MSRPPrice.meta_value AS 'MSRPPrice', `;
// 		sql += `Onlineprice.meta_value AS 'Onlineprice', `;
// 		sql += `ReferenceNumber.meta_value AS 'ReferenceNumber', `;
// 		sql += `SerialNumber.meta_value AS 'SerialNumber', `;
// 		sql += `Series.meta_value AS 'Series', `;
// 		sql += `Status.meta_value AS 'Status', `;
// 		sql += `StatusDetails.meta_value AS 'StatusDetails', `;
// 		sql += `Vendor.meta_value AS 'Vendor', `;
// 		sql += `WarrantyDate.meta_value AS 'WarrantyDate', `;
// 		if ( !_.isEmpty(sqlColumn1) && !_.isEmpty(sqlColumn2) ) sql += sqlColumn1
// 		sql += `WarrantyPaper.meta_value AS 'WarrantyPaper'  `;
// 		sql += `FROM PostsSpaceRelationships AS PR `;
// 		sql += `INNER JOIN Posts AS P ON P.id = PR.post_id `;
// 		sql += `INNER JOIN PostMeta AS AdditionalDetails ON AdditionalDetails.post_id = PR.post_id AND AdditionalDetails.meta_key = 'AdditionalDetails' `;
// 		sql += `INNER JOIN PostMeta AS Bezel ON Bezel.post_id = PR.post_id AND Bezel.meta_key = 'Bezel' `;
// 		sql += `INNER JOIN PostMeta AS Box ON Box.post_id = PR.post_id AND Box.meta_key = 'Box' `;
// 		sql += `INNER JOIN PostMeta AS Bracelet ON Bracelet.post_id = PR.post_id AND Bracelet.meta_key = 'Bracelet' `;
// 		sql += `INNER JOIN PostMeta AS Brand ON Brand.post_id = PR.post_id AND Brand.meta_key = 'Brand' `;
// 		sql += `INNER JOIN PostMeta AS \`Condition\` ON Condition.post_id = PR.post_id AND Condition.meta_key = 'Condition' `;
// 		sql += `INNER JOIN PostMeta AS Cost ON Cost.post_id = PR.post_id AND Cost.meta_key = 'Cost' `;
// 		sql += `INNER JOIN PostMeta AS DatePurchased ON DatePurchased.post_id = PR.post_id AND DatePurchased.meta_key = 'DatePurchased' `;
// 		sql += `INNER JOIN PostMeta AS DealerSKU ON DealerSKU.post_id = PR.post_id AND DealerSKU.meta_key = 'DealerSKU' `;
// 		sql += `INNER JOIN PostMeta AS Description ON Description.post_id = PR.post_id AND Description.meta_key = 'Description' `;
// 		sql += `INNER JOIN PostMeta AS Dial ON Dial.post_id = PR.post_id AND Dial.meta_key = 'Dial' `;
// 		sql += `INNER JOIN PostMeta AS Images ON Images.post_id = PR.post_id AND Images.meta_key = 'Images' `;
// 		sql += `INNER JOIN PostMeta AS LinkCount ON LinkCount.post_id = PR.post_id AND LinkCount.meta_key = 'LinkCount' `;
// 		sql += `INNER JOIN PostMeta AS MarketplacePrice ON MarketplacePrice.post_id = PR.post_id AND MarketplacePrice.meta_key = 'MarketplacePrice' `;
// 		sql += `INNER JOIN PostMeta AS MSRPPrice ON MSRPPrice.post_id = PR.post_id AND MSRPPrice.meta_key = 'MSRPPrice' `;
// 		sql += `INNER JOIN PostMeta AS Onlineprice ON Onlineprice.post_id = PR.post_id AND Onlineprice.meta_key = 'Onlineprice' `;
// 		sql += `INNER JOIN PostMeta AS ReferenceNumber ON ReferenceNumber.post_id = PR.post_id AND ReferenceNumber.meta_key = 'ReferenceNumber' `;
// 		sql += `INNER JOIN PostMeta AS SerialNumber ON SerialNumber.post_id = PR.post_id AND SerialNumber.meta_key = 'SerialNumber' `;
// 		sql += `INNER JOIN PostMeta AS Series ON Series.post_id = PR.post_id AND Series.meta_key = 'Series'  `;
// 		sql += `INNER JOIN PostMeta AS Status ON Status.post_id = PR.post_id AND Status.meta_key = 'Status'  `;
// 		sql += `INNER JOIN PostMeta AS StatusDetails ON StatusDetails.post_id = PR.post_id AND StatusDetails.meta_key = 'StatusDetails'  `;
// 		sql += `INNER JOIN PostMeta AS Vendor ON Vendor.post_id = PR.post_id AND Vendor.meta_key = 'Vendor' `;
// 		sql += `INNER JOIN PostMeta AS WarrantyDate ON WarrantyDate.post_id = PR.post_id AND WarrantyDate.meta_key = 'WarrantyDate' `;
// 		sql += `INNER JOIN PostMeta AS WarrantyPaper ON WarrantyPaper.post_id = PR.post_id AND WarrantyPaper.meta_key = 'WarrantyPaper' `;
// 		if ( !_.isEmpty(sqlColumn1) && !_.isEmpty(sqlColumn2) ) sql += sqlColumn2
// 		sql += `WHERE PR.space_id = '${SpaceUser.space_id}' `;
// 		sql += `ORDER BY ${orderBy} ${order} `;
// 		sql += `LIMIT ${limit} `;
// 		sql += `OFFSET ${offset} `;


// 		const posts = await sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT });
// 		console.log(posts)
// 		return response.json({
// 			status: true,
// 			posts: posts
// 		});

// 	} catch (error) {
// 		console.log(error)
// 		return response.json({
// 			status: false,
// 			errors: ['Something went wrong please try again later.2']
// 		});

// 	}
// });


// App.get('/media/assets/pictures/:id', async (request, response, next) => {
// 	const { id } = request.params;
// 	const post = await Models.Posts.findOne({ where: { id } });

// 	if (post && post.title) {
// 		const _fileLocation = Path.join(Path.join(__dirname, uploadDir), post.title);
// 		return response.sendFile(_fileLocation);
// 	}

// 	return response.send('404');

// });

// App.post('/user/current/profile', async (request, response, next) => {

// 	try {

// 		const deviceId = request.headers.deviceid;
// 		let token = request.headers.token;
// 		if (!VerifyToken(token)) {
// 			return response.json({
// 				status: false,
// 				errors: ['Something went wrong please try again later.']
// 			});
// 		}

// 		token = DecodeToken(token);

// 		if (
// 			_.isUndefined(token.id) ||
// 			_.isUndefined(token.deviceId) ||
// 			token.deviceId != deviceId
// 		) {
// 			return response.json({
// 				status: false,
// 				errors: ['Something went wrong please try again later.']
// 			});
// 		}

// 		const user = await Models.User.findOne({
// 			where: {
// 				id: token.id
// 			},
// 			include: [{
// 				model: Models.UserMeta,
// 			}]
// 		}).then(res => res.get());

// 		delete user.user_pass;

// 		//Assign space ID to the request.
// 		if (token.spaceId) {
// 			const space = await Models.Space.findOne({
// 				where: {
// 					id: token.spaceId,
// 				},
// 				include: [{
// 					model: Models.SpaceMeta,
// 				}]
// 			});

// 			if (space) {
// 				user.space = space;
// 			}
// 		}

// 		return response.json({
// 			status: true,
// 			profile: user
// 		});

// 	} catch (error) {
// 		return response.json({
// 			status: false,
// 			errors: ['Something went wrong please try again later.']
// 		});

// 	}
// });


// App.post('/user/space/add/user', (request, response, next) => {

// 	try {

// 		const { email, role } = request.body.data;
// 		const deviceId = request.headers.deviceid;
// 		let token = request.headers.token;

// 		//Make sure the current space belongs to the current user.
// 		if (!VerifyToken(token)) {
// 			return response.json({
// 				status: false,
// 				errors: ['Something went wrong please try again later.1']
// 			});
// 		}

// 		token = DecodeToken(token);

// 		return response.json({
// 			status: true,
// 		});


// 	} catch (error) {
// 		response.status(400).json({
// 			status: false,
// 			errors: "Something went wrong please try again later.",
// 		});
// 	}

// });

// App.post('/user/inventory/save/custom/columns', async (request, response, next) => {

// 	try {
// 		const { title, key } = request.body;

// 		const deviceId = request.headers.deviceid;
// 		let token = request.headers.token;

// 		//Make sure the current space belongs to the current user.
// 		if (!VerifyToken(token)) {
// 			return response.json({
// 				status: false,
// 				errors: ['Something went wrong please try again later.1']
// 			});
// 		}

// 		token = DecodeToken(token);

// 		const { spaceId, id } = token;

// 		if (!spaceId || !id) {
// 			return response.status(400).json({
// 				status: false,
// 				errors: "Something went wrong please try again later2.",
// 			});
// 		}

// 		const columnObject = [{
// 			space_id: spaceId,
// 			columns: [{
// 				key: key,
// 				title: title,
// 			}],
// 		}];

// 		await Models.UserMeta.findOrCreate({
// 			where: {
// 				meta_key: 'inventory_custom_columns',
// 				user_id: id,
// 			},
// 			defaults: {
// 				meta_value: JSON.stringify(columnObject),
// 			}
// 		}).then(([result, created]) => {

// 			try {
// 				if (created) {//If this is the first time the meta key get created.
// 					result.setDataValue('meta_value', JSON.stringify(columnObject));
// 					result.save();
// 					return response.json({
// 						status: true,
// 						columnObject,
// 					});
// 				}

// 				//Otherwise parse the value to JSON and push the new column if it doesn't exist.
// 				let customColumns = !_.isEmpty(result.get('meta_value')) ? JSON.parse(result.get('meta_value')) : [];

// 				//Check if the column already exist.
// 				let customColumnsSpace = customColumns.filter(c => c.space_id === spaceId);
// 				if (_.isEmpty(customColumnsSpace)) {
// 					customColumns.push({
// 						space_id: spaceId,
// 						columns: [],
// 					});
// 					customColumnsSpace = [...customColumnsSpace, ...customColumns]
// 				}


// 				customColumnsSpace = _.head(customColumnsSpace);
// 				const isExist = !_.isEmpty(customColumnsSpace.columns.filter(c => c.key === key));

// 				if (isExist) {
// 					return response.status(400).json({
// 						status: false,
// 						errors: "The custom column you are trying to add already exists.",
// 					});
// 				}



// 				customColumns = customColumns.map(c => {

// 					if (c.space_id === spaceId) {
// 						c.columns = [{ key: key, title: title }].concat(c.columns)
// 					}

// 					return c;
// 				});

// 				result.setDataValue('meta_value', JSON.stringify(customColumns));
// 				result.save();

// 				return response.json({
// 					status: true,
// 					customColumns,
// 				});


// 			} catch (error) {
// 				console.log(error)
// 				return response.status(400).json({
// 					status: false,
// 					errors: "Something went wrong please try again later3.",
// 				});
// 			}

// 		}).catch((err) => console.log(err))



// 	} catch (error) {
// 		console.log(error)
// 		return response.status(400).json({
// 			status: false,
// 			errors: "Something went wrong please try again later4.",
// 		});
// 	}

// });

// App.post('/user/inventory/save/columns', async (request, response, next) => {

// 	try {

// 		let columnsArrangment = request.body;
// 		const deviceId = request.headers.deviceid;
// 		let token = request.headers.token;

// 		//Make sure the current space belongs to the current user.
// 		if (!VerifyToken(token)) {
// 			return response.json({
// 				status: false,
// 				errors: ['Something went wrong please try again later.1']
// 			});
// 		}

// 		token = DecodeToken(token);

// 		const { spaceId, id } = token;

// 		if (!spaceId || !id) {
// 			return response.status(400).json({
// 				status: false,
// 				errors: "Something went wrong please try again later.",
// 			});
// 		}

// 		await Models.UserMeta.findOrCreate({
// 			where: {
// 				meta_key: 'inventory_arranged_columns',
// 				user_id: id,
// 			}
// 		}).then(([result, created]) => {

// 			try {

// 				let columnObject = [{
// 					space_id: spaceId,
// 					columns: columnsArrangment,
// 				}];

// 				if (created) {//If this is the first time the meta key get created.
// 					columnObject = !_.isEmpty(columnObject) ? JSON.stringify(columnObject) : [];
// 					result.setDataValue('meta_value', columnObject);
// 					result.save();
// 					return response.json({
// 						status: true,
// 						columnObject,
// 					});
// 				}

// 				//Otherwise parse the value to JSON and push the new column if it doesn't exist.
// 				let customColumns = !_.isEmpty(result.get('meta_value')) ? JSON.parse(result.get('meta_value')) : [];

// 				// check if the space exists.
// 				let customColumnsSpace = customColumns.filter(c => c.space_id === spaceId);
// 				if (_.isEmpty(customColumnsSpace)) {
// 					customColumns.push({
// 						space_id: spaceId,
// 						columns: [],
// 					})
// 				}

// 				customColumns = customColumns.map(c => {
// 					if (c.space_id === spaceId) {
// 						c.columns = columnsArrangment;
// 					}
// 					return c;
// 				});

// 				result.setDataValue('meta_value', JSON.stringify(customColumns));
// 				result.save();

// 				return response.json({
// 					status: true,
// 					customColumns,
// 				});


// 			} catch (error) {
// 				return response.status(400).json({
// 					status: false,
// 					errors: "Something went wrong please try again later.",
// 				});
// 			}
// 		})


// 	} catch (error) {

// 		return response.status(400).json({
// 			status: false,
// 			errors: "Something went wrong please try again later.",
// 		});
// 	}

// });

// App.post('/user/signup', async (request, response, next) => {

// 	try {

// 		const { data } = request.body;
// 		const deviceId = request.headers.deviceid;


// 		let errors = [];

// 		const { company_name, name, company_address, city, state, zip_code, country, phone, email, website, certificate, password } = data;

// 		//Validate all the data coming through.
// 		if (_.isEmpty(company_name)) errors = [...errors, 'Company name is reqiured'];
// 		if (_.isEmpty(name)) errors = [...errors, 'Please fill in your name'];
// 		if (_.isEmpty(company_address)) errors = [...errors, 'Company address is reqiured'];
// 		if (_.isEmpty(city)) errors = [...errors, 'Company city is reqiured'];
// 		if (_.isEmpty(state)) errors = [...errors, 'Company state is reqiured'];
// 		if (_.isEmpty(zip_code)) errors = [...errors, 'Company zip code is reqiured'];
// 		if (_.isEmpty(country)) errors = [...errors, 'Company country is reqiured'];
// 		if (_.isEmpty(phone)) errors = [...errors, 'Company phone is reqiured'];
// 		if (_.isEmpty(password) || password.length < 6) errors = [...errors, 'Invalid password'];
// 		if (_.isEmpty(email) || !validateEmail(email)) errors = [...errors, 'Company email is reqiured'];
// 		if (_.isEmpty(certificate)) errors = [...errors, 'Certificate is reqiured'];

// 		if (!_.isEmpty(errors)) { //If the errors array contains any then escape the function.
// 			return {
// 				status: false,
// 				errors: errors
// 			};
// 		}

// 		//Check if the email address been registered.
// 		const user = await Models.User.findOne({
// 			where: {
// 				user_email: email
// 			}
// 		});

// 		if (user) {
// 			return response.json({
// 				status: false,
// 				errors: ['An account with the email ${email} already exists.']
// 			});
// 		}

// 		HashPassword(password, async (hashError, hash) => {

// 			if (hashError) {
// 				return {
// 					status: false,
// 					errors: ['Something went wrong please try again later.']
// 				};
// 			}


// 			//Create a user.
// 			let registredUser = await Models.User.create({
// 				'user_email': email,
// 				'user_pass': hash,
// 				'user_status': false,
// 				'user_active': true,
// 			}).then(res => res);

// 			let _user = {};
// 			_user.id = registredUser.id;
// 			_user.user_email = registredUser.user_email;
// 			_user.deviceId = deviceId;

// 			//Create all the meta data for the registered user.
// 			Models.UserMeta.create({
// 				user_id: _user.id,
// 				meta_key: 'name',
// 				meta_value: name,
// 			});

// 			//Create a space.
// 			const space = await Models.Space.create({
// 				name: company_name,
// 				slug: global.AppData.safeString(company_name),
// 				status: true,
// 			})

// 			//Create space metas.
// 			Models.SpaceMeta.create({ space_id: space.id, meta_key: 'company_address', meta_value: !_.isEmpty(company_address) ? company_address : '' });
// 			Models.SpaceMeta.create({ space_id: space.id, meta_key: 'city', meta_value: !_.isEmpty(city) ? city : '' });
// 			Models.SpaceMeta.create({ space_id: space.id, meta_key: 'state', meta_value: !_.isEmpty(state) ? state : '' });
// 			Models.SpaceMeta.create({ space_id: space.id, meta_key: 'zip_code', meta_value: !_.isEmpty(zip_code) ? zip_code : '' });
// 			Models.SpaceMeta.create({ space_id: space.id, meta_key: 'country', meta_value: !_.isEmpty(country) ? country : '' });
// 			Models.SpaceMeta.create({ space_id: space.id, meta_key: 'phone', meta_value: !_.isEmpty(phone) ? phone : '' });
// 			Models.SpaceMeta.create({ space_id: space.id, meta_key: 'email', meta_value: !_.isEmpty(email) ? email : '' });
// 			Models.SpaceMeta.create({ space_id: space.id, meta_key: 'website', meta_value: !_.isEmpty(website) ? website : '' });
// 			Models.SpaceMeta.create({ space_id: space.id, meta_key: 'certificate', meta_value: !_.isEmpty(certificate) ? certificate : '' });
// 			//Assign the user to the newly created space.
// 			Models.SpaceUser.create({ space_id: space.id, user_id: _user.id, is_owner: true, });


// 			//Get the role created for the owner.
// 			const ownerId = await Models.Capabilities.findOne({ where: { slug: 'owner' }, raw: true, plain: true, attributes: ['id'] });
// 			Models.UserRole.create({ user_id: _user.id, role_id: ownerId.id, space_id: space.id, })

// 			//Send a confirmation email to the newly created account.


// 			_user.space_id = space.id;
// 			const token = CreateToken(_user);

// 			return response.json({
// 				status: true,
// 				token: token,
// 			});

// 		});


// 	} catch (error) {
// 		console.log(error);
// 		return response.status(400).json({
// 			status: false,
// 			errors: ['Something went wrong please try again later.']
// 		});

// 	}

// });

// App.post('/user/signin', async (request, response, next) => 
// });


App.get('**', (request, response) => {
	// response.send({status: true});
});


Models.sequelize.sync().then(() => {
	const pid = process.pid;
	const server = App.listen(port, () => console.log('\x1b[44m', `Server is run on port ${port} & PID ${pid} is ready...`, '\x1b[0m'));
	// Sockets.register(server);

	// //Create media folder if none exists.
	// if (!Fs.existsSync('./media')) Fs.mkdirSync('./media', { recursive: true });
})
