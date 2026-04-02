const Record= require('../models/Records');
// CRUD operations for the financial records 


exports.createRecord= async(req,res)=>{
    try {

        const record= new Record({
            ...req.body,
            userId:req.user.userId
        });

        record.save();
        return res.status(201).json({message:"Record created successfully", record});
        
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}


exports.getRecords= async(req,res)=>{
    try {
        // we have to add the pagination and filtering logic here we also have to apply the search logic in the queries 
        const {page=1,limit=10,type,category,sort="-date",search,startDate, endDate}= req.query;
        const pageNum= Number(page);
        const limitNum= Number(limit);
        const criteria={
            userId:req.user.userId,
            isDeleted:false
        }

        if(type) criteria.type=type;
        if(category) criteria.category=category;
        if(search && search.trim()!=="") {
            criteria.$or=[
                {notes: {$regex: search, $options: "i"}},
                {category: {$regex: search, $options: "i"}}
            ];
        }
        if(startDate || endDate){
            criteria.date={};
            if(startDate){
                if(isNaN(Date.parse(startDate))){
                    return res.status(400).json({message:"Invalid start date"});
                }
                 criteria.date.$gte= new Date(startDate);
            }
            if(endDate){
                if(isNaN(Date.parse(endDate))){
                    return res.status(400).json({message:"Invalid end date"});
                }
                criteria.date.$lte= new Date(endDate);
            }
        }

        // we also return the metadata for the pagination 
        const totalRecords= await Record.countDocuments(criteria);
        const records= await Record.find(criteria)
            .sort(sort)
            .skip((pageNum-1)*limitNum)
            .limit(limitNum);

        return res.status(200).json({
            page: pageNum,
            limit: limitNum,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limitNum),
            data: records
        });
    } 
    catch(error){
        return res.status(500).json({message:error.message});
    }

}



exports.updateRecords= async(req,res)=>{
    try {
        const record= await Record.findOneAndUpdate(
            {_id:req.params.id, userId:req.user.userId,isDeleted:false},
            req.body,
            {new:true}
        )

        return res.status(200).json({message:"Record update successfully",record});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}


// we will implement soft delete 

exports.deleteRecord= async(req,res)=>{
    try {
        const reecord = await Record.findOneAndUpdate(
            {_id:req.params.id, userId:req.user.userId,isDeleted:false},
            {isDeleted:true, deletedAt: new Date()},
            {new:true}
        )

        return res.status(200).json({message:"Record deleted successfully"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}