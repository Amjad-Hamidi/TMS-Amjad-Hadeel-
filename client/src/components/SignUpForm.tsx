import React, { useState } from 'react';
import { SignUpFormData } from '../types/auth';

interface Props {
    onSubmit: (data: SignUpFormData) => void;
}

const SignUpForm: React.FC<Props> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<SignUpFormData>({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                <label htmlFor="name" className="block text-sm font-medium">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-md"
                    required
                />
            </div>
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
            <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium">Role</label>
                <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-md"
                >
                    <option value="user">User</option>
                    <option value="administrator">Administrator</option>
                    <option value="company">Company</option>
                    <option value="guest">Guest</option>
                </select>
            </div>
            <button
                type="submit"
                className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
                Sign Up
            </button>
        </form>
    );
};

export default SignUpForm;
