const auth = require("../../../../mongoose/db/db");
const checkReqErrors = require("@/includes/status").checkReqErrors;
const usersQuery = require("../../../../mongoose/querys/querys");

export default (req, res) => {
	if (req.method === "GET") {
		if (!req.query.params)
			checkReqErrors({ error: 5, err: "required:storie id" }, res);
	auth()
		.then((con) => {
			let data = { story: { _id: decodeURIComponent(req.params.id) } };

			usersQuery.findOne(con, data).then((erg) => {
				con.close();
				checkReqErrors({ msg: "Found Stories", result: erg }, res);
			});
		})
		.catch((err) => {
			checkReqErrors({ error: "Something went wrong", err: err }, res);
		});
	} else if (req.method === "DELETE") {

	if (!req.query.params)
		checkReqErrors({ error: 5, err: "required:storie title" }, res);
	auth()
		.then((con) => {
			let data = {
				story: { title: decodeURIComponent(req.query.params) },
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
			(!req.query.params)
		)
			checkReqErrors({ error: 5, err: "required:story title" }, res);
	auth()
		.then((con) => {
			let data = {
				story: {
					title: req.body.story_title,
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

		if (!req.body.story_title)
			checkReqErrors({ error: 5, err: "required:title" }, res);
	auth()
		.then((con) => {
			let condition = { title: decodeURIComponent(req.query.params) };

			let data = { story: {} };


			if (req.body.story_title)
				data.story.title = decodeURIComponent(req.body.story_title);

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
