import { useState } from 'react';
import { auth } from '../firebase-config'; // import your Firebase Auth instance
import { sendPasswordResetEmail } from 'firebase/auth';
import classNames from 'classnames'; // for conditionally applying Tailwind classes

const PasswordResetForm = () => {
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setSuccessMessage('Password reset email sent. Check your inbox!');
            setErrorMessage('');
            setEmail('');
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage('');
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-bold">Reset your password</h2>
            {successMessage && (
                <p className="mb-4 text-green-600">{successMessage}</p>
            )}
            {errorMessage && (
                <p className="mb-4 text-red-600">{errorMessage}</p>
            )}
            <div className="mb-4 w-full">
                <label htmlFor="email" className="block mb-1 font-bold text-gray-700">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email address"
                    required
                    className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className={classNames(
                    'w-full py-2 px-4 text-white rounded-lg font-medium',
                    isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600 focus:bg-purple-600'
                )}
            >
                {isLoading ? 'Loading...' : 'Reset password'}
            </button>
        </form>
    );
};

export default PasswordResetForm;
