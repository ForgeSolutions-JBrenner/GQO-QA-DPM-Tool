import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/solid";

function SignInButton() {
  // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
  const { instance } = useMsal();

  return (
    <button
      onClick={() =>
        signIn("azure", {
          callbackUrl: `${window.location.origin}/dpm`,
        })
      }
      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#ffc500] hover:text-black hover:bg-[#ffb500] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffb500]"
    >
      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
        <svg
          className="h-5 w-5 text-white group-hover:text-black"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      Sign in
    </button>
  );
}

function WelcomeUser() {
  const { accounts } = useMsal();
  const username = accounts[0].username;

  return <p>Welcome, {username}</p>;
}

export default function Home() {
  let [open, setopen] = useState(false);
  return (
    <>
      <nav className="flex items-center justify-between pt-2 px-4 border-b-2 border-gray-300 shadow-lg w-full">
        <img
          src={open ? "/images/icon-close.svg" : "/images/icon-hamburger.svg"}
          className="md:hidden  fixed right-5 cursor-pointer z-20 top-6"
          onClick={() => setopen(!open)}
        />

        <Link href="/">
          <img src="/images/logo.png" alt="" className=" w-32 max-w-3xl ml-2" />
        </Link>
        {/* profile information icon  */}
        <div className="flex items-center">
          <p className="mr-2">Welcome!</p>
          <UserCircleIcon className="h-10 text-gray-400 cursor-pointer hover:scale-105" />
        </div>
      </nav>
      <div className="flex justify-center items-center h-auto mt-40">
        <Head>
          <title>GQO QA DPM</title>
        </Head>
        {/* <button
          onClick={() =>
            signIn("azure", {
              callbackUrl: `${window.location.origin}/dpm`,
            })
          }
        >
          Sign in
        </button> */}
        <AuthenticatedTemplate>
          <p>This will only render if a user is signed-in.</p>
          <WelcomeUser />
        </AuthenticatedTemplate>
        <div className="">
        <UnauthenticatedTemplate>
          <p>You are not authenticated to access this application.</p>
          <div className="mt-8">
            <SignInButton />
          </div>
        </UnauthenticatedTemplate>
        </div>
      </div>
    </>
  );
}
