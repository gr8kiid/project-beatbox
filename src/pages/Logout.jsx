import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';

const Logout = () => {
    const navigate = useNavigate();

    const logout = async () => {

        try {
            await signOut(auth);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        logout();
        navigate('/login')
    }, []);

    return (
        <div className="flex flex-col">
            <h2 className="font-bold text-3xl text-black text-left mt-4 mb-10">Logged Out</h2>

        </div>
    );
};

export default Logout;
