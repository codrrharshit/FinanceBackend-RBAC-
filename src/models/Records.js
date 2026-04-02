const mongoose=require('mongoose');

const recordSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true
    },
    amount:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        enum:["income","expense"],
        required:true,
        index:true
    },
    category:{
        type:String,
        required:true,
        index:true
    },
    date:{
        type:Date,
        required:true,
        index:true
    },
    notes:{
        type:String,
        trim:true
    },
    isDeleted:{
        type:Boolean,
        default:false,
        index:true
    },
    deletedAt:{
        type:Date,
        default:null
    }

},{timestamps:true});

recordSchema.index({ userId: 1, isDeleted: 1, date: -1 });

const Record= mongoose.model('Record',recordSchema);
module.exports=Record;