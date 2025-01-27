import React, { useState } from 'react';
import { LoginFormData } from '../types/auth';

interface Props {
    onSubmit: (data: LoginFormData) => void;
}

const LoginForm: React.FC<Props> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md">
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-md"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-md"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Login
            </button>
        </form>
    );
};

export default LoginForm;
