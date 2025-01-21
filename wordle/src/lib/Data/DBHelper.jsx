import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from '../../../firebase/firebase';  // assuming you already set up Firebase config
import { doc, onSnapshot, setDoc, getDoc, query, collection, getDocs } from "firebase/firestore";

class DBHelper {

    static async getUsers(setUsers) {
        try {
            const q = query(collection(db, "users"));
            const querySnapshot = await getDocs(q);
            const array = [];

            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.data());
                array.push(doc.data());
            });

            // Sorting the array based on 'wins' in descending order
            array.sort((a, b) => b.wins - a.wins);

            setUsers(array);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

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

    static async getUserDataByUID(uid, setUserStats) {
        if (!uid) {
            return;
        }
        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                setUserStats(docSnap.data());
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error getting document:");
        }
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

    static setRanks(users, userStats, setUserRank) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === userStats.username) {
                setUserRank(i + 1);
            }
        }
    }
}

export default DBHelper;
