/**
 * Settings Exporter - Firefox Addon
 * Vibecoded with Antigravity by Jan-Michael Kühn 2025 Dec
 */

function showStatus(text, duration = 2000) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = text;
    if (duration) {
        setTimeout(() => {
            statusEl.textContent = '';
        }, duration);
    }
}

async function refreshView() {
    try {
        const data = await browser.storage.local.get(null);
        document.getElementById('current-settings').textContent = JSON.stringify(data, null, 2);
    } catch (e) {
        console.error(e);
        document.getElementById('current-settings').textContent = "Error loading storage: " + e.message;
    }
}

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

        await browser.storage.local.set(settings);
        showStatus('Browser settings captured');
        refreshView();
    } catch (e) {
        console.error(e);
        showStatus('Capture failed: ' + e.message);
    }
}

async function clearStorage() {
    await browser.storage.local.clear();
    showStatus('Storage cleared');
    refreshView();
}

async function saveSettings() {
    try {
        const filenamePrefix = document.getElementById('filename-prefix').value.trim();
        await browser.storage.sync.set({ filenamePrefix });
        showStatus('Settings saved');
    } catch (e) {
        console.error(e);
        showStatus('Failed to save settings: ' + e.message);
    }
}

async function loadSettings() {
    try {
        const { filenamePrefix } = await browser.storage.sync.get('filenamePrefix');
        if (filenamePrefix) {
            document.getElementById('filename-prefix').value = filenamePrefix;
        }
    } catch (e) {
        console.error(e);
    }
}

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
        }, 1000);

        showStatus('Export started');
    } catch (e) {
        console.error(e);
        showStatus('Export failed: ' + e.message);
    }
}

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
            console.error(err);
            showStatus('Import failed: Invalid JSON');
        }
        // Reset input so same file can be selected again if needed
        event.target.value = '';
    };
    reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', () => {
    refreshView();
    loadSettings();

    document.getElementById('refresh-btn').addEventListener('click', refreshView);
    document.getElementById('capture-btn').addEventListener('click', captureBrowserSettings);
    document.getElementById('clear-btn').addEventListener('click', clearStorage);
    document.getElementById('save-settings-btn').addEventListener('click', saveSettings);
    document.getElementById('export-btn').addEventListener('click', exportSettings);
    document.getElementById('import-file').addEventListener('change', importSettings);
});
