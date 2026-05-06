import { useState } from 'react';

export default function UploadModal({ open, onClose }) {
  const [fileInfo, setFileInfo] = useState(null);

  function handleFileSelected(file) {
    if (!file) return;
    setFileInfo({ name: file.name, size: (file.size / 1024).toFixed(1) });
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelected(file);
  }

  function handleDropzoneClick() {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.csv';
    inp.onchange = e => handleFileSelected(e.target.files[0]);
    inp.click();
  }

  function handleClose() {
    setFileInfo(null);
    onClose();
  }

  return (
    <div
      className={`side-modal-overlay${open ? ' open' : ''}`}
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="side-modal">
        <div className="sm-header">
          <span className="sm-title">Batch Upload</span>
          <button className="sm-close" onClick={handleClose}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="sm-body">
          {/* Step 1 */}
          <div className="upload-step">
            <div className="upload-step-title">1. Download a template file.</div>
            <button className="btn-download-tpl">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Template
            </button>
          </div>
          {/* Step 2 */}
          <div className="upload-step">
            <div className="upload-step-title">2. Add your data to template file.</div>
            <p className="upload-step-note">If using Excel, make sure to export or save as .csv</p>
            <p className="upload-step-warning">Reminder : Do not modify template title fields, or errors may occur!</p>
          </div>
          {/* Step 3 */}
          <div className="upload-step" style={{ marginBottom: 0 }}>
            <div className="upload-step-title">3. Upload Batch File.</div>
            <div
              className="upload-dropzone"
              onClick={handleDropzoneClick}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
            >
              <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <polyline points="16 16 12 12 8 16"/>
                <line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
              <span className="upload-dropzone-label">
                {fileInfo ? fileInfo.name : 'Click or drag file to this area to upload'}
              </span>
              <span className="upload-dropzone-desc">
                {fileInfo ? `${fileInfo.size} KB · ready to upload` : 'Supports .csv files only'}
              </span>
            </div>
          </div>
        </div>
        <div className="sm-footer">
          <button className="sm-btn-cancel" onClick={handleClose}>Cancel</button>
          <button
            className="sm-btn-save"
            disabled={!fileInfo}
            style={fileInfo ? { color: 'var(--text-primary)', cursor: 'pointer', borderColor: 'var(--neutral-400)' } : {}}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
