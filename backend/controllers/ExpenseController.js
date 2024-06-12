import Expense from '../models/Expense.js'
import User from '../models/User.js'
import mongoose from 'mongoose'


//creating a new Expense (Tested)
const createExpense = async(req,res)=>{

    const newExpense = new Expense(req.body)

    try{

        const savedExpense = await newExpense.save()
        let ObjId = new mongoose.Types.ObjectId(savedExpense._id);
        await User.updateOne(
            {
               _id: savedExpense.user_id
            },
            {
                $push:{
                    expenses: ObjId
                },
            },
            {
                upsert: false, new:true
            }
        )

        res.status(200).json({success:true, message: 'Succesfully created', data:savedExpense});

    }catch(err){
        res.status(500).json({success:false, message: 'Failed to create. please try again!!'});
    }
}




//getSingle Expense (Tested)
const singleExpense = async (req,res)=>{

    const id= req.params.id;

         try{
            const expense = await Expense.findById(id);
            res.status(200).json({success:true, message: 'Succesfully shown', data: expense});
    
        }catch(err){
            res.status(404).json({success:false, message: 'Failed to show please try again!!'});
        }  
}


//getAll expenses (Tested)
const allExpense = async (req,res)=>{
    
         try{
            const expense = await Expense.find({});
            res.status(200).json({success:true, message: 'Succesfully shown', data: expense});
    
        }catch(err){
            res.status(404).json({success:false, message: 'Failed to show please try again!!'});
        }  
     
}


//updating an expense (Tested)
const updateExpense = async (req,res)=>{

    const id=req.params.id

    try{
        const updatedExpense = await Expense.findByIdAndUpdate(id,{
            $set: req.body
        },{new:true})

        res.status(200).json({success:true, message: 'Succesfully updated', data:updatedExpense});
    }catch(err){
        res.status(500).json({success:false, message: 'Failed to updat please try again!!'});
    }
}

//deleting an expense(Tested)
const deleteExpense = async (req,res)=>{

    const id= req.params.id;
    try{
        const deletedExpense = await Expense.findByIdAndDelete(id);
        if (!deletedExpense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }
        
        // Remove the task ID from the tasks array in the User schema
        await User.updateOne(
            { expenses: id }, 
            { $pull: { expenses: id } } 
        );
      

        res.status(200).json({success:true, message: 'Succesfully deleted', data:deletedExpense})

    }catch(err){
        res.status(500).json({success:false, message: 'Failed to delete please try again!!'});
    }
}




export {createExpense,singleExpense,allExpense,updateExpense,deleteExpense};