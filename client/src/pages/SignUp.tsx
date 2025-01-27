import React from 'react';
import SignUpForm from '../components/SignUpForm';

const SignUpPage: React.FC = () => {
    const handleSignUp = (data: {
        name: string;
        email: string;
        password: string;
        role: string;
    }) => {
        console.log('Signup data:', data);
        // Add API call or logic here
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <SignUpForm onSubmit={handleSignUp} />
        </div>
    );
};

export default SignUpPage;
