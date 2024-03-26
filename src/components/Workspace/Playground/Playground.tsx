import { useState, useEffect } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

//languages
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";

import EditorFooter from "./EditorFooter";
import { Problem } from "@/utils/types/problem";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebase";
import { toast } from "react-toastify";
import { problems } from "@/utils/problems";
import { useRouter } from "next/router";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import useLocalStorage from "@/hooks/useLocalStorage";

//import axios from "axios";

type PlaygroundProps = {
  problem: Problem;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSolved: React.Dispatch<React.SetStateAction<boolean>>;
  selectedLanguage: string;
};

//making the interface for settings
export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
}

const Playground: React.FC<PlaygroundProps> = ({
  problem,
  setSuccess,
  setSolved,
}) => {
  //state to check which test case is active i.e to be renedered
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);

  //getting the code user types in
  let [userCode, setUserCode] = useState<string>(problem.starterCode);

  //let [pythonCode, setPythonCode] = useState<string>("");

  const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");

  //making the settings
  const [settings, setSettings] = useState<ISettings>({
    fontSize: fontSize,
    settingsModalIsOpen: false,
    dropdownIsOpen: false,
  });

  //getting auth user for authorization
  const [user] = useAuthState(auth);
  //destructuring page id from query from router object
  const {
    query: { pid },
  } = useRouter();

  //submit functionality
  const handleSubmit = async () => {
    //user not logged in
    if (!user) {
      toast.error("Please login to submit your code", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    try {
      //submitPythonCode();
      //console.log(pythonCode);

      //we slice the user code to start from the function's name and not comments or empty lines before
      userCode = userCode.slice(userCode.indexOf(problem.starterFunctionName));
      //we took the user's code and converted into a function which we will be using as our callback function
      const cb = new Function(`return ${userCode}`)();

      //handler =  handlerfunction of the problem with page id as pid
      const handler = problems[pid as string].handlerFunction;

      if (typeof handler === "function") {
        //success = result of running the user function and comparing it with the expected result
        const success = handler(cb);
        //success case
        if (success) {
          toast.success("Congrats! All tests passed!", {
            position: "top-center",
            autoClose: 3000,
            theme: "dark",
          });
          setSuccess(true);

          //timeout for confetti animation
          setTimeout(() => {
            setSuccess(false);
          }, 4000);

          //if success then update db
          const userRef = doc(firestore, "users", user.uid);
          await updateDoc(userRef, {
            solvedProblems: arrayUnion(pid),
          });
          setSolved(true); //local solved
        }
      }
    } catch (error: any) {
      console.log(error.message);
      if (
        error.message.startsWith(
          "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:"
        )
      ) {
        toast.error("Oops! One or more test cases failed", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
      }
    }
  };

  //saving the code to local storage
  useEffect(() => {
    //if code already exists then get code
    const code = localStorage.getItem(`code-${pid}`);
    if (user) {
      //user's code
      setUserCode(code ? JSON.parse(code) : problem.starterCode);
    } else {
      //if user is not there, we get boilerplate code
      setUserCode(problem.starterCode);
    }
  }, [pid, user, problem.starterCode]);

  //if no code exists then set code on submit
  const onChange = (value: string) => {
    //console.log(value);
    //setPythonCode(value);
    // console.log(userCode2);

    setUserCode(value);
    localStorage.setItem(`code-${pid}`, JSON.stringify(value));
  };

  // Function to get language extension based on selected language
  const getLanguageExtension = () => {
    switch (selectedLanguage) {
      case "JavaScript":
        return javascript();
      case "C++":
        return cpp();
      case "Java":
        return java();
      case "Python":
        return python();
      default:
        return javascript(); // Default to JavaScript
    }
  };
  const [selectedLanguage, setSelectedLanguage] =
    useState<string>("JavaScript");

  // const submitPythonCode = () => {
  //   axios
  //     .post("http://localhost:80/python", { pythonCode })
  //     .then((data) => console.log(data));
  // };

  return (
    <div className="flex flex-col bg-dark-layer-1 relative overflow-x-hidden">
      <PreferenceNav
        settings={settings}
        setSettings={setSettings}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />

      {/* spilt the screen for coding sandbox and your input and output test cases in the ratio of 60:40 */}
      <Split
        className="h-[calc(100vh-94px)]"
        direction="vertical"
        sizes={[60, 40]}
        minSize={60}
      >
        {/* div for our coding sandbox */}
        <div className="w-full overflow-auto">
          <CodeMirror
            value={userCode}
            theme={vscodeDark}
            onChange={onChange}
            extensions={[getLanguageExtension()]}
            style={{ fontSize: settings.fontSize }}
          />
        </div>

        {/* bottom div */}
        <div className="w-full px-5 overflow-auto">
          {/* testcase heading */}
          <div className="flex h-10 items-center space-x-6">
            <div className="relative flex h-full flex-col justify-center cursor-pointer">
              <div className="text-sm font-medium leading-5 text-white">
                Testcases
              </div>
              <hr className="absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white" />
            </div>
          </div>

          {/* div for complete test case boxes */}
          <div className="flex">
            {problem.examples.map((example, index) => (
              <div
                className="mr-2 items-start mt-2 text-white"
                key={example.id}
                onClick={() => setActiveTestCaseId(index)}
              >
                <div className="flex flex-wrap items-center gap-y-4">
                  {/* div to contain case number. Some css class needs to be added */}
                  <div
                    className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
                    ${
                      activeTestCaseId === index
                        ? "text-white"
                        : "text-gray-500"
                    }
                `}
                  >
                    Case {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* div for input output structure */}
          <div className="font-semibold my-4">
            {/* input  heading and div*/}
            <p className="text-sm font-medium mt-4 text-white">Input:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              {problem.examples[activeTestCaseId].inputText}
            </div>

            {/* output heading and div*/}
            <p className="text-sm font-medium mt-4 text-white">Output:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              {problem.examples[activeTestCaseId].outputText}
            </div>
          </div>
        </div>
      </Split>
      {/* importing the editor footer from playground */}
      <EditorFooter handleSubmit={handleSubmit} />
    </div>
  );
};
export default Playground;
