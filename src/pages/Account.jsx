import React from 'react';
import { ResetPassword } from '../components';

const Account = ({ isArtist }) => {


    const headingStyle = isArtist ? "font-bold text-3xl text-black text-left mt-4 mb-10" : "font-bold text-3xl text-white text-left mt-4 mb-10";

    return (
        <div className="flex flex-col">
            <h2 className={headingStyle}>Account</h2>
            <ResetPassword />
        </div>
    );

};

export default Account;
