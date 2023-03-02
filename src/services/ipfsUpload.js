import axios from "axios";

const onUploadProgress = (progressEvent) => {
  const { loaded, total } = progressEvent;
  const percentComplete = (loaded / total) * 100;

  console.log(`${Math.round(percentComplete)}%`);
};

export default async function ipfsUpload(file) {
  const { data } = await axios.post("https://api.nft.storage/upload", file, {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_JWT_TOKEN}`,
    },
    onUploadProgress,
  });

  return data;
}