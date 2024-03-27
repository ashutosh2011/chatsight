"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function Analytics() {
  // State to store the uploaded file
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  // Handle file input change
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle file upload (placeholder function)
  const handleUpload = async() => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Network response was not ok.');

      const { data } = await response.json();

      // Redirect to analysis page with query params or through state
      router.push(`/analysis/${data.analysis_uid}`);

    } catch (error) {
      console.error('There was an error uploading the file:', error);
      alert('Error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col justify-between p-8 md:p-24">
      <div>
        <h1 className="text-3xl font-bold mb-6">Upload your chat file.</h1>
        <div className="flex flex-col items-center">
          <input type="file" onChange={handleFileChange} className="mb-4"/>
          <button onClick={handleUpload} className="px-4 py-2 rounded-md text-white bg-blue-500 dark:bg-black dark:border dark:border-white dark:hover:bg-white dark:hover:text-black">Analyze</button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">How to find your chat file?</h2>
        <ol className="list-decimal list-inside mt-4 text-lg">
          <li>Open WhatsApp on your phone.</li>
          <li>Navigate to the chat you wish to export.</li>
          <li>Tap the three dots in the top right corner and select &aposMore&apos.</li>
          <li>Tap &aposExport chat&apos.</li>
          <li>Choose &aposWITHOUT MEDIA&apos for a quicker export.</li>
          <li>Email the chat to yourself or save it to a cloud service.</li>
          <li>Download the chat file to your computer.</li>
          <li>Use the &aposUpload&apos button above to select and upload your chat file.</li>
        </ol>
      </div>
    </main>
  );
}
