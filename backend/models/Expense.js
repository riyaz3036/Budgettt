import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String, 
    required: true,
  },
  subcategory:{
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  amount:{
    type: Number,
    required: true,
  }
}, { timestamps: true });

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;