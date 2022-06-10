import Link from "next/link";
import React, { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/solid";
export default function Nav({ session }) {
  let [open, setopen] = useState(false);
  const menus = [{ name: "TECHNOLOGY" }];
  const [userName, setuserName] = useState(session.session.user.name);
  // if(!session) {
  //   setuserName('no user')
  // } else {
  //   setuserName('session.session.user.name')
  // }
  return (
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
        <p className="mr-2">{userName}</p>
        <UserCircleIcon className="h-10 text-gray-400 cursor-pointer hover:scale-105" />
      </div>
    </nav>
  );
}

export async function getServerSideProps(context) {
  const res = await fetch(process.env.server + `api/auth/session`);
  const { data } = res.json();
  return {
    props: {
      session: data,
    },
  };
}
