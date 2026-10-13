// Blacklock XI configuration.
// 1. Paste your Firebase web app config below (Firebase console > Project settings > Your apps > Web app).
// 2. Setup PIN, stored as a SHA-256 hash of "blacklock-xi:<PIN>" so it isn't readable here.
//    To change it, run: node -e "console.log(require('crypto').createHash('sha256').update('blacklock-xi:NEWPIN').digest('hex'))"
//    Scores can still be entered by anyone with the link.
window.BLACKLOCK_CONFIG = {
  firebase: {
    apiKey: "AIzaSyBRtYrzfgaXU0I_zrQ_s_raSU4oVQv-rpc",
    authDomain: "blacklock-xi.firebaseapp.com",
    projectId: "blacklock-xi",
    storageBucket: "blacklock-xi.firebasestorage.app",
    messagingSenderId: "536079327445",
    appId: "1:536079327445:web:04fa9c7632a38c77ef825c"
  },
  setupPinHash: "b971ca88e5194b80c2ba18e8b5f2a61868e6ae991cc80096f1a3c79a71b6b7e4"
};
