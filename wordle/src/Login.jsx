import { useState } from "react";
import logo from "./assets/logo.png";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { app } from "../firebase/firebase";

export default function Login() {
  const navigate = useNavigate();

  // TODO: Consolidate into a single helper auth class?
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const [message, setMessage] = useState("");
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false)


  // TODO: Consolidate into a single helper auth class?
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth(app);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          navigate("/game");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if(errorMessage === 'Firebase: Error (auth/invalid-credential).') {
            setMessage('Invalid credentials');
          } else {
            console.log(errorMessage)
          }
        });
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
  };


  // TODO: Consolidate into a single helper auth class?
  const handleResetPassword = () => {
    setShowEmailInput(false)
    const auth = getAuth(app);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        setShowPasswordResetModal(true);
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  return (
    <div className="w-screen h-screen bg-slate-50 flex justify-center items-center poppins overflow-hidden">

      {showPasswordResetModal && (
        <div className="w-1/2 bg-slate-50 mx-auto p-12 rounded-xl space-y-6 absolute border-2 drop-shadow-2xl shadow-2xl">
          <h1 className="text-3xl text-center">
            Password Reset Email Sent!
          </h1>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowPasswordResetModal(false)}
              className="px-4 py-2 bg-green-500 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showEmailInput && (
        <div className="w-1/3  bg-slate-50 mx-auto p-12 rounded-xl space-y-6 absolute border-2 drop-shadow-2xl shadow-2xl">
          <input className="bg-transparent ps-2 py-2 w-full border-2 rounded-lg" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
          <div className="flex justify-end space-x-2">
            <button className="px-4 py-2 bg-red-500 rounded-xl" onClick={() => setShowEmailInput(false)}>Close</button>
            <button
              onClick={handleResetPassword}
              className="px-4 py-2 bg-green-500 rounded-xl"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      <div className="px-8 md:px-44 lg:px-72 xl:w-2/3">
        <div className=" mx-auto block">
          <img src={logo} className="mx-auto"/>
        </div>
        <div className="space-y-3 3xl:w-1/2 mx-auto">
          <h1 className="text-2xl text-center">Login</h1>
          {message == "" ? (
            <></>
          ) : (
            <h1 className="text-center text-red-600">{message}</h1>
          )}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Email"
                name="email"
                className="rounded-lg p-2 block mx-auto bg-slate-50 border border-black w-full"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />

              <input
                type="password"
                placeholder="Password"
                className="rounded-lg p-2 block mx-auto bg-slate-50 border border-black w-full"
                onChange={(e) => setPassword(e.target.value)}
                required
                value={password}
              />
            </div>
            <button className="mx-auto px-4 py-2 block rounded-lg bg-green-700 hover:bg-green-600 text-slate-50 w-full ">
              Log in
            </button>
          </form>
          <div className="flex justify-between items-center mx-auto">
            <button
              className="text-gray-400 text-xs md:text-sm hover:underline underline-offset-4"
              onClick={() => setShowEmailInput(true)}
            >
              Forgot password?
            </button>
            <button
              className="text-gray-400 text-xs md:text-sm hover:underline underline-offset-4"
              onClick={() => navigate("/register")}
            >
              Don't have an account?
            </button>
          </div>
        </div>

        {/* Consolidate into a UI Class */}
        <button className="text-center text-sm md:text-base block px-4 py-2 rounded-lg bg-gray-200 text-slate-900 mt-14" onClick={() => navigate('/')}>Back</button>
      </div>
    </div>
  );
}
