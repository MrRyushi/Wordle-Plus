import { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

export const Leaderboards = () => {
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const array = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        array.push(doc.data());
      });

      // Sorting the array based on 'wins' in descending order
      array.sort((a, b) => b.wins - a.wins);

      setUsers(array);
    }

    getData();
  }, []); // Empty dependency array to run once on component mount

  return (
    <div className="flex justify-center items-center py-20">
      <div className="space-y-10">
        <h1 className="text-black text-7xl poppins text-center">Leaderboards</h1>
        <div className="grid grid-cols-5 text-center text-3xl font-bold">
          <h3>Rank</h3>
          <h3>Username</h3>
          <h3>Wins</h3>
          <h3>Streak</h3>
          <h3>Loss</h3>
        </div>
        <div>
          {users.map((user, index) => (
            <div key={index} className="grid grid-cols-5 text-3xl text-center">
              <p>{index+1}</p>
              <p className="uppercase">{user.username}</p>
              <p>{user.wins}</p>
              <p>{user.streak}</p>
              <p>{user.loss}</p>
            </div>
          ))}
        </div>
        <button className="text-xl py-2 px-6 bg-slate-900 text-slate-50 rounded-xl" onClick={() => navigate('/game')}>Back</button>
      </div>
    </div>
  );
};
