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

// Get a single version's full content
const getVersion = async (documentId, versionId) => {
  try {
    const versionFile = path.join(versionsDir, documentId, `${versionId}.json`);
    if (!await fs.pathExists(versionFile)) {
      throw new Error('Version not found');
    }
    return await fs.readJSON(versionFile);
  } catch (error) {
    throw new Error(`Failed to get version: ${error.message}`);
  }
};

// Compare two versions with detailed diff
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
    
    // Line-level diff
    const lines1 = v1Data.content.split('\n');
    const lines2 = v2Data.content.split('\n');
    
    const addedLines = [];
    const removedLines = [];
    const modifiedLines = [];
    
    // Simple line-by-line comparison
    const maxLines = Math.max(lines1.length, lines2.length);
    
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 !== line2) {
        if (!line1 && line2) {
          addedLines.push({ line: i + 1, content: line2 });
        } else if (line1 && !line2) {
          removedLines.push({ line: i + 1, content: line1 });
        } else {
          modifiedLines.push({ 
            line: i + 1, 
            old: line1, 
            new: line2 
          });
        }
      }
    }
    
    // Word-level diff for summary
    const words1 = v1Data.content.split(/\s+/);
    const words2 = v2Data.content.split(/\s+/);
    
    const addedWords = [];
    const removedWords = [];
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    words2.forEach(word => {
      if (!set1.has(word)) {
        addedWords.push(word);
      }
    });
    
    words1.forEach(word => {
      if (!set2.has(word)) {
        removedWords.push(word);
      }
    });
    
    // Calculate change statistics
    const totalWords = words1.length;
    const changedWords = addedWords.length + removedWords.length;
    const changePercentage = totalWords > 0 ? Math.round((changedWords / totalWords) * 100) : 0;
    
    return {
      version1: {
        id: version1,
        timestamp: v1Data.timestamp,
        metadata: v1Data.metadata
      },
      version2: {
        id: version2,
        timestamp: v2Data.timestamp,
        metadata: v2Data.metadata
      },
      summary: {
        totalWords: totalWords,
        addedWords: addedWords.length,
        removedWords: removedWords.length,
        changePercentage: changePercentage,
        contentChanged: v1Data.content !== v2Data.content
      },
      lineChanges: {
        added: addedLines.slice(0, 100),
        removed: removedLines.slice(0, 100),
        modified: modifiedLines.slice(0, 100)
      },
      wordChanges: {
        added: addedWords.slice(0, 50),
        removed: removedWords.slice(0, 50)
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
      isRestore: true,
      originalTimestamp: versionData.timestamp
    });
    
    return restoredVersion;
  } catch (error) {
    throw new Error(`Failed to restore version: ${error.message}`);
  }
};

// Delete old versions (cleanup)
const cleanupOldVersions = async (documentId, keepCount = 10) => {
  try {
    const versionPath = path.join(versionsDir, documentId);
    const indexPath = path.join(versionPath, 'index.json');
    
    if (!await fs.pathExists(indexPath)) {
      return { deleted: 0 };
    }
    
    const index = await fs.readJSON(indexPath);
    
    if (index.length <= keepCount) {
      return { deleted: 0 };
    }
    
    // Delete oldest versions beyond keepCount
    const versionsToDelete = index.slice(keepCount);
    let deletedCount = 0;
    
    for (const version of versionsToDelete) {
      const versionFile = path.join(versionPath, `${version.versionId}.json`);
      if (await fs.pathExists(versionFile)) {
        await fs.remove(versionFile);
        deletedCount++;
      }
    }
    
    // Update index
    const newIndex = index.slice(0, keepCount);
    await fs.writeJSON(indexPath, newIndex, { spaces: 2 });
    
    return { deleted: deletedCount };
  } catch (error) {
    throw new Error(`Failed to cleanup versions: ${error.message}`);
  }
};

module.exports = {
  saveVersion,
  getVersions,
  getVersion,
  compareVersions,
  restoreVersion,
  cleanupOldVersions
};
