# Web Notes Chrome Extension

Web Notes is a Chrome extension that allows users to easily capture and manage notes from selected text on web pages.

## Features

- Capture selected text from any web page
- View, edit, copy, and delete notes
- Automatically saves the date, time, and URL of the captured note
- Limit of 50 notes, with oldest notes automatically removed
- Select multiple notes for copying or deletion
- Edit individual notes
- Notification badge for new notes

## Installation

1. Clone this repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Select text on any web page.
2. Right-click and choose "Include selected text in Web Notes" from the context menu.
3. Click on the Web Notes icon in your Chrome toolbar to view your notes.
4. In the popup, you can:
   - Select multiple notes using checkboxes
   - Copy selected notes
   - Delete selected notes
   - Edit individual notes
   - Refresh the list of notes

## Files

- `manifest.json`: Extension configuration
- `background.js`: Handles context menu creation and note saving
- `popup.html`: HTML structure for the extension popup
- `popup.js`: JavaScript for managing notes in the popup

## Limitations

- Maximum of 50 notes stored
- Each note is limited to 150 characters

## Author

Peeyush Singhal

## License

[Add your chosen license here]

## Contributing

[Add contribution guidelines if you want to accept contributions]
