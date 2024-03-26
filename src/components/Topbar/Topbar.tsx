import { auth } from "@/firebase/firebase";
import Link from "next/link";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Logout from "../Buttons/Logout";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import Timer from "../Timer/Timer";
import { useRouter } from "next/router";
import { problems } from "@/utils/problems";
import { Problem } from "@/utils/types/problem";

//Top bar has a property to check whether or not we are on the problem page
// We update the TopbarProps type definition to include searchQuery and setSearchQuery props.
// searchQuery will hold the current search query entered by the user.
// setSearchQuery is a function that will be used to update the searchQuery state.
type TopbarProps = {
  problemPage?: boolean;
  searchQuery: string; // Define searchQuery prop
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>; // Define setSearchQuery prop
};

//We use these props in the Topbar component to manage the search functionality.
const Topbar: React.FC<TopbarProps> = ({
  problemPage,
  searchQuery,
  setSearchQuery,
}) => {
  // const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const [user] = useAuthState(auth);

  //   using the recoil state functionality
  const setAuthModalState = useSetRecoilState(authModalState);
  const router = useRouter();

  //function to change problem
  const handleProblemChange = (isForward: boolean) => {
    //destructuring order from pid from the problems as string
    const { order } = problems[router.query.pid as string] as Problem;
    //forward is 1 and notforward is -1
    const direction = isForward ? 1 : -1;
    //getting next problem order relative to our problem
    const nextProblemOrder = order + direction;
    const nextProblemKey = Object.keys(problems).find(
      (key) => problems[key].order === nextProblemOrder
    ); //undefined for terminal cases 1 and 5

    if (isForward && !nextProblemKey) {
      //i.e are at 5th problem
      const firstProblemKey = Object.keys(problems).find(
        (key) => problems[key].order === 1
        //next problem key is 1
      );
      router.push(`/problems/${firstProblemKey}`);
    } else if (!isForward && !nextProblemKey) {
      //i.e we are at 1st problem
      const lastProblemKey = Object.keys(problems).find(
        (key) => problems[key].order === Object.keys(problems).length //last problem is 5
      );
      router.push(`/problems/${lastProblemKey}`);
    } else {
      router.push(`/problems/${nextProblemKey}`);
    }
  };

  return (
    <nav className="relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7">
      {/* main div in which everything is contained */}
      <div
        className={`flex w-full items-center justify-between ${
          !problemPage ? "max-w-[1200px] mx-auto" : ""
        }`}
      >
        {/* logo image and link */}
        <Link href="/" className="h-[22px] flex-1">
          <Image src="/logo-full.png" alt="Logo" height={100} width={100} />
        </Link>

        {/* Search input only showcased when we are on list of problems*/}
        {!problemPage && (
          <div className="flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search category/tag"
              className="px-3 py-1 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {
          // if we are on problemPage, then show this
          problemPage && (
            <div className="flex items-center gap-4 flex-1 justify-center">
              <div
                className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer"
                onClick={() => handleProblemChange(false)}
              >
                <FaChevronLeft />
              </div>
              <Link
                href="/"
                className="flex items-center gap-2 font-medium max-w-[170px] text-dark-gray-8 cursor-pointer"
              >
                <div>
                  <BsList />
                </div>
                <p>Problem List</p>
              </Link>
              <div
                className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer"
                onClick={() => handleProblemChange(true)}
              >
                <FaChevronRight />
              </div>
            </div>
          )
        }

        <div className="flex items-center space-x-4 flex-1 justify-end">
          {/* div for GitHub button */}
          <div>
            <a
              href="https://github.com/RyhanKhan"
              target="_blank"
              rel="noreferrer"
              className="bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange hover:bg-dark-fill-2"
            >
              My GitHub
            </a>
          </div>
          {/* if user is not logged in then show us the sign in button */}
          {!user && (
            <Link
              href="/auth"
              //when the button is clicked it changes the recoil state of login card to active
              onClick={() =>
                setAuthModalState((prev) => ({
                  ...prev,
                  isOpen: true,
                  type: "login",
                }))
              }
            >
              <button className="bg-dark-fill-3 py-1 px-2 cursor-pointer rounded ">
                Sign In
              </button>
            </Link>
          )}
          {/* if we are on problem page, then show the timer option */}
          {user && problemPage && <Timer />}
          {/* if user is logged in, then show the profile image */}
          {user && (
            <div className="cursor-pointer group relative">
              <Image
                src="/avatar.png"
                alt="Avatar"
                width={30}
                height={30}
                className="rounded-full"
              />
              {/* div to showcase the email id of user when they hover on the profile icon */}
              {/* scale 0 means initially you won't see this buton hover scale 100 means you will */}
              <div className="absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-dark-layer-1 text-brand-orange p-2 rounded shadow-lg z-40 group-hover:scale-100 scale-0 transition-all duration-300 ease-in-out">
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
          )}
          {user && <Logout />}
        </div>
      </div>
    </nav>
  );
};
export default Topbar;
