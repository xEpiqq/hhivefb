"use client";
import { useState } from "react";

export default function Upload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("pdf", selectedFile);

        try {
            const response = await fetch("http://127.0.0.1:5001/harmonyhive-b4705/us-central1/convertPDFToPNG", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setMessage(`Success: ${data.result}`);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="w-full h-screen fixed top-0 left-0 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md">
                <input type="file" accept=".pdf" onChange={handleFileChange} />
                <button onClick={handleUpload} className="mt-4 bg-blue-500 text-white p-2 rounded">
                    Upload
                </button>
                {message && <p className="mt-4">{message}</p>}
            </div>
        </div>
    );
}
