const express = require('express');

const { getUsers, deleteUser, getUser } = require('../controllers/user');

const { protect } = require('../middlewares/auth');

router = express.Router();

router.route('/').get(getUsers);
router.route('/:id').delete(protect, deleteUser).get(getUser);

module.exports = router;
