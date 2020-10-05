const express = require('express');
const router = express.Router();
const auth = require('../mongoose/db/db');

const checkReqErrors = require('../includes/status').checkReqErrors;
const usersQuery = require('../mongoose/querys/querys');

router.get('/stories', (req, res) => {
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

router.post('/stories', (req, res) => {
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

router.delete('/stories', (req, res) => {
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

router.patch('/stories', (req, res) => {
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

router.get('/stories/search', (req, res) => {
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

router.get('/stories/:id', (req, res) => {
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

router.get('/stories/search/:story_title', (req, res) => {
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

router.post('/stories/:story_title', (req, res) => {
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

router.delete('/stories/:story_title', (req, res) => {
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

router.patch('/stories/:story_title', (req, res) => {
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
