import express from'express'
import {createExpense,singleExpense,allExpense,updateExpense,deleteExpense} from "../controllers/ExpenseController.js"

const router = express.Router()

//to create a new expense
router.post('/', createExpense);

//to get single expense
router.get('/:id', singleExpense);

//to get all expense
router.get('/', allExpense);

//to update expense
router.put('/:id', updateExpense);

//to update expense
router.delete('/:id', deleteExpense);



export default router;
