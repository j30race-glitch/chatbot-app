# chatbot-app
Character Chat - AI character chatbot (installable PWA, personal use)

**Live:** https://j30race-glitch.github.io/chatbot-app/

Character Chat lets you chat with your own custom AI characters. It's one self-contained `index.html` (inline CSS and JS) with no frameworks, CDNs, accounts, ads or purchases. It talks to the AI only with **your own xAI API key**, and your key, characters and chats are saved in the browser's `localStorage` on your device. It's built for the Galaxy Z Fold7 cover screen (~412 px) and unfolded screen (~884 px), and it also runs in desktop browsers.

## Use it
1. Open the live link above in **Chrome** or **Samsung Internet** (or open `index.html` directly from a file).
2. Go to **Settings** and paste your xAI API key, then tap **Save**. The key stays only on this device. It is sent only to the AI API you set (default `https://api.x.ai/v1`) and is never stored in this repo or in the offline cache.
3. Pick or create a character and start chatting.

## The menu
- **Characters:** your saved characters, each with a portrait icon. A generated portrait is shown if the character has one; otherwise the app draws a small face from the character's hair, eye and skin colors, or shows its emoji on a colored circle (drawn on the device, no API call). Tap one to switch; each character keeps its own personality and chat history. Use **＋ New Character** or **🎭 New from preset…** (Mentor, Rival, Confidant, Scholar, Trickster, Stoic, Dominant, Submissive). Everything stays editable, and characters can be exported/imported as JSON.
- **Chat:** the conversation with the current character.
- **Settings:** API key, base URL and models, plus the safety rules editor (**✏️ Edit safety rules**, **Save rules**, **Reset to default**).

## Portraits and images
- In the character editor, set gender, apparent age and look, then **📸 Generate portrait** → **Use as avatar**.
- In chat, 📸 (or `/selfie <scene>`) asks for a photo of the current character, and 🖼️ (or `/image <prompt>`) creates an image. Images use your xAI key and stay on this device.

## Install as an app
In Chrome or Samsung Internet, open the live link and use **⋮ → Add to Home screen / Install app**. It opens full-screen like a normal app.

## Offline
After the first visit, the app itself (page, manifest and icons) is cached by the service worker (`sw.js`, cache `chatbot-v3`), so it opens without a connection. Chatting and image generation still need the internet. AI requests are never cached.

## Safety
- **Always on, can't be turned off:** no sexual or romantic content involving minors, and no real-world harm (weapons for harm, violence planning, drug making, hacking people, fraud, self-harm). These checks are built into the code, and the locked "🔒 Always on" rules can't be edited or removed in Settings.
- **Adults only:** every character must be 18+. This is enforced on save, on import and on every portrait or photo.

Note: data is stored per browser. Chrome and Samsung Internet keep separate copies, so stick to one or move characters with export/import.
