import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [backendUrl, setBackendUrl] = useState('https://moviefinder-ec5p.onrender.com'); // <-- Replace with your real Render URL

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadStatus('Uploading...');

      const response = await axios.post(`${backendUrl}/upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        validateStatus: function (status) {
          return status >= 200 && status < 300; // Treat only 2xx as success
        }
      });

      console.log(response.data);
      setUploadStatus(`✅ Upload successful! Saved as: ${response.data.saved_as}`);
    } catch (error) {
      console.error(error);
      setUploadStatus('❌ Upload failed. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h2>Clip Finder</h2>

      <input type="file" accept="video/*" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload} style={{ padding: '10px 20px' }}>
        Upload Video
      </button>

      <p>{uploadStatus}</p>

      <br />
      <div style={{ marginTop: '20px', fontSize: '12px' }}>
        <label>Backend URL:</label><br />
        <input
          type="text"
          value={backendUrl}
          onChange={(e) => setBackendUrl(e.target.value)}
          style={{ width: '100%' }}
        />
        <small>Paste your backend URL above if different.</small>
      </div>
    </div>
  );
}

export default App;
