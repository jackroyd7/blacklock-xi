# Blacklock XI scoreboard

Live Ryder Cup-style match play scoreboard for the Blacklock XI at Camiral: Crows v Smugglers, four rounds, 20 points, 10½ to win.

Anyone with the link can follow the live scores and enter scores on their phone. Setup (teams, courses, players, pairings) can be locked with a PIN.

## One-time setup (about 10 minutes)

The page is static and hosted on GitHub Pages. Live scores are stored in a free Google Firebase database.

### 1. Create the Firebase database
1. Go to https://console.firebase.google.com and click **Create a project** (any name, e.g. `blacklock-xi`). Google Analytics is not needed.
2. In the left menu open **Build → Firestore Database → Create database**. Pick a location near Spain (e.g. `eur3` or `europe-west`), and start in **production mode**.
3. Open the **Rules** tab, replace everything with the contents of [`firestore.rules`](firestore.rules), and click **Publish**.
4. Go to **Project settings** (gear icon) → **Your apps** → click the **`</>`** (Web) icon, give it a nickname, and register it. Hosting is not needed.
5. Copy the values from the `firebaseConfig` it shows you.

### 2. Add the settings to `config.js`
Paste the `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId` and `appId` into [`config.js`](config.js). The Setup PIN is stored as `setupPinHash`, a SHA-256 hash of `blacklock-xi:<PIN>`, so the PIN itself isn't in the code. `config.js` has the command for generating a new one.

The Firebase web config is not a secret; it is designed to sit in public web pages.

### 3. Publish on GitHub Pages
Repository **Settings → Pages → Build and deployment → Deploy from a branch → `main` / root**. The site appears at `https://<username>.github.io/<repo>/` after a minute.

## Before the first tee
1. Open the site, go to **Setup**, enter the PIN if you set one.
2. Paste the 16 players into **Players** as `Name, Team, Index` (Team is `Crows` or `Smugglers`).
3. Check the **Courses** section. Both Camiral courses are preloaded with par, stroke index and men's yellow tee slope/rating:
   - Tour, yellow: slope 136, rating 70.4
   - Stadium, yellow: slope 148, rating 73.2
4. Set the **Pairings** for each round (they can be done round by round).

## Formats and handicaps
| Round | Format | Course | Points per match |
|---|---|---|---|
| R1 Day 1 AM | Foursomes | Tour | 1 |
| R2 Day 1 PM | Chapman | Stadium | 1 |
| R3 Day 2 AM | Greensomes | Tour | 1 |
| R4 Day 2 PM | Fourball | Stadium | 2 |

- Course handicap = Index × Slope ÷ 113 + (Rating − Par)
- Fourball: 90% of course handicap, shots off the lowest player in the match
- Foursomes: 50% of the pair's combined course handicaps, difference between pairs as shots
- Chapman and Greensomes: 60% of the lower + 40% of the higher course handicap, difference between pairs as shots
- Handicaps are locked into a match when its first score is entered

All of this is editable in Setup.

## Security note
Anyone who has the link can enter or change scores, which is the point. Don't post the link publicly. The Firestore rules only allow access to the scoreboard's own data.

## Exporting results
**Setup → Export & backup** (behind the PIN):
- **Matches (CSV):** one row per match: round, format, course and tees, players, course handicaps, shots, result, points.
- **Hole by hole (CSV):** one row per hole per match: strokes, shots received, whether it was scored by strokes or result, who won it, and the match position.
- **Players (CSV):** one row per player: index, course handicap per round, record and points.
- **Full backup (JSON):** everything in one file. **Restore from backup** puts it all back, replacing what's there.

Every row carries the event name and year (set in Event & teams), so files from different years can be stacked in one spreadsheet.
