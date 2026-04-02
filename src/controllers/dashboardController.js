const Record= require('../models/Records');
const mongoose= require('mongoose');

exports.getDashboardSummary= async(req,res)=>{
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        // total income and expense 
        const total= await Record.aggregate([
            {$match:{userId, isDeleted:false}},
            {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      }, ])

      const result= total[0] || {totalIncome:0, totalExpense:0};
        const categoryBreakdown = await Record.aggregate([
      {
        $match: {
          userId,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

     const monthlyTrends = await Record.aggregate([
      {
        $match: {
          userId,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

     const formatedTrends = monthlyTrends.map((item) => ({
      month: monthNames[item._id - 1],
      total: item.total,
    }));


     const recentTransactions = await Record.find({
      userId,
      isDeleted: false,
    })
      .sort({ date: -1 })
      .limit(5);


      res.status(200).json({
      totalIncome: result.totalIncome,
      totalExpense: result.totalExpense,
      balance: result.totalIncome - result.totalExpense,
      categoryBreakdown,
      monthlyTrends: formatedTrends,
      recentTransactions,
    });

     
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}