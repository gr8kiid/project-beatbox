import React, { useState, useEffect } from 'react'
import './index.css'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ loginUser }) => {
    const [user, setUser] = useState({});
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {

        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            loginUser(currentUser);
        });
    }, [])


    const login = async () => {
        try {

            const user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            navigate('/')
        } catch (error) {
            toast.error(error.message, {
                position: "top-center",
            });
        }
    }


    return (
        <div className='custom_container'>
            <ToastContainer />
            <div className='right'>
                <h1 className="text-xl font-bold mb-3">Weclome to BeatBox</h1>

                <label>Email</label>
                <input onChange={(event) => { setLoginEmail(event.target.value) }} type="text" placeholder='Enter your Email' />
                <label>Password</label>
                <input onChange={(event) => { setLoginPassword(event.target.value) }} type="password" placeholder='Enter your Password' />

                <button className=' shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none' onClick={login}>Log In</button>
            </div>
        </div>

    )
}

export default Login
