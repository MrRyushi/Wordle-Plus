import { useState, useEffect } from "react";
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const crown = <FontAwesomeIcon icon={faCrown} />;
export const Leaderboards = () => {
  const [users, setUsers] = useState([]);
  const [uid, setUID] = useState("");
  const [userStats, setUserStats] = useState({});
  const [userRank, setUserRank] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
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
    }

    getData();
  }, []); // Empty dependency array to run once on component mount

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUID(uid);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  });

  useEffect(() => {
    async function getUserData() {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setUserStats(docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    }
    getUserData();
  }, [uid]);

  useEffect(() => {
    for(let i = 0; i < users.length; i++){
      if(users[i].username === userStats.username){
        setUserRank(i+1);
      }
    }
  })

  return (
    <div className="flex justify-center items-center md:py-20 bg-gradient-to-t from-leaderboard-color1 to-leaderboard-color2 text-slate-50 h-screen poppins">
      <div className="2xl:space-y-10 px-3 md:px-14">
        <h1 className="text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl poppins text-center">
          <span className="text-yellow-500">{crown}</span> Leaderboards
        </h1>

        <div className="grid grid-cols-6 text-lg md:text-3xl mt-5">
          <p className="border-2 border-yellow-500 px-2">{userRank}</p>
          <p className="uppercase border-2 border-yellow-500 col-span-2 break-words px-2">
            {userStats.username}
          </p>
          <p className="border-2 border-yellow-500 px-2">{userStats.wins}</p>
          <p className="border-2 border-yellow-500 px-2">{userStats.streak}</p>
          <p className="border-2 border-yellow-500 px-2">{userStats.loss}</p>
        </div>

        <div className="grid grid-cols-6 text-lg md:text-3xl font-bold mt-3">
          <h3 className="">Rank</h3>
          <h3 className=" col-span-2">Username</h3>
          <h3 className="">Wins</h3>
          <h3 className="">Streak</h3>
          <h3 className="">Loss</h3>
        </div>


        <div>
          {users.map((user, index) => (
            <div key={index} className="grid grid-cols-6 text-lg md:text-3xl">
              <p className="border px-2">{index + 1}</p>
              <p className="uppercase border col-span-2 break-words px-2">
                {user.username}
              </p>
              <p className="border px-2">{user.wins}</p>
              <p className="border px-2">{user.streak}</p>
              <p className="border px-2">{user.loss}</p>
            </div>
          ))}
        </div>
        <button
          className="text-base md:text-xl py-2 px-6 bg-leaderboard-color3 text-slate-50 rounded-xl mt-10"
          onClick={() => navigate("/game")}
        >
          Back
        </button>
      </div>
    </div>
  );
};
