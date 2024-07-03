import { useState } from 'react'
import logo from './assets/logo.png'
import { useNavigate } from 'react-router-dom'
 
export default function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	const handleLogin = async (e) => {
		e.preventDefault()

		try {
			const response = await fetch ('http://localhost:3000/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					password
				})
			})

			const result = await response.json();

			if (!response.ok) {
                setMessage(result.error); 
                return;
            }

			setMessage(result.message);
            navigate('/game');
        } catch (error) {
            console.error('Error registering user:', error.message);
        }
	}

  return (
    <div className="w-screen h-screen bg-slate-50 flex justify-center items-center poppins">
		<div className="">
			<div className='w-2/3 mx-auto'>
				<img src={logo}/>
			</div>
			<div className='space-y-3'>
				<h1 className="text-2xl text-center">Login</h1>
				{message == "" ? (<></>):<h1 className='text-center text-red-600'>{message}</h1>}
				<form className='space-y-4' onSubmit={handleLogin}>
					<div className='space-y-2'>
						<input 
							type='email' 
							placeholder='Email' 
							className='rounded-lg p-2 block w-2/3 mx-auto bg-slate-50 border border-black'
							onChange={(e) => setEmail(e.target.value)}
							value={email}/>
						
						<input 
							type='password' 
							placeholder='Password' 
							className='rounded-lg p-2 block w-2/3 mx-auto bg-slate-50 border border-black'
							onChange={(e) => setPassword(e.target.value)}
							required
							value={password}/>
					</div>
					<button className='mx-auto px-4 py-2 block rounded-lg bg-green-700 hover:bg-green-600 text-slate-50 w-2/3 '>Log in</button>
				</form>
				<div className='flex justify-between items-center w-2/3 mx-auto'>
					<button className='text-gray-400 text-sm hover:underline underline-offset-4'>Forgot password?</button>
					<button className='text-gray-400 text-sm hover:underline underline-offset-4' onClick={() => navigate('/register')}>Don't have an account?</button>
				</div>
			</div>
		</div>
    </div>
  )
}
