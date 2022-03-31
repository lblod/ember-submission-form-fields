'use strict';

const crypto = require('crypto');

module.exports = function (app) {
  const express = require('express');
  let caseNumberGeneratorRouter = express.Router();

  // Basic mock for the case-number-service micro service: https://github.com/lblod/case-number-service
  // This mock is needed to make the case-number field work as expected in the test app.
  caseNumberGeneratorRouter.post('/generate', function (req, res) {
    const prefix = req.query && req.query.prefix;

    return res
      .status(200)
      .set('content-type', 'application/json')
      .send([generate({ prefix })]);
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/case-number-generator', require('body-parser').json());
  app.use('/case-number-generator', caseNumberGeneratorRouter);
};

const CASE_NUMBER_ID_LENGTH = 6;

function generate({ prefix = '' }) {
  const byteLength = Math.ceil(CASE_NUMBER_ID_LENGTH / 2);
  const id = crypto
    .randomBytes(byteLength)
    .toString('hex')
    .toUpperCase()
    .substring(0, CASE_NUMBER_ID_LENGTH);
  let number = `${prefix}${id}`;

  return number;
}
