const express = require("express");
const router = express.Router();
const auth = require("../mongoose/db/db");

const checkReqErrors = require("../includes/status").checkReqErrors;
const usersQuery = require("../mongoose/querys/querys");

router.get("/authors", (req, res) => {
	auth()
		.then((con) => {
			let data = "person";
			usersQuery.find(con, data).then((erg) => {
				con.close();
				checkReqErrors({ msg: "Found Authors", result: erg }, res);
			});
		})
		.catch((err) => {
			checkReqErrors({ error: "Something went wrong", err: err }, res);
		});
});

router.get("/authors/search", (req, res) => {
	if (!req.body.author_name)
		checkReqErrors({ error: 5, err: "required:name" }, res);
	auth()
		.then((con) => {
			let data = { person: { name: decodeURIComponent(req.body.author_name) } };

			usersQuery.searchOne(con, data).then((erg) => {
				con.close();
				checkReqErrors({ msg: "Found Authors", result: erg }, res);
			});
		})
		.catch((err) => {
			checkReqErrors({ error: "Something went wrong", err: err }, res);
		});
});

router.get("/authors/:id", (req, res) => {
	if (!req.params.id) checkReqErrors({ error: 5, err: "required:id" }, res);
	auth()
		.then((con) => {
			let data = { person: { _id: decodeURIComponent(req.params.id) } };

			usersQuery.findOne(con, data).then((erg) => {
				con.close();
				checkReqErrors({ msg: "Found Authors", result: erg }, res);
			});
		})
		.catch((err) => {
			checkReqErrors({ error: "Something went wrong", err: err }, res);
		});
});

router.get("/authors/search/:author_name", (req, res) => {
	if (!req.params.author_name)
		checkReqErrors({ error: 5, err: "required:name" }, res);
	auth()
		.then((con) => {
			let data = {
				person: { name: decodeURIComponent(req.params.author_name) },
			};

			usersQuery.searchOne(con, data).then((erg) => {
				con.close();
				checkReqErrors({ msg: "Found Authors", result: erg }, res);
			});
		})
		.catch((err) => {
			checkReqErrors({ error: "Something went wrong", err: err }, res);
		});
});

router.post("/authors/:author_name", (req, res) => {
	if (
		(!req.params.author_name &&
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
});

router.delete("/authors/:author_name", (req, res) => {
	if (!req.params.author_name)
		checkReqErrors({ error: 5, err: "required:author name" }, res);
	auth()
		.then((con) => {
			let data = {
				person: { name: decodeURIComponent(req.params.author_name) },
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

router.patch("/authors/:author_name", (req, res) => {
	if (!req.body.author_age && !req.body.author_name)
		checkReqErrors({ error: 5, err: "required:name" }, res);

	auth()
		.then((con) => {
			let condition = {
				name: decodeURIComponent(
					req.params.author_name ? req.params.author_name : req.body.author_name
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
});

router.get("/", (req, res) => {
	auth()
		.then((con) => {
			// con.close();
			checkReqErrors({ msg: "Server alive" }, res);
		})
		.catch((err) => {
			checkReqErrors({ error: "Server down", err: err }, res);
		});
});

module.exports = router;
