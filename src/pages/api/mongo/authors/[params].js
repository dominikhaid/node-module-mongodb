const auth = require("../../../../mongoose/db/db");
const checkReqErrors = require("@/includes/status").checkReqErrors;
const usersQuery = require("../../../../mongoose/querys/querys");


export default (req, res) => {
	if (req.method === "GET") {
		if (!req.query.params) checkReqErrors({ error: 5, err: "required:id" }, res);
		auth()
			.then((con) => {
				let data = { person: { _id: decodeURIComponent(req.query.params) } };

				usersQuery.findOne(con, data).then((erg) => {
					con.close();
					checkReqErrors({ msg: "Found Users", result: erg }, res);
				});
			})
			.catch((err) => {
				checkReqErrors({ error: "Something went wrong", err: err }, res);
			});
	} else if (req.method === "DELETE") {
		if (!req.query.params)
			checkReqErrors({ error: 5, err: "required:author name" }, res);
		auth()
			.then((con) => {
				let data = {
					person: { name: decodeURIComponent(req.query.params) },
				};

				usersQuery.deleteOne(con, data).then((erg) => {
					con.close();
					checkReqErrors(erg, res);
				});
			})
			.catch((err) => {
				checkReqErrors(err, res);
			});
	} else if (req.method === "POST") {
		if (
			(!req.query.params &&
				!req.body.author_name &&
				!req.body.author_age) ||
			!req.body.author_name
		)
			checkReqErrors({ error: 5, err: "required:name" }, res);
		auth()
			.then((con) => {
				let data = {
					person: {
						name: req.body.author_name,
						age: req.body.author_age,
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
		if (!req.body.author_age && !req.body.author_name)
			checkReqErrors({ error: 5, err: "required:name" }, res);

		auth()
			.then((con) => {
				let condition = {
					name: decodeURIComponent(
						req.query.params ? req.query.params : req.body.author_name
					),
				};

				let data = { person: {} };

				if (req.body.author_name)
					data.person.name = decodeURIComponent(req.body.author_name);

				if (req.body.author_age)
					data.person.age = Number(decodeURIComponent(req.body.author_age));

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
