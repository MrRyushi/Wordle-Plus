import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from '../../../firebase/firebase';  // assuming you already set up Firebase config
import { doc, onSnapshot, setDoc } from "firebase/firestore";

class DBHelper {
    static async getUserData(setUID, setUserCurrentWins, setUserCurrentLoss, setUserCurrentStreak) {
        const auth = getAuth();
        return new Promise((resolve, reject) => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const uid = user.uid;
                    setUID(uid);
                    const unsub = onSnapshot(doc(db, "users", uid), (doc) => {
                        const userData = doc.data();
                        setUserCurrentWins(userData.wins);
                        setUserCurrentLoss(userData.loss);
                        setUserCurrentStreak(userData.streak);
                        resolve();
                    });
                } else {
                    reject('User is signed out');
                }
            });
        });
    }

    static async updateUserStats(userCurrentWins, userCurrentLoss, userCurrentStreak, showWinModal, showLoseModal) {
        const auth = getAuth();
        return new Promise((resolve, reject) => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const uid = user.uid;
                    const statsRef = doc(db, "users", uid);

                    try {
                        if (showWinModal) {
                            await setDoc(
                                statsRef,
                                {
                                    wins: userCurrentWins + 1,
                                    loss: userCurrentLoss,
                                    streak: userCurrentStreak + 1,
                                },
                                { merge: true }
                            );
                        } else if (showLoseModal) {
                            await setDoc(
                                statsRef,
                                {
                                    wins: userCurrentWins,
                                    loss: userCurrentLoss + 1,
                                    streak: 0,
                                },
                                { merge: true }
                            );
                        }
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject('User is signed out');
                }
            });
        });
    }
}

export default DBHelper;
