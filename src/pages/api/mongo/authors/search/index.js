const auth = require("../../../../../mongoose/db/db");
const checkReqErrors = require("@/includes/status").checkReqErrors;
const usersQuery = require("../../../../../mongoose/querys/querys");



export default (req, res) => {
	if (req.method === "GET") {
		if (!req.body.author_name)
			checkReqErrors({ error: 5, err: "required:name" }, res);
		auth()
			.then((con) => {
				let data = { person: { name: decodeURIComponent(req.body.author_name) } };

				usersQuery.searchOne(con, data).then((erg) => {
					con.close();
					checkReqErrors({ msg: "Found Users", result: erg }, res);
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
