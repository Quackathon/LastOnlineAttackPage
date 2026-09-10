# Torn Attack Page - Last Action

A Tampermonkey userscript that shows a target's **last action** (online/idle/offline status and relative time) directly on Torn's attack page, using Torn's official API.

## Features

- Displays a small floating panel on the attack page with the target's last action status and relative time (e.g. "Online — 2 minutes ago")
- Color-coded status dot: green (online), yellow (idle), red (offline)
- Automatically adapts to Torn's light/dark theme
- Your API key is stored locally by your userscript manager — it is never sent anywhere except directly to Torn's own API

## Requirements

- A browser userscript manager: [Tampermonkey](https://www.tampermonkey.net/) (recommended), Violentmonkey, or Greasy Fork-compatible equivalent
- A Torn API key with at least **Limited** access (create one at [torn.com/preferences.php#tab=api](https://www.torn.com/preferences.php#tab=api))

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser if you don't already have it.
2. Click this link to install the script directly:
   [TornAttackLastUser.js](https://raw.githubusercontent.com/Quackathon/LastOnlineAttackPage/main/TornAttackLastUser.js)
3. Tampermonkey will open an install page showing the script's source — click **Install**.
4. Visit any attack page on Torn (`torn.com/page.php?sid=attack&user2ID=...`). On first load, the panel will prompt you to enter your Torn API key.
5. Paste in your API key. The panel will then load and display the target's last action.

### Alternative: manual install

1. Open Tampermonkey's dashboard and click the **+** (create new script) button.
2. Delete the placeholder content and paste in the full contents of [`TornAttackLastUser.js`](./TornAttackLastUser.js).
3. Save (Ctrl+S / Cmd+S).

## Setting or changing your API key

- On first use, click the "click to set one" link in the panel.
- To change your key later, open Tampermonkey's extension menu (click the Tampermonkey icon in your browser toolbar) and select **Set Torn API Key** from the list.

## Updating

If you installed via the direct link above, Tampermonkey will automatically check for and prompt you to install newer versions of this script. You can also check manually from the Tampermonkey dashboard.

## Privacy

Your API key is stored only in your browser's userscript manager storage. The script makes a request directly from your browser to `api.torn.com` — no data passes through any third-party server.

## License

MIT
