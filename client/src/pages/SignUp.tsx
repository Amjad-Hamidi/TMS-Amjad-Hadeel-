import { Button, Label, TextInput } from 'flowbite-react';
import { useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';

interface FormData {
    username?: string;
    email?: string;
    password?: string;
}

export default function SignUp() {
    const [formData, setFormData] = useState<FormData>({});
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };


    return (
        <div className='min-h-screen mt-16'>
            <div className='flex p-3 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-11'>
                {/* left */}
                <div className='flex-1'>
                    <Link to='/' className='font-bold dark:text-white text-4xl'>
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                            Training
                        </span>
                        Management
                    </Link>
                    <p className='text-sm mt-5'>
                        This is a demo project. You can sign up with your email and password
                        or with Google.
                    </p>
                </div>
                {/* right */}
                <div className='flex-1'>
                    <form className='flex flex-col gap-4'>
                        <div>
                            <Label value='Your username' />
                            <TextInput
                                type='text'
                                placeholder='Username'
                                id='username'
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label value='Your email' />
                            <TextInput
                                type='email'
                                placeholder='name@company.com'
                                id='email'
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label value='Your password' />
                            <TextInput
                                type='password'
                                placeholder='Password'
                                id='password'
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label value='Confirm password' />
                            <TextInput
                                type='password'
                                placeholder='Password'
                                id='password'
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label for="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
                            <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => onChange(e.target.value)}>
                                <option selected>Choose Type</option>
                                <option value="#">Admin</option>
                                <option value="#">Company</option>
                                <option value="#">Supervisor</option>
                                <option value="#">Trainee</option>
                            </select>
                        </div>
                        <Button
                            gradientDuoTone='purpleToPink'
                            type='submit'

                        >
                            Sign Up

                        </Button>
                        <OAuth />
                    </form>
                    <div className='flex gap-2 text-sm mt-5'>
                        <span>Have an account?</span>
                        <Link to='/sign-in' className='text-blue-500'>
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
