import React, { useState } from "react";
import MuiStepper from "../components/MUI/MuiStepper";
import Nav from "../components/Navbar/Nav";
import Link from "next/link";
import { getSession } from "next-auth/react";
import data from "../public/dpmSites.json";
export default function Admin(session) {
  const dpmSiteData = data.query;
  const [array, setarray] = useState(dpmSiteData);

  return (
    <>
      <section className=" bg-cover bg-center font-Barlow pb-2 bg-white">
        <Nav session={session} />
        <div className="md:container px-24  pt-5 md:text-left text-center flex justify-between">
          <h1 className="text-2xl font-semibold  text-[#171717] mb-8">
            DPM Import Tool
          </h1>
        </div>
      </section>
      <div className="flex justify-between">
        <div></div>
        <div className="mr-4">
          <a
            href="/uploads"
            className="rounded-md bg-gray-100 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-[#ffcf5e] font-semibold p-2"
          >
            View Uploaded Files
          </a>
        </div>
      </div>
      <div className="grid place-items-center mt-10">
        <div className=" w-11/12">
          <MuiStepper data={array} />
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  return { props: { session } };
}
