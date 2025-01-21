import logo from "./assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthHandler from "./lib/Auth/AuthHandler";  // Import AuthHandler class

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const user = await AuthHandler.registerUser(username, email, password, confirmPassword);
      setSuccessMessage("Successfully Registered");
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-50 flex justify-center items-center poppins">
      <div className="px-8 md:px-44 lg:px-72 xl:w-2/3">
        <div className=" mx-auto block">
          <img src={logo} className="mx-auto" />
        </div>
        <div className="space-y-3 3xl:w-1/2 mx-auto">
          <h1 className="text-2xl text-center">Register</h1>
          {successMessage && (
            <h1 className="text-center text-green-600">{successMessage}</h1>
          )}
          {errorMessage && (
            <h1 className="text-center text-red-600">{errorMessage}</h1>
          )}
          <div className="space-y-4">
            <form className="space-y-2 grid grid-cols-1" onSubmit={handleRegister}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="rounded-lg p-2 block w-full mx-auto bg-slate-50 border border-black"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="rounded-lg p-2 block w-full mx-auto bg-slate-50 border border-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="rounded-lg p-2 block w-full mx-auto bg-slate-50 border border-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="rounded-lg p-2 block w-full mx-auto bg-slate-50 border border-black"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                className="mx-auto px-4 py-2 block rounded-lg bg-green-700 hover:bg-green-600 text-slate-50 w-full"
                type="submit"
              >
                Register
              </button>
            </form>
          </div>
          <div className="flex justify-center mx-auto">
            <button
              className="text-gray-400 text-sm hover:underline underline-offset-4"
              onClick={() => navigate("/login")}
            >
              Already have an account?
            </button>
          </div>
        </div>
        <button
          className="text-center text-sm md:text-base block px-4 py-2 rounded-lg bg-gray-200 text-slate-900 mt-14"
          onClick={() => navigate('/')}
        >
          Back
        </button>
      </div>
    </div>
  );
}
