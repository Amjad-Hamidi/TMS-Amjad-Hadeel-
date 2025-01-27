import React from 'react';
import LoginForm from '../components/LoginForm';

const SignIn: React.FC = () => {
    const handleLogin = (data: { email: string; password: string }) => {
        console.log('Login data:', data);

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <LoginForm onSubmit={handleLogin} />
        </div>
    );
};

export default SignIn;
