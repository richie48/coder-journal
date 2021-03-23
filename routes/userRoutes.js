const express = require('express');

const { getUsers, deleteUser, getUser } = require('../controllers/user');

router = express.Router();

router.route('/').get(getUsers);
router.route('/:id').delete(deleteUser).get(getUser);

module.exports = router;
