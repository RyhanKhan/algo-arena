import { authModalState } from "@/atoms/authModalAtom";
import React, { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import Signup from "./Signup";
import { useRecoilValue, useSetRecoilState } from "recoil";

type AuthModalProps = {};

const AuthModal: React.FC<AuthModalProps> = () => {
  const authModal = useRecoilValue(authModalState);
  const closeModal = useCloseModal();
  return (
    <>
      <div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60"
        onClick={closeModal}
      ></div>
      <div className="w-full sm:w-[450px]  absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  flex justify-center items-center">
        <div className="relative w-full h-full mx-auto flex items-center justify-center">
          <div className="bg-white rounded-lg shadow relative w-full bg-gradient-to-b from-brand-orange to-slate-900 mx-6">
            <div className="flex justify-end p-2">
              <button
                type="button"
                className="bg-transparent  rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 hover:text-white text-white"
                onClick={closeModal}
              >
                {/* using a react icon for the close symbol */}
                <IoClose className="h-5 w-5" />
              </button>
            </div>
            {authModal.type === "login" ? (
              <Login />
            ) : authModal.type === "register" ? (
              <Signup />
            ) : (
              <ResetPassword />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default AuthModal;

//creating a custom hook to close our auth pages
function useCloseModal() {
  //getting state functionality
  const setAuthModal = useSetRecoilState(authModalState);
  //making the change state function as before
  const closeModal = () => {
    setAuthModal((prev) => ({ ...prev, isOpen: false, type: "login" }));
  };

  //making a useEffect hook that if we press escape button, it should close the auth-pages
  useEffect(() => {
    //writing the function logic
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    //adding the event listener to the entire window
    window.addEventListener("keydown", handleEsc);
    //cleanup function
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  //returning the state functionality
  return closeModal;
}