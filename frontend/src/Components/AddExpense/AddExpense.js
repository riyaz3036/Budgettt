import React,{useState,useContext} from 'react';
import {Form, FormGroup} from 'reactstrap';
import {useNavigate} from 'react-router-dom';
import './add-expense.css';
import {BASE_URL} from '../../Utils/config.js';
import {AuthContext} from "../../context/AuthContext";


const AddExpense = ({setAddExpense}) => {

    const { user,dispatch } = useContext(AuthContext);//to get user id

    const navigate = useNavigate();

    const [formValues, setFormValues] = useState({
        user_id: user._id,
        title: undefined,
        amount: undefined,
        category: 'Essential',
        subcategory: 'Food',
        date: undefined
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
          ...formValues,
          [name]: value
        });
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const res = await fetch(`${BASE_URL}/expense/`, {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(formValues)
            });

            const result = await res.json();
            if (!res.ok) {
                alert(result.message);
            } else {
                alert("Expense Added Successfully");
                navigate('/');             
            }
            
        } catch (e) {
            alert(e.message);
        } finally {
            setIsSubmitting(false); 
        }
    }

    // To make sure input date is not greater than today
    const maxDate = () => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
    };
    

    return(
       <div className="bg-white p-5 rounded-2xl input_form ">

            <div className="flex justify-end text-lg cross"><i class="ri-close-line" onClick={()=>{setAddExpense(false)}}></i></div>

            <p className="text-2xl font medium mb-5">New Expense</p>
            <Form onSubmit={handleSubmit}>
                <FormGroup className="input_feild">
                    <label htmlFor="title">What did you spend on?</label>
                    <input type="text" id="title" name="title" value={formValues.title} onChange={handleChange} required/>
                </FormGroup>

                <FormGroup className="input_feild">
                    <label htmlFor="amount">Amount (₹)</label>
                    <input type="number" id="amount" name="amount" value={formValues.amount} step="0.01" onChange={handleChange} required/>
                </FormGroup>

                <FormGroup className="input_feild">
                    <label htmlFor="category">Category</label>
                    <select id="category" name="category" value={formValues.category} onChange={handleChange} required>
                        <option value="Essential">Essential</option>
                        <option value="Non-Essential">Non-Essential</option>
                        <option value="Miscelaneous">Miscelaneous</option>
                    </select>
                </FormGroup>

                <FormGroup className="input_feild">
                    <label htmlFor="subcategory">Sub category</label>
                    <select id="subcategory" name="subcategory" value={formValues.subcategory} onChange={handleChange} required>
                        <option value="Food">Food</option>
                        <option value="Housing">Housing</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Clothing">Clothing</option>
                    </select>
                </FormGroup>

                <FormGroup className="input_feild">
                        <label htmlFor="date">Date</label>
                        <input type="date" id="date" name="date" value={formValues.date} onChange={handleChange} max={maxDate()} required/>
                </FormGroup>

                <button className="add" disabled={isSubmitting}>Add</button>
           </Form>

       </div>
    )
}


export default AddExpense;