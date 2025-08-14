import { useState } from "react";

export default function UploadImage() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData, // fetch automatically sets correct headers for FormData
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      console.log("Uploaded image URL:", data.url);

      alert(`Image uploaded! URL: ${data.url}`);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  return (
    <div className="text-white" style={{ padding: "20px" }}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept="image/*"
      />
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
        Upload
      </button>
    </div>
  );
}
