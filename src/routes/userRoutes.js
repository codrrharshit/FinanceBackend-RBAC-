const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const rolesMiddleware = require('../middleware/roleMiddleware');

const updateUser= require('../controllers/userController');


router.patch('/:id/role',authMiddleware,rolesMiddleware(["admin"]),updateUser);
module.exports=router;