/**
 * Firefox Settings Importer & Exporter
 * 
 * A Firefox extension that allows users to export and import browser settings
 * to better manage multiple Firefox profiles.
 * 
 * @author Jan-Michael Kühn
 * @version 1.0.0
 * @license MIT
 */

// ============================================================================
// Constants
// ============================================================================

const STATUS_DISPLAY_DURATION = 2000; // milliseconds
const BLOB_CLEANUP_DELAY = 1000; // milliseconds

// ============================================================================
// UI Helper Functions
// ============================================================================

/**
 * Displays a status message to the user
 * @param {string} text - The message to display
 * @param {number} [duration=2000] - How long to show the message (ms), 0 for permanent
 */
function showStatus(text, duration = STATUS_DISPLAY_DURATION) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = text;
    if (duration) {
        setTimeout(() => {
            statusEl.textContent = '';
        }, duration);
    }
}

/**
 * Refreshes the current settings view by loading from storage
 * Displays all captured settings in JSON format
 */
async function refreshView() {
    try {
        const data = await browser.storage.local.get(null);
        document.getElementById('current-settings').textContent = JSON.stringify(data, null, 2);
    } catch (e) {
        console.error('Error refreshing view:', e);
        document.getElementById('current-settings').textContent = "Error loading storage: " + e.message;
    }
}

// ============================================================================
// Browser Settings Capture
// ============================================================================

/**
 * Captures current browser settings including:
 * - Browser settings (homepage, cache, popups, etc.)
 * - Privacy settings (tracking, WebRTC, cookies, etc.)
 * - Proxy configuration
 * 
 * Stores all captured settings in browser.storage.local
 */
async function captureBrowserSettings() {
    try {
        const settings = {};

        // Helper to safely get setting value
        const getSetting = async (api, name) => {
            if (api && api[name]) {
                try {
                    const res = await api[name].get({});
                    return res.value;
                } catch (e) {
                    return `Error: ${e.message}`;
                }
            }
            return 'Not available';
        };

        // Capture browserSettings
        const browserKeys = [
            'allowPopupsForUserEvents',
            'cacheEnabled',
            'homepageOverride',
            'imageAnimationBehavior',
            'newTabPageOverride',
            'openBookmarksInNewTabs',
            'openSearchResultsInNewTabs',
            'openUrlbarResultsInNewTabs',
            'webNotificationsDisabled',
            'zoomFullPage'
        ];

        settings.browserSettings = {};
        for (const key of browserKeys) {
            settings.browserSettings[key] = await getSetting(browser.browserSettings, key);
        }

        // Capture privacy settings
        settings.privacy = {};

        if (browser.privacy) {
            if (browser.privacy.network) {
                settings.privacy.network = {
                    networkPredictionEnabled: await getSetting(browser.privacy.network, 'networkPredictionEnabled'),
                    peerConnectionEnabled: await getSetting(browser.privacy.network, 'peerConnectionEnabled'),
                    webRTCIPHandlingPolicy: await getSetting(browser.privacy.network, 'webRTCIPHandlingPolicy')
                };
            }
            if (browser.privacy.services) {
                settings.privacy.services = {
                    passwordSavingEnabled: await getSetting(browser.privacy.services, 'passwordSavingEnabled')
                };
            }
            if (browser.privacy.websites) {
                settings.privacy.websites = {
                    cookieConfig: await getSetting(browser.privacy.websites, 'cookieConfig'),
                    firstPartyIsolate: await getSetting(browser.privacy.websites, 'firstPartyIsolate'),
                    hyperlinkAuditingEnabled: await getSetting(browser.privacy.websites, 'hyperlinkAuditingEnabled'),
                    referrersEnabled: await getSetting(browser.privacy.websites, 'referrersEnabled'),
                    resistFingerprinting: await getSetting(browser.privacy.websites, 'resistFingerprinting'),
                    trackingProtectionMode: await getSetting(browser.privacy.websites, 'trackingProtectionMode')
                };
            }
        }

        // Capture proxy settings
        if (browser.proxy && browser.proxy.settings) {
            try {
                const proxySettings = await browser.proxy.settings.get({});
                settings.proxy = proxySettings.value;
            } catch (e) {
                settings.proxy = `Error: ${e.message}`;
            }
        }

        // Save to storage
        await browser.storage.local.set(settings);
        showStatus('Browser settings captured');
        refreshView();
    } catch (e) {
        console.error('Error capturing settings:', e);
        showStatus('Capture failed: ' + e.message);
    }
}

// ============================================================================
// Storage Management
// ============================================================================

/**
 * Clears all captured settings from local storage
 * WARNING: This action cannot be undone
 */
async function clearStorage() {
    await browser.storage.local.clear();
    showStatus('Storage cleared');
    refreshView();
}

/**
 * Saves user preferences (filename prefix) to sync storage
 * Sync storage is synchronized across Firefox instances
 */
async function saveSettings() {
    try {
        const filenamePrefix = document.getElementById('filename-prefix').value.trim();
        await browser.storage.sync.set({ filenamePrefix });
        showStatus('Settings saved');
    } catch (e) {
        console.error('Error saving settings:', e);
        showStatus('Failed to save settings: ' + e.message);
    }
}

/**
 * Loads user preferences from sync storage
 * Populates the filename prefix input field if a value exists
 */
async function loadSettings() {
    try {
        const { filenamePrefix } = await browser.storage.sync.get('filenamePrefix');
        if (filenamePrefix) {
            document.getElementById('filename-prefix').value = filenamePrefix;
        }
    } catch (e) {
        console.error('Error loading settings:', e);
    }
}

// ============================================================================
// Export/Import Functions
// ============================================================================

/**
 * Exports all captured settings to a JSON file
 * 
 * Filename format: {prefix}-{YYYY-MM-DD}.json
 * - Uses custom prefix if set, otherwise "firefox-{browser}"
 * - Includes current date for version tracking
 * 
 * Uses browser.downloads API to trigger download dialog
 */
async function exportSettings() {
    try {
        const data = await browser.storage.local.get(null);
        const jsonString = JSON.stringify(data, null, 2);

        // Get custom filename prefix from settings
        const { filenamePrefix } = await browser.storage.sync.get('filenamePrefix');
        let profileName = filenamePrefix || 'firefox-profile';
        
        // If no custom prefix, try to get browser info
        if (!filenamePrefix) {
            try {
                const info = await browser.runtime.getBrowserInfo();
                profileName = `firefox-${info.name.toLowerCase()}`;
            } catch (e) {
                console.log('Could not get browser info, using default profile name');
            }
        }

        // Format date as YYYY-MM-DD
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        
        const filename = `${profileName}-${dateStr}.json`;

        // Create blob and download using browser.downloads API
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        await browser.downloads.download({
            url: url,
            filename: filename,
            saveAs: true
        });

        // Clean up the blob URL after a short delay
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, BLOB_CLEANUP_DELAY);

        showStatus('Export started');
    } catch (e) {
        console.error('Error exporting settings:', e);
        showStatus('Export failed: ' + e.message);
    }
}

/**
 * Imports settings from a JSON file
 * 
 * @param {Event} event - File input change event
 * 
 * Process:
 * 1. Reads selected JSON file
 * 2. Parses JSON content
 * 3. Clears existing storage
 * 4. Imports new settings
 * 
 * TODO: Add validation to ensure JSON structure is correct
 * TODO: Add confirmation dialog before clearing existing settings
 */
function importSettings(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = JSON.parse(e.target.result);
            await browser.storage.local.clear();
            await browser.storage.local.set(data);
            showStatus('Settings imported successfully');
            refreshView();
        } catch (err) {
            console.error('Error importing settings:', err);
            showStatus('Import failed: Invalid JSON');
        }
        // Reset input so same file can be selected again if needed
        event.target.value = '';
    };
    reader.readAsText(file);
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initializes the extension popup
 * - Loads current settings view
 * - Loads user preferences
 * - Attaches event listeners to all interactive elements
 */
document.addEventListener('DOMContentLoaded', () => {
    refreshView();
    loadSettings();

    // Attach event listeners
    document.getElementById('refresh-btn').addEventListener('click', refreshView);
    document.getElementById('capture-btn').addEventListener('click', captureBrowserSettings);
    document.getElementById('clear-btn').addEventListener('click', clearStorage);
    document.getElementById('save-settings-btn').addEventListener('click', saveSettings);
    document.getElementById('export-btn').addEventListener('click', exportSettings);
    document.getElementById('import-file').addEventListener('change', importSettings);
});
