import React, {useState} from 'react';
import Path from 'path'
import Head from 'next/head';
import Router from 'next/router';
// import Excel from './Excel';
import uploadFileToBlob, {isStorageConfigured} from '../../utils/azure-storage-blob';

const storageConfigured = isStorageConfigured();
// function SignInButton() {
//   // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
//   // const { instance } = useMsal();

//   return <button onClick={() => instance.loginRedirect()}>Sign In</button>;
// }
// function routeit() {
//   Router.push('/dashboard')
// }

// function WelcomeUser() {
//   const { accounts } = useMsal();
//   const username = accounts[0].username;
//   const name = accounts[0].name

//   return(<> <p style={{padding: '10px'}}>Welcome, {name}, your email: {username}</p>
// <button onClick={routeit} style={{border: 'solid green', borderRadius: '10px', padding: '8px'}}>Click to go to dashboard</button>
// </>
//   )
// }

export default function Upload() {
    // all blobs in container
    const [blobList, setBlobList] = useState([]);

    // current file to upload into container
    const [fileSelected, setFileSelected] = useState(null);
  
    // UI/form management
    const [uploading, setUploading] = useState(false);
    const [inputKey, setInputKey] = useState(Math.random().toString(36));

    const onFileChange = (e) => {
      // capture file into state
      setFileSelected(e.target.files[0]);
    };
  
    const onFileUpload = async () => {
      // prepare UI
      setUploading(true);
  
      // *** UPLOAD TO AZURE STORAGE ***
      const blobsInContainer = await uploadFileToBlob(fileSelected);
  
      // prepare UI for results
      setBlobList(blobsInContainer);
  
      // reset state/form
      setFileSelected(null);
      setUploading(false);
      setInputKey(Math.random().toString(36));
    };
  
    // display form
    const DisplayForm = () => (
      <div className='border-0 '> 
        <input type="file" onChange={onFileChange} key={inputKey || ''} />
        <button className=' mt-6 text-center w-36 bg-[#FFB500] rounded-full text-white p-1 font-medium hover:bg-[#AF6D04]' type="submit" onClick={onFileUpload}>
          Upload!
            </button>
      </div>
    )
  
    // display file name and image
    const DisplayImagesFromContainer = () => (
      <div>
        <h2 className='font-semibold mt-2'>Uploads for current month: </h2>
        <ul>
          {blobList.map((item) => {
            return (
              <li key={item}>
                <div>
                  {Path.basename(item)}
                  <br />
                  <div className="flex items-center ">
                  <img src="/images/excel.png" alt={item} className='w-8 mr-2' />
                  <a href={item}>Click to open your file</a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  
  return (
    <div >
      <Head>
        <title>Azure AD Authentication using MSAL and Next.js</title>
      </Head>
{/* 
      <AuthenticatedTemplate>
        <p>This will only render if a user is signed-in.</p>
        <WelcomeUser />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <p>This will only render if a user is not signed-in.</p>
        <SignInButton />
      </UnauthenticatedTemplate> */}
      {/* <button onClick={routeit} style={{border: 'solid green', borderRadius: '10px', padding: '8px'}}>Click to go to dashboard</button> */}
     <br />
     <br />
      {/* <Excel /> */}

      <div>
      <h1 className='font-bold mb-2'>Upload file to Azure Blob Storage</h1>
      {storageConfigured && !uploading && DisplayForm()}
      {storageConfigured && uploading && <div>Uploading</div>}
      <hr />
      {storageConfigured && blobList.length > 0 && DisplayImagesFromContainer()}
      {!storageConfigured && <div>Storage is not configured.</div>}
    </div>
    </div>
  );
}