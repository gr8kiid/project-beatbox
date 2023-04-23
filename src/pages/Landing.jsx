import React, { useState } from 'react'
import Login from '../components/landing/Login'
import Register from '../components/landing/Register'
import '../components/landing/index.css'

const Landing = ({ loginUser }) => {
    const [login, setLogin] = useState(false);
    const loginText = "Already have an account? Login";
    const registerText = "Don't have an account? Register";

    const handleLogin = () => {
        setLogin(!login);
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="container mx-auto p-5 sm:p-10 md:p-16 lg:p-20">
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 lg:w-3/5 p-4 md:p-8">
                        <img className="w-full h-full object-cover rounded-lg" src="https://i.ibb.co/vXqDmnh/background.jpg" alt="" />
                    </div>

                    <div className="w-full md:w-1/2 lg:w-2/5 p-4 md:p-8">
                        {login ? <Login loginUser={loginUser} /> : <Register loginUser={loginUser} />}
                        <button className="text-left my-5 inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" onClick={handleLogin}>
                            {!login ? loginText : registerText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Landing
