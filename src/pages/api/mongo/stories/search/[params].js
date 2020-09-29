const auth = require("../../../../../mongoose/db/db");
const checkReqErrors = require("@/includes/status").checkReqErrors;
const usersQuery = require("../../../../../mongoose/querys/querys");


export default (req, res) => {
	if (req.method === "GET") {
		if (!req.query.params)
	checkReqErrors({ error: 5, err: "required:storie title" }, res);
	auth()
		.then((con) => {
			let data = {
				story: { title: decodeURIComponent(req.query.params) },
			};

			usersQuery.searchOne(con, data).then((erg) => {
				con.close();
				checkReqErrors({ msg: "Found Stories", result: erg }, res);
			});
		})
		.catch((err) => {
			checkReqErrors({ error: "Something went wrong", err: err }, res);
		});
	};
}
export const config = {
	api: {
		externalResolver: true,
		bodyParser: false,
	},
};
