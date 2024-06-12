import User from '../models/User.js'
import Expense from '../models/Expense.js'


//creating a new user(tested)
const createUser = async(req,res)=>{
    const newUser = new User(req.body)

    try{

            const savedUser = await newUser.save();
        

        res.status(200).json({success:true, message: 'Succesfully created', data:savedUser});

    }catch(err){
        res.status(500).json({success:false, message: 'Failed to create. please try again!!'});
    }
}


//updating a user (Tested)
const updateUser = async (req,res)=>{

    const id=req.params.id

    try{
        const updatedUser = await User.findByIdAndUpdate(id,{
            $set: req.body
        },{new:true})

        res.status(200).json({success:true, message: 'Succesfully updated', data:updatedUser});
    }catch(err){
        res.status(500).json({success:false, message: 'Failed to updat please try again!!'});
    }
}


//deleting a user (Tested)
const deleteUser = async (req,res)=>{

    const id= req.params.id;
    try{
        const deletedUser = await User.findByIdAndDelete(id);
        res.status(200).json({success:true, message: 'Succesfully deleted', data:deletedUser})

    }catch(err){
        res.status(500).json({success:false, message: 'Failed to delete please try again!!'});
    }
}

//getSingle  user (Tested)
const singleUser = async (req,res)=>{

    const id= req.params.id;
    

        //populate with activity and send
        try{

            const user = await User.findById(id).populate({path:'expenses' , model:'Expense'});
    
            res.status(200).json({success:true, message: 'Succesfully shown', data: user});
        }catch(err){
            res.status(404).json({success:false, message: 'Failed to show please try again!!'});
        }


        
}

//getAll  users (Tested)
const allUsers = async (req,res)=>{
    try{
        const users = await User.find({}).populate({path:'expenses' , model:'Expense'});
        res.status(200).json({success:true, message: 'Succesfully shown', data: users});
    }catch(err){
        res.status(404).json({success:false, message: 'Failed to show please try again!!'});
    }
}


export { createUser, updateUser, deleteUser, singleUser, allUsers };
