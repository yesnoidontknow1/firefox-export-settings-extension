# Settings Exporter - Firefox Extension

Export and import your Firefox browser settings with ease to better deal with multiple profiles.

## Features

- **Capture Browser Settings**: Automatically captures your Firefox configuration including:
  - Browser settings (homepage, cache, popup behavior, etc.)
  - Privacy settings (network predictions, WebRTC, tracking protection, etc.)
  - Proxy configuration
- **Export to JSON**: Save all captured settings to a timestamped JSON file
- **Import from JSON**: Restore your settings from a previously exported file
- **Clean Interface**: Simple, intuitive popup interface

## Installation

### From Firefox Add-ons (Recommended)

_Coming soon - pending Mozilla review_

### Manual Installation (Development)

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on..."
5. Select the `manifest.json` file from the extension directory

## Usage

1. Click the extension icon in your Firefox toolbar
2. Click **"Capture Browser Settings"** to read your current browser configuration
3. Click **"Export Settings"** to download a JSON backup file
4. To restore settings:
   - Click **"Select File to Import"**
   - Choose your previously exported JSON file
   - Your settings will be restored

## Permissions

This extension requires the following permissions:

- `storage` - To save captured settings locally
- `downloads` - To export settings as a JSON file
- `browserSettings` - To read browser configuration
- `privacy` - To read privacy-related settings
- `proxy` - To read proxy configuration

## Privacy

This extension does NOT:

- Send any data to external servers
- Track your browsing activity
- Collect personal information

All data stays local on your device.

## Development

Built with:

- Manifest V2
- WebExtension APIs
- Vanilla JavaScript (no frameworks)

## License

MIT License

## Author

Vibecoded with Antigravity by Jan-Michael Kühn 2025 Dec

## Support

For issues or feature requests, please visit the GitHub repository.
