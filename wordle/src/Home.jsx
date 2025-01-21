import logo from "./assets/logo.png";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import AuthHandler from "./lib/Auth/AuthHandler";

export default function Home() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-slate-50">
      <div className="px-7">
        <div>
          <img src={logo} alt="Logo" />
        </div>

        <div className="space-y-4">
          <h1 className="text-center poppins text-4xl font-semibold">
            Wordle Plus!
          </h1>
          <h2 className="text-center poppins text-2xl font-light">
            Get 6 chances to guess a 5-letter word
          </h2>

          <div className="flex gap-3 justify-center items-center poppins">

            <button
              className="border border-slate-400 rounded-2xl px-3 py-2 hover:bg-slate-200 text-sm md:text-lg w-1/3"
              onClick={() => navigate("/about")}
            >
              How to play
            </button>


            <button
              className="border border-slate-400 rounded-2xl px-3 py-2 hover:bg-slate-200 text-sm md:text-lg w-1/3"
              onClick={() => navigate("/register")}
            >
              Register
            </button>

  
            {isSignedIn ? (
              <button
                className="border rounded-2xl px-3 py-2 bg-red-400 hover:bg-red-500 text-slate-50 text-sm md:text-lg w-1/3"
                onClick={AuthHandler.logOut}
              >
                Logout
              </button>
            ) : (
              <button
                className="border rounded-2xl px-3 py-2 bg-slate-950 hover:bg-slate-900 text-slate-50 text-sm md:text-lg w-1/3"
                onClick={() => navigate("/login")}
              >
                Log in
              </button>
            )}
            
          </div>
          {isSignedIn && (
            <button
              className="mx-auto block w-1/2 md:w-1/3 px-3 py-2 bg-slate-900 hover:bg-slate-950 rounded-2xl text-slate-50 text-sm md:text-lg poppins"
              onClick={() => navigate("/game")}
            >
              Back to Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
