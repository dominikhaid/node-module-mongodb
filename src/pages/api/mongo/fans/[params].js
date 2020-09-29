const auth = require("../../../../mongoose/db/db");
const checkReqErrors = require("@/includes/status").checkReqErrors;
const usersQuery = require("../../../../mongoose/querys/querys");


export default (req, res) => {
	if (req.method === "GET") {
		if (!req.query.params)
			checkReqErrors({ error: 5, err: "required: id" }, res);
	auth()
		.then((con) => {
			let data = { fan: { _id: decodeURIComponent(req.query.params) } };

			usersQuery.findOne(con, data).then((erg) => {
				con.close();
				checkReqErrors({ msg: "Found Fanss", result: erg }, res);
			});
		})
		.catch((err) => {
			checkReqErrors({ error: "Something went wrong", err: err }, res);
		});
	} else if (req.method === "DELETE") {
		if (!req.query.params)
		checkReqErrors({ error: 5, err: "required:fan email" }, res);
	auth()
		.then((con) => {
			let data = { fan: { email: decodeURIComponent(req.query.params) } };

			usersQuery.deleteOne(con, data).then((erg) => {
				con.close();
				checkReqErrors(erg, res);
			});
		})
		.catch((err) => {
			checkReqErrors(err, res);
		});
	} else if (req.method === "POST") {
		if (!req.params.fan_email && !req.body.fan_email)
		checkReqErrors({ error: 5, err: "required:email" }, res);
	auth()
		.then((con) => {
			let data = {
				fan: {
					email: req.body.fan_email,
					name: req.body.fan_name,
				},
			};
			usersQuery.createOne(con, data).then((erg) => {
				checkReqErrors(erg, res);
			});
		})
		.catch((err) => {
			checkReqErrors(err, res);
		});
	} else if (req.method === "PATCH") {
		if (!req.body.fan_name && !req.body.fan_email)
			checkReqErrors({ error: 5, err: "required:email" }, res);
	auth()
		.then((con) => {
			let condition = {
				email: decodeURIComponent(
					req.query.params ? req.query.params : req.body.fan_email
				),
			};

			let data = { fan: {} };

			if (req.body.fan_name)
				data.fan.name = decodeURIComponent(req.body.fan_name);

			if (req.body.fan_email)
				data.fan.email = decodeURIComponent(req.body.fan_email);

			usersQuery.updateOne(con, condition, data).then((erg) => {
				con.close();
				checkReqErrors(erg, res);
			});
		})
		.catch((err) => {
			checkReqErrors(err, res);
		});
	};
}

export const config = {
	api: {
		externalResolver: true,
		bodyParser: false,
	},
};
