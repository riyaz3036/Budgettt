import React, {useState,useContext} from 'react';
import '../styles/register.css';
import {Form, FormGroup} from 'reactstrap';
import {Link,useNavigate} from 'react-router-dom';
import {BASE_URL} from '../Utils/config.js';
import {AuthContext} from "./../context/AuthContext";




const Register = ()=>{

//to Store all the registeration details    
const [details, setDetails] = useState ({
        username: "",
        password: "",
        email: "",
        expenses: []
});


   
const {dispatch} = useContext(AuthContext);
const navigate = useNavigate();


    
//Handling change and submit
const handleChange = e=>{
        const { id, value } = e.target;
    setDetails(prevDetails => ({
        ...prevDetails,
        [id]: value
    }));

}

const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting state to true when the form is being submitted
    
    try {
        const res = await fetch(`${BASE_URL}/auth/register/`, {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(details)
        });
        const result = await res.json();

        if (!res.ok) {
            alert(result.message);
        } else {
            alert("Successfully Registered!!! Please login");
            dispatch({ type: 'REGISTER_SUCCESS' });
            navigate('/login');
        }
    } catch (err) {
        alert(err.message);
    } finally {
        setIsSubmitting(false); // Reset submitting state after the registration request is completed
    }
}
        
    return (
        <div className="register__main">
            
                        <div className="register__container">
                            
                            <h2 className="text-center">Register</h2>

                            <Form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <input type="text" placeholder="Username" required id="username" onChange={handleChange}/>
                                </FormGroup>

                                <FormGroup>
                                    <input type="email" placeholder="Email" required id="email" onChange={handleChange}/>
                                </FormGroup>

                                <FormGroup>
                                    <input type="password" placeholder="Password" required id="password" onChange={handleChange}/>
                                </FormGroup>

                                <button className="register__btn" type="submit" disabled={isSubmitting}>Register</button>
                            </Form>

                            <p>Already have an account?<Link to="/login">Login</Link></p>
                            </div>
                
        </div>
    )
};


export default Register;