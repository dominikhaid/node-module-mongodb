const auth = require("../../../../../mongoose/db/db");
const checkReqErrors = require("@/includes/status").checkReqErrors;
const usersQuery = require("../../../../../mongoose/querys/querys");

export default (req, res) => {
	if (req.method === "GET") {
		if (!req.body.story_title)
		checkReqErrors({ error: 5, err: "required:storie email" }, res);
	auth()
		.then((con) => {
			let data = { story: { title: decodeURIComponent(req.body.story_title) } };

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
