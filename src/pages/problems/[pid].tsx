import Topbar from "@/components/Topbar/Topbar";
import React from "react";
import Workspace from "@/components/Workspace/Workspace";
import useHasMounted from "@/hooks/useHasMounted";
import { problems } from "@/utils/problems";
import { Problem } from "@/utils/types/problem";

type ProblemPageProps = {
  problem: Problem;
};

const ProblemPage: React.FC<ProblemPageProps> = ({ problem }) => {
  const hasMounted = useHasMounted();

  if (!hasMounted) return null;
  return (
    <div>
      {/* passing the problempage prop to the topbar here */}
      <Topbar problemPage />
      <Workspace problem={problem} />
    </div>
  );
};
export default ProblemPage;

// fetch the local data
//  SSG
// getStaticPaths => it create the dynamic routes
export async function getStaticPaths() {
  //object.keys --> we will get all the keys in our problem map and each key is gonne be one of our routes
  //After getting those routes, we are gonna tell our function to generate static pages for those routes

  //we will map them to get an array.
  //for each key, we need to return an object which is gonna have a params where pid is the key
  const paths = Object.keys(problems).map((key) => ({
    params: { pid: key },
  }));

  return {
    paths,
    fallback: false, //wrong url shows 404
  };
}

// getStaticProps => it fetch the data

//inside the params object, we have the url which is the pid
export async function getStaticProps({ params }: { params: { pid: string } }) {
  const { pid } = params;
  //when we go to the two-sum page, the pid is two-sum and from the problems object below, we are fetching that data
  const problem = problems[pid];

  if (!problem) {
    return {
      notFound: true,
    };
  }
  //object is JSON and we need to convert it to string since function cannot be JSON
  problem.handlerFunction = problem.handlerFunction.toString();
  return {
    props: {
      problem,
    },
  };
}
