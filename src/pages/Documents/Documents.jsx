import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Trash2, Loader2, CheckCircle2, Clock, AlertCircle, File } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Layout/Header';
import './Documents.css';

const API_URL = 'http://localhost:3001/api';

const documentTypes = [
  { value: 'bank_statement', label: 'Bank Statement' },
  { value: 'pay_stub', label: 'Pay Stub' },
  { value: 'utility_bill', label: 'Utility Bill' },
  { value: 'rent_receipt', label: 'Rent Receipt' },
  { value: 'tax_return', label: 'Tax Return' },
  { value: 'employment_letter', label: 'Employment Letter' },
  { value: 'other', label: 'Other' }
];

const statusIcons = {
  pending: <Clock size={16} />,
  processing: <Loader2 size={16} className="spin" />,
  verified: <CheckCircle2 size={16} />,
  rejected: <AlertCircle size={16} />
};

const statusColors = {
  pending: 'status-pending',
  processing: 'status-processing',
  verified: 'status-verified',
  rejected: 'status-rejected'
};

export default function Documents() {
  const { token } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState('bank_statement');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, [token]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${API_URL}/documents`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', selectedType);

    try {
      const response = await fetch(`${API_URL}/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setDocuments(prev => [data.document, ...prev]);
      } else {
        setError(data.error || 'Failed to upload document');
      }
    } catch (err) {
      setError('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <Header title="Documents" subtitle="Upload and manage your verification documents" />
      <div className="page-content">
        <div className="documents-container">
          {/* Upload Section */}
          <div className="card upload-section">
            <h2>Upload Document</h2>
            <p>Upload documents to verify your financial behaviors and build your trust score.</p>

            <div className="upload-controls">
              <div className="type-selector">
                <label>Document Type</label>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                  {documentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div
              className={`upload-dropzone ${dragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx,.xls"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />

              {uploading ? (
                <>
                  <Loader2 size={48} className="spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={48} />
                  <span>Drag & drop or click to upload</span>
                  <span className="upload-hint">PDF, JPG, PNG, CSV, XLSX (max 10MB)</span>
                </>
              )}
            </div>

            {error && <div className="upload-error">{error}</div>}
          </div>

          {/* Documents List */}
          <div className="card documents-list-section">
            <h2>Your Documents</h2>

            {loading ? (
              <div className="documents-loading">
                <Loader2 size={24} className="spin" />
                <span>Loading documents...</span>
              </div>
            ) : documents.length === 0 ? (
              <div className="documents-empty">
                <FileText size={48} />
                <p>No documents uploaded yet</p>
                <span>Upload your first document to start building your trust score</span>
              </div>
            ) : (
              <div className="documents-list">
                {documents.map(doc => (
                  <div key={doc.id} className="document-item">
                    <div className="document-icon">
                      <File size={24} />
                    </div>
                    <div className="document-info">
                      <span className="document-name">{doc.filename}</span>
                      <span className="document-meta">
                        {documentTypes.find(t => t.value === doc.documentType)?.label || doc.documentType}
                        {' • '}
                        {formatFileSize(doc.fileSize)}
                        {' • '}
                        {formatDate(doc.uploadedAt)}
                      </span>
                    </div>
                    <div className={`document-status ${statusColors[doc.status]}`}>
                      {statusIcons[doc.status]}
                      <span>{doc.status}</span>
                    </div>
                    <button
                      className="document-delete"
                      onClick={() => handleDelete(doc.id)}
                      title="Delete document"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
