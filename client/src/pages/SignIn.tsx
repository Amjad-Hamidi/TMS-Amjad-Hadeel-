import { Button, Label, TextInput } from 'flowbite-react';
import { useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';

interface FormData {
    email?: string;
    password?: string;
}


export default function SignIn() {
    const [formData, setFormData] = useState<FormData>({});
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };



    return (
        <div className='min-h-screen mt-20'>
            <div className='flex p-3 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-[90px]'>
                {/* left */}
                <div className='flex-1'>
                    <Link to='/' className='font-bold dark:text-white text-4xl'>
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                            Training
                        </span>
                        Management
                    </Link>
                    <p className='text-sm mt-5'>
                        This is a demo project. You can sign in with your email and password
                        or with Google.
                    </p>
                </div>
                {/* right */}
                <div className='flex-1'>
                    <form className='flex flex-col gap-4' >
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
                                placeholder='**********'
                                id='password'
                                onChange={handleChange}
                            />
                        </div>
                        <Button
                            gradientDuoTone='purpleToPink'
                            type='submit'
                        >
                            Sign In
                        </Button>
                        <OAuth />
                    </form>
                    <div className='flex gap-2 text-sm mt-5'>
                        <span>Dont Have an account?</span>
                        <Link to='/sign-up' className='text-blue-500'>
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
