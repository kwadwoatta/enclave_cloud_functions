import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import * as fs from "fs-extra";
import { tmpdir } from "os";
import { join, dirname } from "path";
import * as sharp from "sharp";

admin.initializeApp(functions.config().firebase);

const gcs = admin.storage();
// const db = admin.firestore();

export default functions.storage.object().onFinalize(async object => {
  const bucket = gcs.bucket(object.bucket);
  const filePath = object.name as string;
  const fileName = filePath.split("/").pop();
  const bucketDir = dirname(filePath);

  const workingDir = join(tmpdir(), "thumbs");
  const tmpFilePath = join(workingDir, "source.png");

  if (fileName?.includes("@") || !object.contentType?.includes("image")) {
    console.log("exists, returning false...");
    return false;
  }

  // Ensure thumbnail dir exists
  await fs.ensureDir(workingDir);

  // Download source file
  await bucket.file(filePath).download({
    destination: tmpFilePath
  });

  // Resize the images and define an array of upload promises
  const sizes = [64, 128, 320, 640];

  const uploadPromises = sizes.map(async size => {
    const imageName = fileName?.split(".")[0];
    const imageExt = fileName?.split(".")[1];
    const thumbName = `${imageName}@${size}.${imageExt}`;
    const thumbPath = join(workingDir, thumbName);

    //   Resize source images
    return sharp(tmpFilePath)
      .resize(size, size)
      .toFile(thumbPath)
      .then(outputInfo => {
        // Upload to GCS
        return bucket
          .upload(thumbPath, {
            destination: join(bucketDir, thumbName)
          })
          .then(async res => {
            return res[0]
              .getSignedUrl({
                action: "read",
                expires: "01-01-2040"
              })
              .then(signedUrlRes => {
                console.log(`url: ${signedUrlRes[0]}`);

                // const data = {
                //   [size]: signedUrlRes[0]
                // };

                // if (bucket. === "cities")
                // return (
                //   db
                //     .collection("cities")
                //     .doc(imageName?.split("_")[0] as string)
                //     .set(data, {
                //       merge: true
                //     })
                //     // .then(res => console.log("written"))
                //     .catch(e => {
                //       console.log("Firebase write error");
                //       console.log(e);
                //       throw Error(e);
                //     })
                // );
                //  else return;
              })
              .catch(e => {
                console.log(e);
                throw Error(e);
              });
          });
      });
  });

  // Run upload operations
  await Promise.all(uploadPromises).catch(e => {
    console.log(e);
    throw Error(e.message);
  });

  return fs.remove(workingDir).catch(e => {
    console.log(e);
    throw Error(e.message);
  });
});
