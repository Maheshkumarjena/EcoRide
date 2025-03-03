import React from 'react';
import SignupForm from '@/components/signup-form';


const SignUp = () => {
    return (
        <div className='flex py-10  justify-center items-center min-h-screen overflow-scroll bg-purple-300 p-4'>
                <SignupForm/>
        </div>
    );
};

export default SignUp;