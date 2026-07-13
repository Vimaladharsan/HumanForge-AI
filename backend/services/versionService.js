const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const versionsDir = path.join(__dirname, '../versions');

// Ensure versions directory exists
fs.ensureDirSync(versionsDir);

// Save version
const saveVersion = async (documentId, content, metadata = {}) => {
  try {
    const versionId = uuidv4();
    const timestamp = new Date().toISOString();
    
    const versionData = {
      versionId,
      documentId,
      content,
      timestamp,
      metadata: {
        ...metadata,
        createdAt: timestamp
      }
    };
    
    const versionPath = path.join(versionsDir, documentId);
    fs.ensureDirSync(versionPath);
    
    const versionFile = path.join(versionPath, `${versionId}.json`);
    await fs.writeJSON(versionFile, versionData, { spaces: 2 });
    
    // Update index
    const indexPath = path.join(versionPath, 'index.json');
    let index = [];
    
    if (await fs.pathExists(indexPath)) {
      index = await fs.readJSON(indexPath);
    }
    
    index.push({
      versionId,
      timestamp,
      metadata: metadata
    });
    
    // Sort by timestamp (newest first)
    index.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    await fs.writeJSON(indexPath, index, { spaces: 2 });
    
    return versionData;
  } catch (error) {
    throw new Error(`Failed to save version: ${error.message}`);
  }
};

// Get versions for a document
const getVersions = async (documentId) => {
  try {
    const versionPath = path.join(versionsDir, documentId);
    const indexPath = path.join(versionPath, 'index.json');
    
    if (!await fs.pathExists(indexPath)) {
      return [];
    }
    
    const index = await fs.readJSON(indexPath);
    return index;
  } catch (error) {
    throw new Error(`Failed to get versions: ${error.message}`);
  }
};

// Compare two versions
const compareVersions = async (documentId, version1, version2) => {
  try {
    const versionPath = path.join(versionsDir, documentId);
    
    const version1Path = path.join(versionPath, `${version1}.json`);
    const version2Path = path.join(versionPath, `${version2}.json`);
    
    if (!await fs.pathExists(version1Path) || !await fs.pathExists(version2Path)) {
      throw new Error('One or both versions not found');
    }
    
    const v1Data = await fs.readJSON(version1Path);
    const v2Data = await fs.readJSON(version2Path);
    
    // Simple diff (word-level)
    const words1 = v1Data.content.split(/\s+/);
    const words2 = v2Data.content.split(/\s+/);
    
    const added = [];
    const removed = [];
    
    // Basic comparison
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    words2.forEach(word => {
      if (!set1.has(word)) {
        added.push(word);
      }
    });
    
    words1.forEach(word => {
      if (!set2.has(word)) {
        removed.push(word);
      }
    });
    
    return {
      version1: {
        id: version1,
        timestamp: v1Data.timestamp
      },
      version2: {
        id: version2,
        timestamp: v2Data.timestamp
      },
      changes: {
        added: added.slice(0, 50), // Limit to 50 for performance
        removed: removed.slice(0, 50),
        contentChanged: v1Data.content !== v2Data.content
      }
    };
  } catch (error) {
    throw new Error(`Failed to compare versions: ${error.message}`);
  }
};

// Restore a version
const restoreVersion = async (documentId, versionId) => {
  try {
    const versionPath = path.join(versionsDir, documentId);
    const versionFile = path.join(versionPath, `${versionId}.json`);
    
    if (!await fs.pathExists(versionFile)) {
      throw new Error('Version not found');
    }
    
    const versionData = await fs.readJSON(versionFile);
    
    // Save as a new version (the restored version)
    const restoredVersion = await saveVersion(documentId, versionData.content, {
      restoredFrom: versionId,
      restoredAt: new Date().toISOString(),
      isRestore: true
    });
    
    return restoredVersion;
  } catch (error) {
    throw new Error(`Failed to restore version: ${error.message}`);
  }
};

module.exports = {
  saveVersion,
  getVersions,
  compareVersions,
  restoreVersion
};
