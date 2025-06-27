const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/authenticate');

router.use(auth);
