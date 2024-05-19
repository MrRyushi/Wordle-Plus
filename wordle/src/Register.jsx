import logo from './assets/logo.png'
import { useNavigate } from 'react-router-dom'

export default function Register() {
    const navigate = useNavigate()
    return (
        <div className="w-screen h-screen bg-slate-50 flex justify-center items-center poppins">
            <div className="">
                <div className='w-2/3 mx-auto'>
                    <img src={logo}/>
                </div>
                <div className='space-y-3'>
                    <h1 className="text-2xl text-center">Register</h1>
                    <form className='space-y-4'>
                        <div className='space-y-2 grid grid-cols-1'>
                            <input type='text' placeholder='Username' className='rounded-lg p-2 block w-2/3 mx-auto bg-slate-50 border border-black'/>
                            <input type='email' placeholder='Email' className='rounded-lg p-2 block w-2/3 mx-auto bg-slate-50 border border-black'/>
                            <input type='password' placeholder='Password' className='rounded-lg p-2 block w-2/3 mx-auto bg-slate-50 border border-black'/>
                        </div>
                        <button className='mx-auto px-4 py-2 block rounded-lg bg-green-700 text-slate-50 w-2/3'>Register</button>
                    </form>
                    <div className='flex justify-center'>
                        <button className='text-gray-400 text-sm' onClick={() => navigate('/login')}>Already have an account?</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
