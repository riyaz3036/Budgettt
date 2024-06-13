import React,{useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import './header.css';
import logo from '../../assets/logo.png';
import userimg from '../../assets/user.png';
import {AuthContext} from "../../context/AuthContext";


const Header = () => {

    const { user,dispatch } = useContext(AuthContext);//to get user id
    const navigate = useNavigate();

    //Logout
    const logout =()=>{
     
        dispatch({type:'LOGOUT'})
        navigate('/')
        alert("Successfully Logged out!!")
    }

    return(
       <header className="flex justify-between py-3 px-10 header__main">
            <div className="flex gap-2 items-center">
                <img className="h-7 w-7" src={logo} />
                <h1 className="text-lg font-bold italic" style={{color: '#005FE4'}}>BUDGETTT</h1>
            </div>

            <div>
                {
                  user?
                  <div className="flex items-center justify-center gap-4">
                    <div className="relative">
                      <img className="h-7 w-7 cursor-pointer user_img" src={userimg}/>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 p-2 rounded-md opacity-0 transition-opacity duration-300 pointer-events-none user_tooltip">
                          <p className="text-cente text-base font-medium">Hi {user.username}!!</p>
                      </div>
                    </div>
                    <button className="bg-black text-white rounded py-1 px-4" onClick={logout}>Logout</button>
                  </div>
                  :
                  <button className="bg-black text-white rounded py-1 px-4" onClick={()=>{navigate('/login')}}>Login</button>
                }
                
            </div>
       </header>
    )
}


export default Header;