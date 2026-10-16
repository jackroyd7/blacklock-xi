# Blacklock XI scoreboard

Live match play scoreboard for the Blacklock XI at Camiral: Crows v Smugglers, four rounds, 20 points, 10½ to win.

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

## Hole maps and GPS distances
**Setup → Hole maps → Open the hole map editor** (behind the PIN). For each hole, tap the tee and the middle of the green on the satellite photo. Front of green, back of green and a dogleg corner are optional. Drag a marker to move it, tap a marker and use **Remove** to delete it, or **Undo** to step back, then **Save hole**, which moves on to the next hole. The editor shows the measured tee-to-green length next to the card length as a check. It takes about 10 minutes per course and is easiest on a laptop or tablet.

Once a hole is mapped:
- **Course tab:** tap a hole number for a satellite view turned so the tee is at the bottom and the green at the top, with red 100/150/200/250 markers showing the straight-line distance to the middle of the green. Tap anywhere on the photo to measure to that point. Pinch or drag on the photo to zoom and move around it (the page itself doesn't zoom); **Fit hole** puts it back. The **yd / m** switch under the photo changes the hole map's units only; the rest of the app keeps its own Yards/Metres setting.
- **Scoring screen:** a **Go to hole map** button. Once someone turns GPS on in the hole map, the scoring screen also shows the distance from their phone to the front, middle and back of the green. GPS distances only appear within 600 m of the green and are off until each person turns them on.

The photos are Esri World Imagery. The points are saved in the event document, so they're included in the full backup.

## Pin positions
The Tour and Stadium pin sheets (pin position 1) are built in: a **Pin** button on the hole map and on the scoring screen opens that hole's drawing from the sheet, with the flag's distance on from the front, left/right of centre and the green depth (metres, as on the sheet). **Course tab → Pin sheet** (under each course) shows the whole sheet. The pictures are in `pins/` and the numbers in `PINS` near the top of the pin-sheet section of `index.html`. When the pins move, send a photo of the new sheet and it can be swapped in the same way.

## Photos and videos
The **Media** tab lets anyone add photos and videos for everyone to see, with an optional caption, their name and the match it's from. Items tagged to a match also appear on that match's screen. Photos are shrunk on the phone before uploading (about 300 KB each). Videos upload as they are, up to 200 MB, so film in 1080p rather than 4K. Uploads need signal. People can delete what they added, and organisers (Setup unlocked) can delete anything.

### One-time setup (about 10 minutes)
Files are kept in Firebase Storage, which Google only offers on the pay-as-you-go **Blaze** plan. For a weekend of photos and clips the cost should be nothing or pennies.
1. **Firebase console → ⚙ → Usage and billing → Details & settings → Modify plan → Blaze.** Add a card, then set a **budget alert** (e.g. £5) so you're emailed if costs ever approach it.
2. **Build → Storage → Get started.** Choose **production mode** and a location (a US region such as `us-central1` has the largest free allowance; a European one costs a few pence per GB per month).
3. **Storage → Rules:** replace everything with the contents of [`storage.rules`](storage.rules) and click **Publish**.
4. **Firestore Database → Rules:** replace everything with the contents of [`firestore.rules`](firestore.rules) (it now also allows `media`) and click **Publish**.

Until Storage is set up, the Media tab says so and nothing else changes. Photos and videos aren't part of the full backup; they stay in Firebase Storage and can be downloaded from there.

## Using it with no signal
- **Install it:** on iPhone, open the link in Safari, tap Share, then **Add to Home Screen**. On Android, use the browser menu, then **Install app**. It then opens full screen and works with no signal. On iPhone this also stops Safari clearing the saved data after a week of not opening it.
- **The app:** after it has been opened once with signal, a copy stays on the phone (`sw.js`), so it opens anywhere. New versions still arrive when there's signal, with the Update bar.
- **Scores:** scores entered with no signal are kept on the phone and sent when signal returns. Other groups' scores arrive when you have signal.
- **Hole maps:** **Course tab → No signal on the course? → Set up → Download hole maps for offline** saves the satellite photos for every mapped hole (roughly 30 MB for both courses), so do it on wifi before the first round. Download again if holes are mapped or moved later. GPS distances work with no signal.

## Other screens
- **Live** tab: every hole as it is scored in any match, newest first, with where each match stands. Tap one to open the match. Only holes scored with this version of the app appear.
- **Match graph** (on each match): who was up after every hole.
- **Stats:** awards (top points scorer, most holes won, birdies and net birdies, biggest win, best comeback, best partnership), player stats, partnerships and how each hole played against par.
- **Round results card:** the **Results** button on each round on the Scoreboard opens that round's card (every match result, the round score and the overall score after it), with **Share as image**.
- **Share as image:** tap the overall score, then **Share as image** and **Share image** to send the score card to WhatsApp or save it.

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

- Tee times: R1 from 08:00 and R2 from 14:00, 10 minutes apart (Match 1 first). Set R3 and R4, or change any of them, in **Setup → Rounds** (first tee time and minutes between matches). Matches that haven't started show their tee time on the Scoreboard.

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

## Releasing changes
Bump `BUILD` near the top of the script in `index.html` (e.g. `2026-10-13.2` → `2026-10-13.3`) in every commit that changes the app. Open copies check for a new `BUILD` every few minutes and whenever the app comes back on screen, and show an **Update** bar. The address never changes.
