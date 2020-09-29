const auth = require("../../../../../mongoose/db/db");
const checkReqErrors = require("@/includes/status").checkReqErrors;
const usersQuery = require("../../../../../mongoose/querys/querys");


export default (req, res) => {
	if (req.method === "GET") {
		if (!req.body.fan_email)
		checkReqErrors({ error: 5, err: "required:email" }, res);
	auth()
		.then((con) => {
			let data = { fan: { email: decodeURIComponent(req.body.fan_email) } };

			usersQuery.searchOne(con, data).then((erg) => {
				con.close();
				checkReqErrors({ msg: "Found Fanss", result: erg }, res);
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
