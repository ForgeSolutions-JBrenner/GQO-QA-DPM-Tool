import React from "react";
import MuiStepper from "../components/MUI/MuiStepper";
import Nav from "../components/Navbar/Nav";
import Link from 'next/link'
import {getSession} from "next-auth/react"
export default function Admin(session) {

  return (
    <>
      <section className=" bg-cover bg-center font-Barlow pb-2 bg-white">
        <Nav session={session}/>
        <div className="md:container px-24  pt-5 md:text-left text-center">
          <h1 className="text-2xl font-semibold  text-[#171717] mb-8">
            DPM Import Tool
          </h1>
        </div>
      </section>
      <div className="grid place-items-center mt-10">
        <div className=" w-11/12">
          <MuiStepper/>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps(ctx) {
  const session = await getSession(ctx)
  return ({props: {session}})
}