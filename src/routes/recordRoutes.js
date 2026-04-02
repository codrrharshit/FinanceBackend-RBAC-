const express = require('express');
const router= express.Router();


const {createRecord, getRecords, updateRecords, deleteRecord}= require('../controllers/recordController');
const authMiddleware= require('../middleware/authMiddleware');
const roleMiddleware= require('../middleware/roleMiddleware');
const validateRecord= require('../middleware/validateRecords');


// admin only for the creation 
router.post('/',authMiddleware,roleMiddleware(["admin"]),validateRecord,createRecord);
// admin + analyst can fetch the records 

router.get('/',authMiddleware,roleMiddleware(["admin","analyst"]),getRecords);

// admin only update the records 

router.patch('/:id',authMiddleware,roleMiddleware(["admin"]),updateRecords);
// admin only soft delete the records 

router.delete('/:id',authMiddleware,roleMiddleware(["admin"]),deleteRecord);

module.exports= router;