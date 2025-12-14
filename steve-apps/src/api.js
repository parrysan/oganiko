import axios from 'axios';

export const fetchDriveFiles = async (token, folderId) => {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/drive/v3/files`,
            {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
                    fields: 'files(id, name, thumbnailLink, webContentLink)',
                    pageSize: 1000 // Increased page size
                }
            }
        );
        return response.data.files || [];
    } catch (error) {
        console.error("Error fetching Drive files:", error);
        throw error;
    }
};

export const fetchDocs = async (token, folderId) => {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/drive/v3/files`,
            {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.document' and trashed = false`,
                    fields: 'files(id, name, webViewLink)',
                    pageSize: 100
                }
            }
        );
        return response.data.files || [];
    } catch (error) {
        console.error("Error fetching Docs:", error);
        throw error;
    }
};

export const fetchSheetData = async (token, sheetId) => {
    try {
        const response = await axios.get(
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:Z`, // Fetch all columns
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data.values || [];
    } catch (error) {
        console.error("Error fetching Sheet data:", error);
        throw error;
    }
};

export const deleteDriveFile = async (token, fileId) => {
    try {
        await axios.delete(
            `https://www.googleapis.com/drive/v3/files/${fileId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return true;
    } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
    }
};

export const updateSheetStatus = async (token, sheetId, range, newStatus) => {
    try {
        await axios.put(
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=USER_ENTERED`,
            { values: [[newStatus]] },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return true;
    } catch (error) {
        console.error("Error updating sheet status:", error);
        throw error;
    }
};

export const deleteSheetRow = async (token, spreadsheetId, rowIndex) => {
    console.log(`[deleteSheetRow] Called with spreadsheetId=${spreadsheetId}, rowIndex=${rowIndex}`);
    try {
        // 1. Get the Sheet GID (assuming the first sheet)
        const metadataResponse = await axios.get(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const sheetId = metadataResponse.data.sheets[0].properties.sheetId;
        console.log(`[deleteSheetRow] Fetched sheetId (GID): ${sheetId}`);

        // 2. Delete the row (rowIndex is 1-based from App.jsx, API needs 0-based)
        // API uses startIndex (inclusive) and endIndex (exclusive)
        const startIndex = rowIndex - 1;
        const endIndex = rowIndex;
        console.log(`[deleteSheetRow] Deleting range: startIndex=${startIndex}, endIndex=${endIndex}`);

        const response = await axios.post(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
            {
                requests: [
                    {
                        deleteDimension: {
                            range: {
                                sheetId: sheetId,
                                dimension: "ROWS",
                                startIndex: startIndex,
                                endIndex: endIndex
                            }
                        }
                    }
                ]
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("[deleteSheetRow] Delete response:", response.status);
        return true;
    } catch (error) {
        console.error("Error deleting sheet row:", error);
        if (error.response) {
            console.error("Error details:", error.response.data);
        }
        // Don't throw, just log. We don't want to break the UI if sheet delete fails but drive delete worked.
        console.warn("Failed to delete sheet row, but image was deleted.");
        return false;
    }
};
