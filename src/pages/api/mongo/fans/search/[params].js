const auth = require('../../../../../mongoose/db/db');
const checkReqErrors = require('@/includes/status').checkReqErrors;
const usersQuery = require('../../../../../mongoose/querys/querys');

export default (req, res) => {
  if (req.method === 'GET') {
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
  }
};
export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};
