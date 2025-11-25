# Firefox Settings Importer & Exporter

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
- Firefox Photon Design System

### Project Structure

```
firefox-export-settings-extension/
├── manifest.json       # Extension configuration
├── popup.html          # UI structure
├── popup.js            # Main logic
├── style.css           # Styles with dark mode support
├── icons/              # Extension icons (48, 96, 128px)
├── LICENSE             # MIT License
├── README.md           # This file
└── CHANGELOG.md        # Version history
```

### Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yesnoidontknow1/firefox-export-settings-extension.git
   cd firefox-export-settings-extension
   ```

2. Load in Firefox:

   - Navigate to `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select `manifest.json`

3. Make changes and reload:
   - Edit files
   - Click "Reload" in `about:debugging`

### Code Documentation

All code is thoroughly documented with:

- **JSDoc comments** in JavaScript files
- **HTML comments** for section organization
- **CSS comments** for style grouping
- **Inline comments** for complex logic

### Testing

Manual testing checklist:

- [ ] Capture browser settings
- [ ] Export to JSON file
- [ ] Import from JSON file
- [ ] Custom filename prefix
- [ ] Dark mode appearance
- [ ] Clear storage functionality

## Troubleshooting

### Export not working

- Ensure you have the `downloads` permission
- Check browser console for errors
- Try reloading the extension

### Settings not saving

- Verify addon ID is set in manifest
- Check that `storage` permission is granted
- Ensure you're not in private browsing mode

### Import fails

- Verify JSON file is valid
- Check file was exported from this extension
- Ensure file is not corrupted

### Dark mode not working

- Check system dark mode is enabled
- Reload the extension popup
- Verify browser supports `prefers-color-scheme`

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style

- Use JSDoc comments for functions
- Follow existing code formatting
- Add comments for complex logic
- Test thoroughly before submitting

### Security

Before submitting, review the [Security Audit](docs/security-audit.md) for known issues and best practices.

## Roadmap

- [ ] Input validation for imports
- [ ] Filename sanitization
- [ ] Confirmation dialogs
- [ ] Export integrity checking
- [ ] Sensitive data redaction
- [ ] Manifest V3 migration

## License

MIT License

## Author

Vibecoded with Antigravity by Jan-Michael Kühn 2025 Dec

## Support

For issues or feature requests, please visit the [GitHub repository](https://github.com/yesnoidontknow1/firefox-export-settings-extension).
