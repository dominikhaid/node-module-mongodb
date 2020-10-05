const express = require('express');
const router = express.Router();
const auth = require('../mongoose/db/db');

const checkReqErrors = require('../includes/status').checkReqErrors;
const usersQuery = require('../mongoose/querys/querys');

router.get('/fans', (req, res) => {
  if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
    auth()
      .then(con => {
        usersQuery.findOne(con, req).then(erg => {
          // con.close();
          checkReqErrors(erg, res);
        });
      })
      .catch(err => {
        checkReqErrors({error: 'Something went wrong', err: err}, res);
      });
  } else {
    auth()
      .then(con => {
        usersQuery.find(con, req).then(erg => {
          // con.close();
          checkReqErrors(erg, res);
        });
      })
      .catch(err => {
        checkReqErrors({error: 'Something went wrong', err: err}, res);
      });
  }
});

router.post('/fans', (req, res) => {
  auth()
    .then(con => {
      usersQuery.createOne(con, req).then(erg => {
        checkReqErrors(erg, res);
      });
    })
    .catch(err => {
      checkReqErrors(err, res);
    });
});

router.delete('/fans', (req, res) => {
  auth()
    .then(con => {
      usersQuery.deleteOne(con, req).then(erg => {
        // con.close();
        checkReqErrors(erg, res);
      });
    })
    .catch(err => {
      checkReqErrors(err, res);
    });
});

router.patch('/fans', (req, res) => {
  auth()
    .then(con => {
      usersQuery.updateOne(con, req).then(erg => {
        // con.close();
        checkReqErrors(erg, res);
      });
    })
    .catch(err => {
      checkReqErrors(err, res);
    });
});

router.get('/fans/search', (req, res) => {
  auth()
    .then(con => {
      usersQuery.searchOne(con, req).then(erg => {
        // con.close();
        checkReqErrors(erg, res);
      });
    })
    .catch(err => {
      checkReqErrors({error: 'Something went wrong', err: err}, res);
    });
});

router.get('/fans/:id', (req, res) => {
  auth()
    .then(con => {
      usersQuery.findOne(con, req).then(erg => {
        // con.close();
        checkReqErrors(erg, res);
      });
    })
    .catch(err => {
      checkReqErrors({error: 'Something went wrong', err: err}, res);
    });
});

router.get('/fans/search/:fan_email', (req, res) => {
  auth()
    .then(con => {
      usersQuery.searchOne(con, req).then(erg => {
        // con.close();
        checkReqErrors(erg, res);
      });
    })
    .catch(err => {
      checkReqErrors({error: 'Something went wrong', err: err}, res);
    });
});

router.post('/fans/:fan_email', (req, res) => {
  auth()
    .then(con => {
      usersQuery.createOne(con, req).then(erg => {
        checkReqErrors(erg, res);
      });
    })
    .catch(err => {
      checkReqErrors(err, res);
    });
});

router.delete('/fans/:fan_email', (req, res) => {
  auth()
    .then(con => {
      usersQuery.deleteOne(con, req).then(erg => {
        // con.close();
        checkReqErrors(erg, res);
      });
    })
    .catch(err => {
      checkReqErrors(err, res);
    });
});

router.patch('/fans/:fan_email', (req, res) => {
  auth()
    .then(con => {
      usersQuery.updateOne(con, req).then(erg => {
        // con.close();
        checkReqErrors(erg, res);
      });
    })
    .catch(err => {
      checkReqErrors(err, res);
    });
});
module.exports = router;
