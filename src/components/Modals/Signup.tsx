import { authModalState } from "@/atoms/authModalAtom";
import { auth, firestore } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

type SignupProps = {};

const Signup: React.FC<SignupProps> = () => {
  //using state functionality
  const setAuthModalState = useSetRecoilState(authModalState);
  const handleClick = () => {
    setAuthModalState((prev) => ({ ...prev, type: "login" }));
  };
  //making a react state for inputs
  const [inputs, setInputs] = useState({
    email: "",
    displayName: "",
    password: "",
  });
  const router = useRouter();
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  //making a function to update the input state based on our values
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //making the submission function
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputs.email || !inputs.password || !inputs.displayName)
      //   return alert("Please fill all fields");

      //       try {
      //         const newUser = await createUserWithEmailAndPassword(
      //           inputs.email,
      //           inputs.password
      //         );
      //         if (!newUser) return;
      //         await
      //         router.push("/");
      //       } catch (error: any) {
      //         alert(error.message);
      //       }
      //   };

      try {
        toast.loading("Creating your account", {
          position: "top-center",
          toastId: "loadingToast",
        });
        const newUser = await createUserWithEmailAndPassword(
          inputs.email,
          inputs.password
        );
        if (!newUser) return;
        //user data to be saved in db
        const userData = {
          uid: newUser.user.uid,
          email: newUser.user.email,
          displayName: inputs.displayName,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          likedProblems: [],
          dislikedProblems: [],
          solvedProblems: [],
          starredProblems: [],
        };

        //set data in the db using firestore db users collection
        await setDoc(doc(firestore, "users", newUser.user.uid), userData);

        //once user data is saved, redirect to home page
        router.push("/");
      } catch (error: any) {
        toast.error(error.message, { position: "top-center" });
      } finally {
        //removes the loading toast ui
        toast.dismiss("loadingToast");
      }
  };

  //alerting the errors to the user
  useEffect(() => {
    if (error) alert(error.message);
  }, [error]);

  return (
    <form className="space-y-6 px-6 pb-4" onSubmit={handleRegister}>
      <h3 className="text-xl font-medium text-white"> Register to AlgoArena</h3>
      {/* div for email */}
      <div>
        <label
          htmlFor="email"
          className="text-sm font-medium block mb-2 text-gray-300"
        >
          Email
        </label>
        <input
          onChange={handleChangeInput}
          type="email"
          name="email"
          id="email"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
          bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
          placeholder="name@company.com"
        />
      </div>

      {/* div for displayName */}
      <div>
        <label
          htmlFor="diplayName"
          className="text-sm font-medium block mb-2 text-gray-300"
        >
          Display Name
        </label>
        <input
          onChange={handleChangeInput}
          type="diplayName"
          name="diplayName"
          id="diplayName"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
          bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
          placeholder="John Doe"
        />
      </div>

      {/* div for password */}
      <div>
        <label
          htmlFor="password"
          className="text-sm font-medium block mb-2 text-gray-300"
        >
          Password
        </label>
        <input
          onChange={handleChangeInput}
          type="password"
          name="password"
          id="password"
          className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
          bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
          placeholder="********"
        />
      </div>
      {/* button for submission */}
      <button
        type="submit"
        className="w-full text-white focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s"
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {/* div to go to login page */}
      <div className="text-sm font-medium text-gray-300">
        Already have an account?{" "}
        <a
          href="#"
          className="text-blue-700 hover:underline"
          onClick={handleClick}
        >
          Log In
        </a>
      </div>
    </form>
  );
};

export default Signup;
