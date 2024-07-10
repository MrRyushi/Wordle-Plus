// Register.jsx
import logo from "./assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app, db } from "../firebase/firebase"; // Ensure the correct path to your firebase.ts fileimport { collection, addDoc } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

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
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match!");
        return null;
      }

      const auth = getAuth(app); // Pass the initialized app instance
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed up
          const user = userCredential.user;
          console.log(user.uid)
          // Add a new document with a generated id.
          const docRef = await setDoc(doc(db, "users", user.uid), {
            username: username,
          });

          setSuccessMessage("Successfully Registered");
          navigate("/login");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorMessage === "Firebase: Error (auth/email-already-in-use).") {
            setErrorMessage(`Email already in use`);
          } else {
            console.log(`Error: ${errorMessage}`);
          }

          // ...
        });
      // ...
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-50 flex justify-center items-center poppins">
      <div className="">
        <div className="w-2/3 mx-auto">
          <img src={logo} alt="Logo" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl text-center">Register</h1>
          {successMessage === "" ? null : (
            <h1 className="text-center text-green-600">{successMessage}</h1>
          )}
          {errorMessage === "" ? null : (
            <h1 className="text-center text-red-600">{errorMessage}</h1>
          )}
          <div className="space-y-4">
            <form
              className="space-y-2 grid grid-cols-1"
              onSubmit={handleRegister}
            >
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="rounded-lg p-2 block w-2/3 mx-auto bg-slate-50 border border-black"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="rounded-lg p-2 block w-2/3 mx-auto bg-slate-50 border border-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="rounded-lg p-2 block w-2/3 mx-auto bg-slate-50 border border-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Confirm Password"
                className="rounded-lg p-2 block w-2/3 mx-auto bg-slate-50 border border-black"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                className="mx-auto px-4 py-2 block rounded-lg bg-green-700 hover:bg-green-600 text-slate-50 w-2/3"
                type="submit"
              >
                Register
              </button>
            </form>
          </div>
          <div className="flex justify-center">
            <button
              className="text-gray-400 text-sm hover:underline underline-offset-4"
              onClick={() => navigate("/login")}
            >
              Already have an account?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
