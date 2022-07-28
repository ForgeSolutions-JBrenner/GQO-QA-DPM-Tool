import { getSession } from "next-auth/react";
import React, { useState } from "react";
import Nav from "../components/Navbar/Nav";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import getBlobsInContainer from "../utils/azure-storage-blob";
const sasToken =
  "?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2023-04-01T04:26:13Z&st=2022-05-25T20:26:13Z&spr=https&sig=SWcPMaFAkaXZzXtVV83jeDswE%2BjaBeOzPs9Zz5E%2Bbzc%3D";
const storageAccountName = "strykeranalyticsblob";

export default function Uploads(session) {
  const [blobData, setblobData] = useState([]);
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );
  // const downloadBlob = async () => {
  //     //https://strykeranalyticsblob.blob.core.windows.net/dpm/2022/July/Belfast-6-2022.xlsx
  //     const parent = "dpm";
  //     const year = '2022'
  //     const month='July'
  // const blobName = "Belfast-6-2022.xlsx";
  // const fullContainer = parent + '/' + year + '/' + month + '/'
  // console.log(fullContainer)
  //     const containerClient = blobService.getContainerClient(fullContainer);
  //     const blobClient = containerClient.getBlobClient(blobName);

  //     // Get blob content from position 0 to the end
  //     // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
  //     const downloadBlockBlobResponse = await blobClient.download();
  //     const downloaded = (
  //       await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
  //     ).toString();
  //     console.log("Downloaded blob content:", downloaded);

  //     // [Node.js only] A helper method used to read a Node.js readable stream into a Buffer
  //     async function streamToBuffer(readableStream) {
  //       return new Promise((resolve, reject) => {
  //         const chunks = [];
  //         readableStream.on("data", (data) => {
  //           chunks.push(data instanceof Buffer ? data : Buffer.from(data));
  //         });
  //         readableStream.on("end", () => {
  //           resolve(Buffer.concat(chunks));
  //         });
  //         readableStream.on("error", reject);
  //       });
  //     }
  //   }

  const getdata = async () => {
    const containerClient = blobService.getContainerClient("dpm");
    let i = 1;
    let blobs = containerClient.listBlobsFlat();
    console.log(blobs);
    for await (const blob of containerClient.listBlobsFlat()) {
      setblobData((blobData) => [...blobData, blob.name]);
    }
  };

  return (
    <>
      <section className=" bg-cover bg-center font-Barlow pb-2 bg-white">
        <Nav session={session} />
        <div className="md:container px-24  pt-5 md:text-left text-center">
          <h1 className="text-2xl font-semibold  text-[#171717] mb-8">
            DPM Import Tool
          </h1>
        </div>
      </section>
      <div className="flex justify-between">
        <div></div>
        <div className="mr-4">
          <a
            href="/dpm"
            className="rounded-md bg-gray-100 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-[#ffcf5e] font-semibold p-2"
          >
            Upload Data
          </a>
        </div>
      </div>
      <div className="grid place-items-center ">
        <div className=" w-11/12">
          <button
            className="bg-gray-100 dark:hover:bg-bray-800 p-2 rounded-md font-semibold hover:scale-105"
            onClick={getdata}
          >
            Refresh Latest Data
          </button>
        </div>
        <div className="mt-4 w-11/12">
          {blobData.map((item, index) => {
            return (
              <ol className="ml-6 list-disc" key={index}>
                <li>{item}</li>
              </ol>
            );
          })}
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  return {
    props: {
      session,
    },
  };
}
