import { auth } from "@/firebase/firebase";
import React from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { FiLogOut } from "react-icons/fi";

const Logout: React.FC = () => {
  // using firebase logout function
  const [signOut, loading, error] = useSignOut(auth);

  //logout function
  const handleLogout = () => {
    signOut();
  };
  return (
    // button with logout functionality
    <button
      className="bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange"
      onClick={handleLogout}
    >
      <FiLogOut />
    </button>
  );
};
export default Logout;
