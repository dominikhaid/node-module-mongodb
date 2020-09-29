const express = require("express");
const router = express.Router();
const auth = require("../mongoose/db/db");

const checkReqErrors = require("../includes/status").checkReqErrors;
const usersQuery = require("../mongoose/querys/querys");

router.get("/fans", (req, res) => {
	auth()
		.then((con) => {
			let data = "fans";
			usersQuery.find(con, data).then((erg) => {
				con.close();
				checkReqErrors({ msg: "Found Fanss", result: erg }, res);
			});
		})
		.catch((err) => {
			checkReqErrors({ error: "Something went wrong", err: err }, res);
		});
});

router.get("/fans/search", (req, res) => {
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
});

router.get("/fans/:id", (req, res) => {
	if (!req.params.id)
		checkReqErrors({ error: 5, err: "required: id" }, res);
	auth()
		.then((con) => {
			let data = { fan: { _id: decodeURIComponent(req.params.id) } };

			usersQuery.findOne(con, data).then((erg) => {
				con.close();
				checkReqErrors({ msg: "Found Fanss", result: erg }, res);
			});
		})
		.catch((err) => {
			checkReqErrors({ error: "Something went wrong", err: err }, res);
		});
});

router.get("/fans/search/:fan_email", (req, res) => {
	if (!req.params.fan_email)
		checkReqErrors({ error: 5, err: "required:email" }, res);
	auth()
		.then((con) => {
			let data = { fan: { email: decodeURIComponent(req.params.fan_email) } };

			usersQuery.searchOne(con, data).then((erg) => {
				con.close();
				checkReqErrors({ msg: "Found Fanss", result: erg }, res);
			});
		})
		.catch((err) => {
			checkReqErrors({ error: "Something went wrong", err: err }, res);
		});
});

router.post("/fans/:fan_email", (req, res) => {
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
});

router.delete("/fans/:fan_email", (req, res) => {
	if (!req.params.fan_email)
		checkReqErrors({ error: 5, err: "required:fan email" }, res);
	auth()
		.then((con) => {
			let data = { fan: { email: decodeURIComponent(req.params.fan_email) } };

			usersQuery.deleteOne(con, data).then((erg) => {
				con.close();
				checkReqErrors(erg, res);
			});
		})
		.catch((err) => {
			checkReqErrors(err, res);
		});
});

router.patch("/fans/:fan_email", (req, res) => {
	if (!req.body.fan_email && !req.body.fan_name)
		checkReqErrors({ error: 5, err: "required:email" }, res);
	auth()
		.then((con) => {
			let condition = {
				email: decodeURIComponent(
					req.params.fan_email ? req.params.fan_email : req.body.fan_email
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
});

module.exports = router;
