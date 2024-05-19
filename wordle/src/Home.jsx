import logo from './assets/logo.png'
import { useNavigate } from 'react-router-dom'

export default function Home() {
	const navigate = useNavigate();
  return (
    <div className='w-screen h-screen flex justify-center items-center bg-slate-50'>
		<div className=''>
			<div>
				<img src={logo}/>
			</div>

			<div className='space-y-4'>
				<h1 className='text-center poppins text-4xl font-semibold'>Wordle Plus!</h1>
				<h2 className='text-center poppins text-2xl font-light'>Get 6 chances to guess a 5-letter word</h2>
	
				<div className='flex gap-3 justify-center items-center poppins'>
					<button className='border rounded-2xl px-3 py-2 hover:bg-slate-200 text-lg' onClick={() => navigate('/about')}>How to play</button>
					<button className='border rounded-2xl px-3 py-2 hover:bg-slate-200 text-lg' onClick={() => navigate('/login')}>Log in</button>
					<button className='border rounded-2xl px-3 py-2 bg-slate-900 text-slate-50 hover:bg-slate-950 text-lg'>Play</button>
				</div>
			</div>
		</div>
    </div>
  )
}
