import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { app, db } from "../../../firebase/firebase";

class AuthHandler {
    static async registerUser(username, email, password, confirmPassword) {
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match!");
        }

        const auth = getAuth(app);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                wins: 0,
                loss: 0,
                streak: 0,
            });
            return user;
        } catch (error) {
            if (error.message === "Firebase: Error (auth/email-already-in-use).") {
                throw new Error("Email already in use");
            }
            throw error;
        }
    }

    static async loginUser(email, password) {
        const auth = getAuth(app);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }

    static async resetPassword(email) {
        const auth = getAuth(app);
        try {
            await sendPasswordResetEmail(auth, email);
            return true;
        } catch (error) {
            throw error;
        }
    }

    static onAuthStateChanged(callback) {
        const auth = getAuth(app); // Get the auth instance
        return new Promise((resolve, reject) => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    callback(user); // If a user is authenticated, run the callback
                    resolve(user);
                } else {
                    reject("User is signed out");
                }
            });
        });
    }

    static async getUID() {
        return new Promise((resolve, reject) => {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    resolve(user.uid);
                } else {
                    reject("No user found");
                }
            });
        });
    }

    static logOut() {
        const auth = getAuth(app);
        signOut(auth)
            .then(() => {
                console.log("Logout successful");
            })
            .catch((error) => {
                console.log(error);
                // An error happened.
            });
    } 
}

export default AuthHandler;
