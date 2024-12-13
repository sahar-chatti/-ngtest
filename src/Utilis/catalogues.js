import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [files, setFiles] = useState([]);
    const styles = {
        uploadContainer: {
            maxWidth: '500px',
            margin: '20px auto',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff'
        },
        formGroup: {
            marginBottom: '20px'
        },
        fileInput: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px'
        },
        uploadButton: {
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
            opacity: file ? 1 : 0.6,
            cursor: file ? 'pointer' : 'not-allowed'
        },
        statusMessage: {
            marginTop: '15px',
            padding: '10px',
            borderRadius: '4px',
            textAlign: 'center',
            backgroundColor: '#e8f5e9',
            color: '#2e7d32'
        },
        table: {
            width: '100%',
            marginTop: '20px',
            borderCollapse: 'collapse'
        },
        tableHeader: {
            backgroundColor: '#f5f5f5',
            fontWeight: 'bold'
        },
        tableCell: {
            padding: '10px',
            border: '1px solid #ddd',
            textAlign: 'left'
        },
        downloadButton: {
            backgroundColor: '#28a745',
            color: 'white',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setUploadStatus('Please select a file first');
            return;
        }
        if (file.size > 50 * 1024 * 1024) {
            setUploadStatus('File size exceeds 50MB limit');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post('http://192.168.1.170:3300/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUploadStatus(response.data.message);
            fetchFiles();
            setFile(null);
            e.target.reset();
        } catch (error) {
            if (error.response?.status === 413) {
                setUploadStatus('File size is too large. Maximum size is 50MB.');
            } else {
                setUploadStatus(error.response?.data?.message || 'Upload failed');
            }
        }
    };
    const fetchFiles = async () => {
        try {
            const response = await axios.get('http://192.168.1.170:3300/api/files');
            setFiles(response.data); 
        } catch (error) {
            console.error('Failed to fetch files:', error);
        }
    };
    useEffect(() => {
        fetchFiles();
    }, []);
    return (
        <div style={styles.uploadContainer}>
            <h2 style={{ textAlign: 'center' }}>Exporter un vouveau fichier</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        style={styles.fileInput}
                    />
                </div>
                <button
                    type="submit"
                    disabled={!file}
                    style={styles.uploadButton}
                >
                    Exporter
                </button>
            </form>
            {uploadStatus && (
                <div style={styles.statusMessage}>
                    {uploadStatus}
                </div>
            )}

            {files.length > 0 && (
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th style={styles.tableCell}>Nom de fichier </th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file, index) => (
                            <tr key={index}>
                                <td style={styles.tableCell}>{file.FILE_NAME}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default FileUpload;
