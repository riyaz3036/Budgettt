import React, {useState,useContext}from 'react';
import '../styles/login.css';
import {Form, FormGroup} from 'reactstrap';
import {Link,useNavigate} from 'react-router-dom';
import {BASE_URL} from '../Utils/config.js';
import {AuthContext} from "./../context/AuthContext";



const Login = ()=>{

    const {dispatch} = useContext(AuthContext);
    const navigate = useNavigate();



    //to Store the login details
    const [credentials, setCredentials] = useState({
        email: undefined,
        password: undefined,
    });


    //Handling change and submit
    const handleChange = e=>{
        setCredentials(prev=>({...prev,[e.target.id]:e.target.value}));
    }
    
    const [isSubmitting, setIsSubmitting] = useState(false);
   
    const handleSubmit = async e => {
        e.preventDefault();
        setIsSubmitting(true);
        dispatch({ type: 'LOGIN_START' });

        try {
            const res = await fetch(`${BASE_URL}/auth/login`, {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(credentials)
            });
            const result = await res.json();
            if (!res.ok) {
                alert(result.message);
                return;
            }

            dispatch({ type: 'LOGIN_SUCCESS', payload: result.data });
            alert("Login Successfull!!");
            navigate('/');
        } catch (e) {
            dispatch({ type: 'LOGIN_FAILURE', payload: e.message });
        } finally {
            setIsSubmitting(false); 
        }
    }
    
    return (
        <div className="login__main">
            
                        <div className="login__container">
                            
                            <h2 className="text-center">Login</h2>

                            <Form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <input type="text" placeholder="email" required id="email" onChange={handleChange} />
                                </FormGroup>

                                <FormGroup>
                                    <input type="password" placeholder="Password" required id="password" onChange={handleChange} />
                                </FormGroup>

                                <button className="login__btn" type="submit" disabled={isSubmitting}>Login</button>
                            </Form>

                            <p>Dont have an account?<Link to="/register">Register</Link></p>
                            </div>
                
        </div>
    )
};


export default Login;