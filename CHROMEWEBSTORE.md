# Chrome Web Store Listing — YouTube Speed Customizer

> Last Updated: 2026-06-24

## Store Listing

**Extension Name**
YouTube Speed Customizer

**Short Description**
Allows customizing and persisting YouTube video playback speed up to 16x.

**Detailed Description**
YouTube Speed Customizer gives you complete control over your video playback speed on YouTube.

Key Features:
- Fine-tune speed with a responsive range slider (0.25x to 5.0x).
- Save precise custom speed ratios up to 16.0x (HTML5 maximum).
- Quick presets for instant standard speed changes (1.0x, 1.25x, 1.5x, 1.75x, 2.0x, 2.5x, 3.0x, 4.0x).
- Auto-apply mode to automatically carry over your selected playback speed to newly loaded videos.
- Deep-dark premium theme that blends beautifully with YouTube's dark mode.

How to Use:
1. Open any YouTube video.
2. Click the extension icon in your browser toolbar.
3. Choose your desired playback speed using the slider, buttons, or custom number input.
4. Toggle "Auto-apply speed" if you want new videos to play at this speed automatically.

Privacy Note:
This extension runs completely locally. It does not collect, store, or transmit any personal data, cookies, browser history, or tracker info. Your speed preferences are saved in your local browser storage.

**Category**
Productivity

**Single Purpose**
Adjusts and persists YouTube video playback speed up to 16x.

**Primary Language**
English

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon | 128×128 PNG | ⬜ Not created | |
| Screenshot 1 | 1280×800 | ⬜ Not created | |
| Screenshot 2 | 1280×800 | ⬜ Not created | |

### Screenshot Notes
- **Screenshot 1**: Show the extension popup open over a YouTube video page, highlighting the slider and active speed badge.
- **Screenshot 2**: Show custom speed entry (e.g., 3.00x) and the "Auto-apply speed" toggle active.

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| `storage` | permissions | Used to persist target playback speed and the auto-apply preference across browser restarts. |
| `tabs` | permissions | Used to query the active tab's URL to verify if the user is on YouTube and can adjust video speed. |
| `*://*.youtube.com/*` | host_permissions | Necessary to inject the playback speed controller script on YouTube domain web pages. |

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** No

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

## Privacy Policy

**Privacy Policy URL**
Not applicable (No data collected). A simple static GitHub Pages privacy policy page can be added if required by the Web Store.

## Distribution

**Visibility**: Public
**Regions**: All regions
**Pricing**: Free

## Developer Info

**Publisher Name**
YouTube Speed Customizer Developer

**Contact Email**
developer@example.com

**Support URL / Email**
developer@example.com

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0.0 | 2026-06-24 | Initial release with speed controls, presets, auto-apply, and custom inputs. | Draft |

## Review Notes

### Known Issues / Limitations
- Does not affect videos embedded outside of youtube.com unless host permissions are expanded.
