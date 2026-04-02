const {body, validationResult}= require('express-validator');

const validateRecord=[
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('type').isIn(['income','expense']).withMessage('Type must be either income or expense'),
    body('category').notEmpty().withMessage('Category is required'),
    body('date').isISO8601().toDate().withMessage('Date must be a valid date'),
    (req,res,next)=>{
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
];

module.exports= validateRecord;

