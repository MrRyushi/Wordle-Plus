import logo from './assets/logo.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/register', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });

            const result = await response.json();
            console.log(result)
            if (!response.ok) {
                setMessage(result.error); 
                return;
            }

            setMessage(result.message);
            navigate('/login'); 
        } catch (error) {
            console.error('Error registering user:', error.message);
        }
    };

    return (
        <div className="w-screen h-screen bg-slate-50 flex justify-center items-center poppins">
            <div className="">
                <div className='w-2/3 mx-auto'>
                    <img src={logo} alt="Logo"/>
                </div>
                <div className='space-y-3'>
                    <h1 className="text-2xl text-center">Register</h1>
                    {message == "" ? (<></>):<h1 className='text-center text-red-600'>{message}</h1>}
                    <div className='space-y-4'>
                        <form className='space-y-2 grid grid-cols-1' onSubmit={handleRegister}>
                            <input 
                                type='text' 
                                name='username'
                                placeholder='Username' 
                                className='rounded-lg p-2 block w-2/3 mx-auto bg-slate-50 border border-black'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <input 
                                type='email' 
                                name='email'
                                placeholder='Email' 
                                className='rounded-lg p-2 block w-2/3 mx-auto bg-slate-50 border border-black'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input 
                                type='password' 
                                name='password'
                                placeholder='Password' 
                                className='rounded-lg p-2 block w-2/3 mx-auto bg-slate-50 border border-black'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button 
                                className='mx-auto px-4 py-2 block rounded-lg bg-green-700 text-slate-50 w-2/3'
                                type="submit" 
                            >
                                Register
                            </button>
                        </form>
                    </div>
                    <div className='flex justify-center'>
                        <button className='text-gray-400 text-sm' onClick={() => navigate('/login')}>Already have an account?</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
