const auth = require('../../../../mongoose/db/db');
const checkReqErrors = require('@/includes/status').checkReqErrors;
const usersQuery = require('../../../../mongoose/querys/querys');

export default (req, res) => {
  if (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0) {
    if (req.method === 'GET') {
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
    } else if (req.method === 'DELETE') {
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
    } else if (req.method === 'POST') {
      auth()
        .then(con => {
          usersQuery.createOne(con, req).then(erg => {
            checkReqErrors(erg, res);
          });
        })
        .catch(err => {
          checkReqErrors(err, res);
        });
    } else if (req.method === 'PATCH') {
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
    }
  } else {
    if (req.method === 'GET') {
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
  }
};

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};
