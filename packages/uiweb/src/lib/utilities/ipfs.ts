const IPFS_BASE_URL = "https://ipfs.io/ipfs/";

/**
 * @description extract the ipfs HASH from the name of an image i.e www.xyz.com/abc/ipfshash.jpg => ipfshash
 * @param notificationBody
 * @returns the ipfs hash extracted from the image name
 */
export function extractIPFSHashFromImageURL(imageURL: string | undefined) {
  if (!imageURL) return { type: "http", url: "" };
  if (imageURL.includes("ipfs")) return { type: "ipfs", url: imageURL };
  if (imageURL.includes("base64")) return { type: "base64", url: imageURL };
  const match = imageURL.match(/(\w+).jpg/);
  const output = match ? `${IPFS_BASE_URL}${match[1]}` : "";
  return { type: "http", url: output };
}

