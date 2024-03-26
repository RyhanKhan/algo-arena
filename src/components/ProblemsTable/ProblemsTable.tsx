import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { AiFillYoutube } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import YouTube from "react-youtube";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, firestore } from "@/firebase/firebase";
import { DBProblem } from "@/utils/types/problem";
import { useAuthState } from "react-firebase-hooks/auth";

type ProblemsTableProps = {
  setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string; // Add searchQuery to the type definition
};

const ProblemsTable: React.FC<ProblemsTableProps> = ({
  setLoadingProblems,
  searchQuery,
}) => {
  // creating a state for youtube functionality
  const [youtubePlayer, setYoutubePlayer] = useState({
    isOpen: false,
    videoId: "",
  });
  const problems = useGetProblems(setLoadingProblems);
  const solvedProblems = useGetSolvedProblems();
  console.log("solvedProblems", solvedProblems);

  //function to close YT Player
  const closeModal = () => {
    setYoutubePlayer({ isOpen: false, videoId: "" });
  };

  //making the close function using escape key as well
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Create a filteredProblems state to store the filtered problems
  const [filteredProblems, setFilteredProblems] = useState<DBProblem[]>([]);

  // Fetch problems from Firestore using useEffect
  useEffect(() => {
    const getProblems = async () => {
      setLoadingProblems(true);
      const q = query(
        collection(firestore, "problems"),
        orderBy("order", "asc")
      );
      const querySnapshot = await getDocs(q);
      const tmp: DBProblem[] = [];
      querySnapshot.forEach((doc) => {
        tmp.push({ id: doc.id, ...doc.data() } as DBProblem);
      });
      setFilteredProblems(tmp); // Initially set filteredProblems to all problems
      setLoadingProblems(false);
    };

    getProblems();
  }, [setLoadingProblems]);

  // Update filteredProblems whenever searchQuery changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProblems(problems); // If searchQuery is empty, show all problems
    } else {
      // Filter problems based on searchQuery
      const filtered = problems.filter((problem) =>
        problem.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProblems(filtered);
    }
  }, [searchQuery, problems]);

  return (
    <>
      {/* table body for the table head we created in our index/home page */}
      <tbody className="text-white">
        {/* importing our problems and mapping through them like 1 table row for each problem and repeating a similar format for the subsequent ones */}
        {filteredProblems.map((problem, idx) => {
          // making a dynamic color based on the difficulty level
          const difficulyColor =
            problem.difficulty === "Easy"
              ? "text-dark-green-s"
              : problem.difficulty === "Medium"
              ? "text-dark-yellow"
              : "text-dark-pink";
          return (
            // creating the particular table row format
            <tr
              //odd idices will be darker in color
              //key = id is just a good practice
              className={`${idx % 2 == 1 ? "bg-dark-layer-1" : ""}`}
              key={problem.id}
            >
              {/* creating table head format */}
              <th className="px-2 py-4 font-medium whitespace-nowrap text-dark-green-s">
                {/* icon for solved problems */}
                {solvedProblems.includes(problem.id) && (
                  <BsCheckCircle fontSize={"18"} width="18" />
                )}
              </th>

              {/* td for going to the problem i.e link to the problem */}
              <td className="px-6 py-4">
                {problem.link ? (
                  <Link
                    href={problem.link}
                    className="hover:text-blue-600 cursor-pointer"
                    target="_blank"
                  >
                    {problem.title}
                  </Link>
                ) : (
                  <Link
                    className="hover:text-blue-600 cursor-pointer"
                    href={`/problems/${problem.id}`}
                  >
                    {problem.title}
                  </Link>
                )}
              </td>

              {/* table data for difficulty */}
              <td className={`px-6 py-4 ${difficulyColor}`}>
                {problem.difficulty}
              </td>

              {/* table data for problem category */}
              <td className={"px-6 py-4"}>{problem.category}</td>

              {/* td for youtube solution video link */}
              <td className={"px-6 py-4"}>
                {/* if it has a solution then show icon otherwise say 'coming soon' */}
                {problem.videoId ? (
                  <AiFillYoutube
                    fontSize={"28"}
                    className="cursor-pointer hover:text-red-600"
                    onClick={() =>
                      // when clicked, it triggers the YT functionality
                      setYoutubePlayer({
                        isOpen: true,
                        videoId: problem.videoId as string,
                      })
                    }
                  />
                ) : (
                  <p className="text-gray-400">Coming soon</p>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
      {
        // creating a table footer

        //only if youtube player is open, show this
        youtubePlayer.isOpen && (
          <tfoot className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center">
            {/* a background overlay? */}
            <div
              className="bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute"
              //clicking the BG also closes the player
              onClick={closeModal}
            ></div>
            <div className="w-full z-50 h-full px-6 relative max-w-4xl">
              <div className="w-full h-full flex items-center justify-center relative">
                <div className="w-full relative">
                  {/* YT Player closing button */}
                  <IoClose
                    fontSize={"35"}
                    className="cursor-pointer absolute -top-16 right-0"
                    onClick={closeModal}
                  />
                  <YouTube
                    videoId={youtubePlayer.videoId}
                    loading="lazy"
                    iframeClassName="w-full min-h-[500px]"
                  />
                </div>
              </div>
            </div>
          </tfoot>
        )
      }
    </>
  );
};
export default ProblemsTable;

function useGetProblems(
  setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>
) {
  //problem state, empty initially and filled once we fetch
  const [problems, setProblems] = useState<DBProblem[]>([]);

  useEffect(() => {
    const getProblems = async () => {
      // fetching data logic
      setLoadingProblems(true);

      //using firebase logic
      //query from firestore db collection of problems and we order by ascending order
      const q = query(
        collection(firestore, "problems"),
        orderBy("order", "asc")
      );
      const querySnapshot = await getDocs(q); //gets all the data about all the documents
      const tmp: DBProblem[] = []; //creating a temporary array to store all the relevant info about our problems with type dbproblem
      querySnapshot.forEach((doc) => {
        tmp.push({ id: doc.id, ...doc.data() } as DBProblem);
      });
      setProblems(tmp); //taking the data of the temporary array and storing it in the problems state
      setLoadingProblems(false); //loading is false
    };

    getProblems();
  }, [setLoadingProblems]);
  return problems;
}

//to get solved problems
function useGetSolvedProblems() {
  const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const getSolvedProblems = async () => {
      const userRef = doc(firestore, "users", user!.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setSolvedProblems(userDoc.data().solvedProblems);
      }
    };

    if (user) getSolvedProblems();
    if (!user) setSolvedProblems([]);
  }, [user]);

  return solvedProblems;
}
