# Changelog

All notable changes to the Firefox Settings Exporter extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-25

### Added

- Initial release of Firefox Settings Exporter
- Export browser settings to JSON file
- Import settings from JSON file
- Capture browser settings (homepage, cache, popups, etc.)
- Capture privacy settings (tracking protection, WebRTC, cookies, etc.)
- Capture proxy configuration
- Custom filename prefix for exports
- Automatic dark/light mode support
- Settings sync across Firefox instances
- Clean, modern UI following Firefox Photon design

### Features

- **Multi-Profile Support**: Custom filename prefixes help manage multiple Firefox profiles
- **Date-Stamped Exports**: Automatic YYYY-MM-DD format in filenames
- **Persistent Settings**: Filename preferences sync via browser.storage.sync
- **Responsive Design**: Adapts to system light/dark mode preferences
- **User-Friendly**: Clear status messages and intuitive interface

### Technical

- Uses Firefox WebExtension APIs
- Manifest V2
- No external dependencies
- No telemetry or external communication
- All data stays local

### Security

- Explicit addon ID for storage.sync compatibility
- Proper permissions scoping
- No inline scripts or eval()
- Content Security Policy ready

## [Unreleased]

### Planned

- Input validation for imported JSON files
- Filename sanitization for security
- Confirmation dialogs for destructive actions
- Export integrity checking with checksums
- Sensitive data redaction in UI preview
