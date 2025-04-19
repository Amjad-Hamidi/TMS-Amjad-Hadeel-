'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Button, Label, TextInput, Alert } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    phone: string;
    location: string;
    gender: string;
    university: string;
    specialization: string;
}


export default function SignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        phone: '',
        location: '',
        gender: '',
        university: '',
        specialization: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);  
    const [success, setSuccess] = useState<string | null>(null);  

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null); 
        setSuccess(null);  
    
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }
    
        try {
            console.log("FormData being sent:", formData);
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
    
            setSuccess("User registered successfully!");
            router.push("/user/signin");
        } catch (error: any) {
            setError(error.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className='min-h-screen mt-16'>
            <div className='flex p-3 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-11 dark:bg-[rgb(16,23,42)]'>
                <div className='flex-1'>
                    <Link href='/' className='font-bold dark:text-white text-4xl'>
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                            Training
                        </span>
                        Management
                    </Link>
                    <p className='text-sm mt-5'>This is a demo project. You can sign up with your email and password.</p>
                </div>

                <div className='flex-1'>
                    {error && <Alert color="failure">{error}</Alert>} 
                    {success && <Alert color="success">{success}</Alert>} 
                    
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                        <div>
                            <Label value='Your username' />
                            <TextInput type='text' placeholder='Username' id='username' value={formData.username} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label value='Your email' />
                            <TextInput type='email' placeholder='name@company.com' id='email' value={formData.email} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label value='Your password' />
                            <TextInput type='password' placeholder='Password' id='password' value={formData.password} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label value='Confirm password' />
                            <TextInput type='password' placeholder='Confirm Password' id='confirmPassword' value={formData.confirmPassword} onChange={handleChange} required />
                        </div>

                        <div>
                            <label htmlFor='role' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                                Select an option
                            </label>
                            <select id='role' value={formData.role} onChange={handleChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                                <option value=''>Choose Type</option>
                                <option value='company'>Company</option>
                                <option value='supervisor'>Supervisor</option>
                                <option value='trainee'>Trainee</option>
                            </select>
                        </div>

                        <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </Button>
                    </form>

                    <div className='flex gap-2 text-sm mt-5'>
                        <span>Have an account?</span>
                        <Link href='/user/signin' className='text-blue-500'>
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
