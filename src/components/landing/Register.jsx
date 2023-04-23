import React, { useEffect, useState } from 'react'
import './index.css'
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from '../../firebase-config'
import voucher_codes from 'voucher-code-generator';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = ({ loginUser }) => {
    const [user, setUser] = useState({});
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [fullName, setFullName] = useState('');
    const navigate = useNavigate();
    const couponCodes = voucher_codes.generate({
        length: 5,
        count: 8,
        prefix: "AMZ-",
        postfix: "-23"
    });

    const addUser = async (user) => {
        try {
            let data;
            if (checked) {
                data = {
                    email: user.email,
                    name: fullName,
                    songs: [],
                    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541',
                };
                await setDoc(doc(db, "artist", user.uid), data);
            }
            else {
                data = {
                    email: user.email,
                    name: fullName,
                    points: 2000,
                    giftCards: [
                        {
                            couponCode: couponCodes[0],
                            cost: 300,
                            isRedeemed: false,
                        },
                        {
                            couponCode: couponCodes[1],
                            cost: 600,
                            isRedeemed: false,
                        },
                        {
                            couponCode: couponCodes[2],
                            cost: 900,
                            isRedeemed: false,
                        },
                        {
                            couponCode: couponCodes[3],
                            cost: 1200,
                            isRedeemed: false,
                        },
                        {
                            couponCode: couponCodes[4],
                            cost: 1500,
                            isRedeemed: false,
                        },
                        {
                            couponCode: couponCodes[5],
                            cost: 1800,
                            isRedeemed: false,
                        },
                        {
                            couponCode: couponCodes[6],
                            cost: 2100,
                            isRedeemed: false,
                        },
                        {
                            couponCode: couponCodes[7],
                            cost: 2400,
                            isRedeemed: false,
                        },
                    ],
                };
                await setDoc(doc(db, "listener", user.uid), data);
            }
        } catch (e) {
            toast.error("Error adding document: ", e, {
                position: "top-center",
            });
        }
    }

    useEffect(() => {

        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            loginUser(currentUser);
        });
    }, [])


    const register = async () => {
        try {

            const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
            addUser(user.user);
            navigate('/');
        } catch (error) {
            toast.error(error.message, {
                position: "top-center",
            })
        }
    }

    const handleCheck = (e) => {
        setChecked(e.target.checked);
    }

    return (
        <div className='custom_container'>
            <ToastContainer />
            <div className='right'>
                <h1 className="text-xl font-bold mb-3">Weclome to BeatBox</h1>
                <label className='text-left '>Full Name</label>
                <input onChange={(event) => { setFullName(event.target.value) }} type="text" placeholder='John Doe' />
                <label>Email</label>
                <input onChange={(event) => { setRegisterEmail(event.target.value) }} type="email" placeholder='Enter your Email' />
                <label>Password</label>
                <input onChange={(event) => { setRegisterPassword(event.target.value) }} type="password" placeholder='Enter your Password' />
                <span className="text-sm font-bold text-purple-800 ">
                    <input className="mr-2 leading-tight checkbox" type="checkbox" onChange={handleCheck} />
                    Register as an Artist
                </span>
                <button className=' shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none' onClick={register}>Create Account</button>
            </div>
        </div>

    )
}

export default Register
