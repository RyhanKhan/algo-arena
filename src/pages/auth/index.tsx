import Navbar from "@/components/Navbar/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import AuthModal from "@/components/Modals/AuthModal";
import { useRecoilValue } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";

type AuthPageProps = {};

const AuthPage: React.FC<AuthPageProps> = () => {
  const authModal = useRecoilValue(authModalState); //using recoil state?

  //state of
  const [user, loading, error] = useAuthState(auth);
  //state for page loading
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    //if user is logged in then showcase home page and not login page
    if (user) router.push("/");
    //if not logged in then set page loading to false
    if (!loading && !user) setPageLoading(false);
  }, [user, router, loading]);

  //until it check whether or not the user is logged in don't show the auth page
  if (pageLoading) return null;

  return (
    <div className="bg-gradient-to-b from-gray-600 to-black h-screen relative">
      <div className="max-w-7xl mx-auto">
        <Navbar />
        {/* pointer-events-none select-none means img isn't draggable */}
        <div className="flex items-center justify-center h-[calc(100vh-5rem)] pointer-events-none select-none">
          <Image src="/hero.png" alt="Hero img" width={700} height={700} />
        </div>
        {/* show authModal only when it is in open state */}
        {authModal.isOpen && <AuthModal />}
      </div>
    </div>
  );
};

export default AuthPage;
