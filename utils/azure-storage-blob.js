import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

const date = new Date();
const month = date.toLocaleString("en-us", { month: "long" });
const year = date.getFullYear();
const containerName = `dpm`;
const yearContainerName = year;
const monthContainerName = month;
const sasToken =
  "?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2023-04-01T04:26:13Z&st=2022-05-25T20:26:13Z&spr=https&sig=SWcPMaFAkaXZzXtVV83jeDswE%2BjaBeOzPs9Zz5E%2Bbzc%3D";
const storageAccountName = "strykeranalyticsblob";

//is Storage Configured
export const isStorageConfigured = () => {
  return !storageAccountName || !sasToken ? false : true;
};

//getBlobs in Container
//returns a list of blobs in container for display
const blobService = new BlobServiceClient(
  `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
);
const containerClient = blobService.getContainerClient(containerName);
const getBlobsInContainer = async (containerClient) => {
  const returnedBlobUrls = [];
  // console.log(returnedBlobUrls);
  // get list of blobs in container
  // eslint-disable-next-line
  for await (const blob of containerClient.listBlobsFlat()) {
    // if image is public, just construct URL
    returnedBlobUrls.push(
      `https://${storageAccountName}.blob.core.windows.net/${containerName}/${yearContainerName}/${monthContainerName}/${blob.name}`
    );
  }

  return returnedBlobUrls;
};

//Create a block blob in the specified container
const createBlobInContainer = async (containerClient, file) => {
  //Create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(
    year + "/" + month + "/" + file.name
  );

  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: file.type } };

  // upload file
  await blobClient.uploadData(file, options);
};

//Upload file to blob storage
const uploadFileToBlob = async (file) => {
  if (!file) return [];

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );

  // get Container - full public read access
  const containerClient = blobService.getContainerClient(containerName);
  await containerClient.createIfNotExists({
    access: "container",
  });

  // upload file
  await createBlobInContainer(containerClient, file);

  // get list of blobs in container
  return getBlobsInContainer(containerClient);
};
// </snippet_uploadFileToBlob>

export default uploadFileToBlob;
