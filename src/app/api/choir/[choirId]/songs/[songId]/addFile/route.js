import { NextResponse } from "next/server";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, storage } from "@/lib/firestoreAdapter";
import { ref, uploadBytes } from "firebase/storage";
import pdf2img from "pdf-img-convert";
import { formidableConfig, formidablePromise, fileConsumer, } from "@/lib/formitable"; 
import { GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";

GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

export async function POST(request, { params }) {
  try {
    const data = await request.formData();
    const { choirId, songId } = params;

    let file = data.get("file");
    let fileName = data.get("fileName");
    if (!file) {
      return NextResponse.json({ status: 400, message: "No file found" });
    }
    if (file.size > formidableConfig.maxFileSize) {
      return NextResponse.json({ status: 400, message: "File too large" });
    }

    // get the song document from the firestore
    const songDocRef = doc(db, "choirs", choirId, "songs", songId);
    const songDoc = await getDoc(songDocRef);

    let fileRefs = [];

    // Check if file is pdf
    if (file.type == "application/pdf") {
      // convert pdf to image
      const outputImages = await pdf2img.convert(await file.arrayBuffer());
      fileName = fileName + ".png";

      // upload images to storage
      for (let i = 0; i < outputImages.length; i++) {
        const imageRef = ref(
          storage,
          choirId + "/songs/" + songId + "/" + fileName + i
        );
        await uploadBytes(imageRef, outputImages[i]);
        fileRefs.push(imageRef); // Add imageRef to fileRefs array
      }
      return NextResponse.json({
        status: 200,
        message: "PDF converted to images and uploaded successfully",
      });
    } else {
      // add the file to the storage
      const fileRef = ref(storage, choirId + "/songs/" + songId + "/" + fileName);
      await uploadBytes(fileRef, file);
      fileRefs.push(fileRef); // Add fileRef to fileRefs array
    }

    // update the song document with the file
    for (let i = 0; i < fileRefs.length; i++) {
      await updateDoc(songDocRef, {
        files: arrayUnion({
          name: fileName,
          url: fileRefs[i].fullPath,
        }),
      });
    }

    return NextResponse.json({
      status: 200,
      message: "File added successfully",
    });
  } catch (error) {
    console.error("Error adding file: ", error);
    return NextResponse.json({ status: 500, message: error.message });
  }
}
