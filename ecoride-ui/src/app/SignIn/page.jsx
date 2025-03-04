import React from 'react';
import SigninForm from '@/components/signin-form';

const SignIn = () => {
    return (
        <div className='flex pb-20  justify-center items-center min-h-[110vh] overflow-scroll bg-purple-300 p-4'>
                <SigninForm/>
        </div>
    );
};

export default SignIn;