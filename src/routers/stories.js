const express = require("express");
const router = express.Router();
const auth = require("../mongoose/db/db");

const checkReqErrors = require("../includes/status").checkReqErrors;
const usersQuery = require("../mongoose/querys/querys");

router.get("/stories", (req, res) => {
	auth()
		.then((con) => {
			let data = "stories";
			usersQuery.find(con, data).then((erg) => {
				con.close();
				checkReqErrors({ msg: "Found Stories", result: erg }, res);
			});
		})
		.catch((err) => {
			checkReqErrors({ error: "Something went wrong", err: err }, res);
		});
});

router.get("/stories/search", (req, res) => {
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
});

router.get("/stories/:id", (req, res) => {
	if (!req.params.id)
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
});

router.get("/stories/search/:story_title", (req, res) => {
	if (!req.params.story_title)
		checkReqErrors({ error: 5, err: "required:storie title" }, res);
	auth()
		.then((con) => {
			let data = {
				story: { title: decodeURIComponent(req.params.story_title) },
			};

			usersQuery.searchOne(con, data).then((erg) => {
				con.close();
				checkReqErrors({ msg: "Found Stories", result: erg }, res);
			});
		})
		.catch((err) => {
			checkReqErrors({ error: "Something went wrong", err: err }, res);
		});
});

router.post("/stories/:story_title", (req, res) => {
	if (!req.params.story_title)
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
});

router.delete("/stories/:story_title", (req, res) => {
	if (!req.params.story_title)
		checkReqErrors({ error: 5, err: "required:storie title" }, res);
	auth()
		.then((con) => {
			let data = {
				story: { title: decodeURIComponent(req.params.story_title) },
			};

			usersQuery.deleteOne(con, data).then((erg) => {
				con.close();
				checkReqErrors(erg, res);
			});
		})
		.catch((err) => {
			checkReqErrors(err, res);
		});
});

router.patch("/stories/:story_title", (req, res) => {
	if (!req.params.story_title || !req.body.story_title)
		checkReqErrors({ error: 5, err: "required:title" }, res);
	auth()
		.then((con) => {
			let condition = { title: decodeURIComponent(req.params.story_title) };

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
});

module.exports = router;
