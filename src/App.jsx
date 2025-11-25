import { useState, useEffect, useMemo } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { NICHES, DOCS_FOLDER_ID, IMAGES_FOLDER_ID } from './config/niches';
import { fetchDriveFiles, fetchDocs, fetchSheetData, deleteDriveFile, updateSheetStatus, deleteSheetRow } from './api';
import './App.css';
import leafIcon from './assets/leaf.png';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem('googleAccessToken'));
  // Hardcode the user-provided Sheet ID as default
  const [sheetId, setSheetId] = useState(localStorage.getItem('sheetId') || '1p2xDFAUrdUks-3NOlW-l6XnCV9_g06pZbeMi2xsUr2A');
  const [images, setImages] = useState([]);
  const [docs, setDocs] = useState([]);
  const [sheetData, setSheetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNiche, setSelectedNiche] = useState('ALL');
  const [selectedImage, setSelectedImage] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && token) {
      loadData();
    }
  }, [user, token]);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      setToken(accessToken);
      sessionStorage.setItem('googleAccessToken', accessToken);
      setUser(result.user);
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('googleAccessToken');
    setImages([]);
    setDocs([]);
  };

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    if (sheetId) localStorage.setItem('sheetId', sheetId);

    try {
      // 1. Fetch Images
      const driveFiles = await fetchDriveFiles(token, IMAGES_FOLDER_ID);

      // 2. Fetch Docs (Niche & Avatar)
      const docFiles = await fetchDocs(token, DOCS_FOLDER_ID);
      setDocs(docFiles);

      // 3. Fetch Sheet Data (Optional)
      let rows = [];
      if (sheetId) {
        try {
          rows = await fetchSheetData(token, sheetId);
          setSheetData(rows);
          console.log("Fetched Sheet Data:", rows.length, "rows");
        } catch (e) {
          console.warn("Sheet fetch failed", e);
        }
      }

      // 4. Process Images
      // Identify Column Indices from Header Row (Row 0)
      const headerRow = rows.length > 0 ? rows[0].map(c => c.toLowerCase()) : [];

      // Find indices dynamically, fallback to observed values from debug info
      const titleIdx = headerRow.findIndex(h => h.includes('concept_title'));
      const statusIdx = headerRow.findIndex(h => h === 'status'); // Exact match to avoid confusion
      const driveIdIdx = headerRow.findIndex(h => h.includes('drive_file_id'));

      const TITLE_COL = titleIdx !== -1 ? titleIdx : 6;   // Column G
      const STATUS_COL = statusIdx !== -1 ? statusIdx : 20; // Column U
      const DRIVE_ID_COL = driveIdIdx !== -1 ? driveIdIdx : 22; // Column W
      const AVATAR_NAME_COL = 3; // Column D

      console.log(`Mapping: Title=${TITLE_COL}, Status=${STATUS_COL}, DriveID=${DRIVE_ID_COL}`);

      const processedImages = driveFiles.map(file => {
        // Parse Niche Code from Filename (e.g., OG-HFO-123.png -> HFO, OG-PPNV-123.png -> PPNV)
        const match = file.name.match(/-([A-Z]{3,4})-/);
        const nicheCode = match ? match[1] : 'UNCATEGORIZED';

        // Find Metadata in Sheet
        let metadata = {};
        let rowIndex = -1;

        if (rows.length > 1) {
          // Match by Drive File ID (Most Robust)
          rowIndex = rows.findIndex((r, i) => {
            if (i === 0) return false; // Skip header
            return r[DRIVE_ID_COL] === file.id;
          });

          // Fallback: If ID match fails, try loose filename match in ID column (Index 0)
          if (rowIndex === -1) {
            const filenameNoExt = file.name.replace(/\.[^/.]+$/, "");
            rowIndex = rows.findIndex((r, i) => {
              if (i === 0) return false;
              // Check ID column (0) or just search the whole row as a last resort
              return r[0] && String(r[0]).includes(filenameNoExt);
            });
          }

          if (rowIndex !== -1) {
            const row = rows[rowIndex];
            metadata = {
              title: row[TITLE_COL],
              status: row[STATUS_COL] || 'New',
              avatarName: row[AVATAR_NAME_COL], // Column D
              rowIndex: rowIndex + 1 // 1-based index for API
            };
          }
        }

        return {
          id: file.id,
          name: file.name,
          thumbnailLink: file.thumbnailLink,
          webContentLink: file.webContentLink,
          fullUrl: `https://lh3.googleusercontent.com/d/${file.id}`,
          nicheCode,
          metadata,
          rowIndex: metadata.rowIndex
        };
      });

      setImages(processedImages);

    } catch (err) {
      console.error("Data Load Error:", err);
      if (err.response && err.response.status === 401) {
        alert("Your session has expired. Please sign in again.");
        handleLogout();
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (image) => {
    if (!window.confirm("Are you sure you want to delete this image? This cannot be undone.")) return;
    console.log("[handleDelete] Starting delete for:", image.name, "ID:", image.id);
    try {
      // 1. Delete from Drive
      await deleteDriveFile(token, image.id);
      console.log("[handleDelete] Drive file deleted.");

      // 2. Delete from Sheet (if linked)
      console.log("[handleDelete] Checking sheet deletion. SheetID:", sheetId, "RowIndex:", image.metadata?.rowIndex);
      if (sheetId && image.metadata && image.metadata.rowIndex) {
        console.log("[handleDelete] Calling deleteSheetRow...");
        await deleteSheetRow(token, sheetId, image.metadata.rowIndex);
      } else {
        console.warn("[handleDelete] Skipping sheet delete. Missing SheetID or RowIndex.");
      }

      // 3. Update UI
      setImages(prev => prev.filter(img => img.id !== image.id));
      setSelectedImage(null);
    } catch (err) {
      console.error("[handleDelete] Error:", err);
      alert("Failed to delete image: " + err.message);
    }
  };

  const handleStatusChange = async (image, newStatus) => {
    if (!sheetId || !image.rowIndex) {
      alert("Cannot update status: Sheet ID missing or image not found in sheet.");
      return;
    }
    setStatusUpdating(true);
    try {
      // Status is Column U (Index 20)
      const range = `U${image.rowIndex}`;
      await updateSheetStatus(token, sheetId, range, newStatus);

      // Update local state
      setImages(prev => prev.map(img => {
        if (img.id === image.id) {
          const updatedImg = { ...img, metadata: { ...img.metadata, status: newStatus } };
          // Also update selectedImage if it's the one being modified
          if (selectedImage && selectedImage.id === image.id) {
            setSelectedImage(updatedImg);
          }
          return updatedImg;
        }
        return img;
      }));
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Derived State for UI
  const filteredImages = useMemo(() => {
    if (selectedNiche === 'ALL') return images;
    return images.filter(img => img.nicheCode === selectedNiche);
  }, [images, selectedNiche]);

  const getNicheDocs = (nicheCode) => {
    const nicheDef = NICHES.find(n => n.code === nicheCode);
    if (!nicheDef) return null;

    const nicheDoc = docs.find(d => d.name.includes(nicheDef.docName));
    const avatarDoc = docs.find(d => d.name.includes(nicheDef.avatarDocName));

    return { nicheDef, nicheDoc, avatarDoc };
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <img src={leafIcon} alt="Leaf" className="logo-icon" />
          <span>POD Image Viewer</span>
        </div>

        {user ? (
          <div className="user-menu">
            {!sheetId && (
              <div className="sheet-input-compact">
                <input
                  type="text"
                  placeholder="Sheet ID"
                  onChange={(e) => setSheetId(e.target.value)}
                  onBlur={() => sheetId && loadData()}
                />
              </div>
            )}
            <span className="image-count">
              {filteredImages.length} images
            </span>
            <select
              className="niche-select"
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
            >
              <option value="ALL">All Niches</option>
              {NICHES.map(niche => (
                <option key={niche.code} value={niche.code}>
                  {niche.name}
                </option>
              ))}
            </select>

            <img src={user.photoURL} alt="User" className="avatar" />
            <button onClick={handleLogout} className="logout-btn">Sign Out</button>
          </div>
        ) : (
          <button onClick={handleLogin} className="login-btn">Sign In with Google</button>
        )}
      </header>

      {/* Main Content */}
      <main>
        {error && <div className="error-banner">{error}</div>}

        {/* Image Grid */}
        <div className="image-grid">
          {filteredImages.map(img => (
            <div key={img.id} className="image-card" onClick={() => setSelectedImage(img)}>
              <div className="image-wrapper">
                <img src={img.thumbnailUrl || img.fullUrl} alt={img.name} loading="lazy" />
              </div>
              <div className="card-details">
                <div className="tags">
                  {img.metadata.status && (
                    <span className={`status-tag ${img.metadata.status.toLowerCase()}`}>
                      {img.metadata.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {/* Close button removed as per request */}

            <div className="modal-layout">
              <div className="modal-image">
                <img src={selectedImage.fullUrl} alt={selectedImage.name} />
              </div>

              <div className="modal-sidebar">
                <div className="sidebar-content">
                  <h2 className="concept-title">{selectedImage.metadata.title || selectedImage.name}</h2>

                  {(() => {
                    const nicheData = getNicheDocs(selectedImage.nicheCode);
                    if (!nicheData) return <p>Unknown Niche</p>;

                    const { nicheDef, nicheDoc, avatarDoc } = nicheData;
                    return (
                      <div className="doc-links">
                        {nicheDoc ? (
                          <a href={nicheDoc.webViewLink} target="_blank" rel="noreferrer" className="doc-link">
                            {nicheDef.name}
                          </a>
                        ) : (
                          <span className="doc-link-disabled">{nicheDef.name}</span>
                        )}

                        {/* Avatar Link - Always display as "Niche Avatar" */}
                        {avatarDoc ? (
                          <a href={avatarDoc.webViewLink} target="_blank" rel="noreferrer" className="doc-link">
                            Niche Avatar
                          </a>
                        ) : (
                          <span className="doc-link-disabled">
                            Niche Avatar
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>

                <div className="sidebar-footer">
                  <div className="status-control">
                    <label>Status</label>
                    <select
                      value={selectedImage.metadata.status || 'New'}
                      onChange={(e) => handleStatusChange(selectedImage, e.target.value)}
                      disabled={statusUpdating}
                    >
                      <option value="New">New</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Review">Review</option>
                    </select>
                  </div>

                  <button
                    className="delete-text-btn"
                    onClick={() => handleDelete(selectedImage)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
