import ProblemsTable from "@/components/ProblemsTable/ProblemsTable";
import Topbar from "@/components/Topbar/Topbar";
import useHasMounted from "@/hooks/useHasMounted";

import { useState } from "react";

export default function Home() {
  //state to check loading
  const [loadingProblems, setLoadingProblems] = useState(true);

  const hasMounted = useHasMounted();
  const [searchQuery, setSearchQuery] = useState(""); // Define searchQuery state

  if (!hasMounted) return null; //used to solve hydration error

  return (
    <>
      <main className="bg-dark-layer-2 min-h-screen">
        {/* Pass searchQuery and setSearchQuery to Topbar component */}
        <Topbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* setSearchQuery will be used in the Topbar component to update the searchQuery state based on user input. */}

        <h1
          className="text-2xl text-center text-gray-700 dark:text-gray-400 font-medium
					uppercase mt-10 mb-5"
        >
          &ldquo; Welcome to algo-arena &rdquo; 👇
        </h1>
        <div className="relative overflow-x-auto mx-auto px-6 pb-10">
          {
            //if loading then render loadingSkeleton 10 times
            loadingProblems && (
              <div className="max-w-[1200px] mx-auto sm:w-7/12 w-full animate-pulse">
                {[...Array(10)].map((_, idx) => (
                  <LoadingSkeleton key={idx} />
                ))}
              </div>
            )
          }
          {/* main table */}
          <table className="text-sm text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto">
            {/* Head of the table */}
            {!loadingProblems && (
              <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 border-b ">
                {/* 1st table row i.e our columns headings */}
                <tr>
                  <th scope="col" className="px-1 py-3 w-0 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Difficulty
                  </th>

                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 w-0 font-medium">
                    Solution
                  </th>
                </tr>
              </thead>
            )}
            {/* We also pass searchQuery to the ProblemsTable component as a prop. */}
            <ProblemsTable
              setLoadingProblems={setLoadingProblems}
              searchQuery={searchQuery}
            />
          </table>
        </div>
      </main>
    </>
  );
}

const LoadingSkeleton = () => {
  return (
    <div className="flex items-center space-x-12 mt-4 px-6">
      <div className="w-6 h-6 shrink-0 rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52  w-32  rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52  w-32 rounded-full bg-dark-layer-1"></div>
      <div className="h-4 sm:w-52 w-32 rounded-full bg-dark-layer-1"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
