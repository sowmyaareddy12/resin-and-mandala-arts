# Resin & Mandala Arts - Setup & Deploy

## Live site

**Hosting URL:** https://vsr-resin-and-mandala-arts.web.app

## Prerequisites

- Node.js 18+ and npm
- [Firebase CLI](https://firebase.google.com/docs/cli): `npm install -g firebase-tools`
- A Firebase project (create at [console.firebase.google.com](https://console.firebase.google.com))

## 1. Firebase project setup

```bash
firebase login
firebase use vsr-resin-and-mandala-arts
```

If your project ID differs, edit `.firebaserc` or run `firebase use <your-project-id>`.

## 2. Enable services in Firebase Console

1. **Authentication** → Sign-in method → Enable **Email/Password**
2. Create your admin user: Authentication → Users → Add user (email + password)

## 3. Set Firebase config in the app (required for auth & Firestore)

1. [Firebase Console](https://console.firebase.google.com/project/vsr-resin-and-mandala-arts/settings/general) → Project settings → General
2. Under "Your apps", create a Web app if needed, then copy the config
3. Edit `public/firebase-config.js` and paste your values
4. Redeploy: `firebase deploy --only "hosting,firestore"`

## 4. Make your user an admin

On the **free Spark plan**, use Firebase Console:

1. Authentication → Users → select your user → ⋮ → Edit user
2. Custom claims → Add claim: key `admin`, value `true` (boolean)

If you upgrade to Blaze and deploy Cloud Functions, you can use the `bootstrapAdmin` callable instead.

## 5. Deploy

**Free plan (Hosting + Firestore only):**
```bash
firebase deploy --only "hosting,firestore"
```

**With Cloud Functions (Blaze plan):**
```bash
firebase deploy
```

Your site will be at `https://resin-and-mandala-arts.web.app` (or your project’s URL).

## 6. Optional – run locally

```bash
firebase emulators:start --only hosting
```

Visit `http://localhost:5000` (or the URL shown in the terminal).


## Troubleshooting login: `auth/api-key-not-valid`

If admin login shows `auth/api-key-not-valid`, check:

1. `public/firebase-config.js` is deployed and contains your real project config values (not placeholders).
2. The Firebase Web API key in Google Cloud Console is not deleted/rotated.
3. API key restrictions allow your hosting domains (`*.web.app`, `*.firebaseapp.com`) and localhost if testing locally.
4. After updating config, redeploy hosting:

```bash
firebase deploy --only hosting
```


## Troubleshooting add artwork: `Missing or insufficient permissions`

If adding artwork fails with permission errors:

1. Confirm the signed-in user has custom claim `admin: true` in Firebase Authentication.
2. Sign out and sign in again after changing claims.
3. Ensure Firestore rules are deployed:

```bash
firebase deploy --only firestore:rules
```

### Image upload notes

- The admin form accepts either:
  - a local image file upload (stored as a data URL), or
  - an image URL.
- For file uploads, keep images under **1.5 MB**.


## Front-end structure (Tailwind + TypeScript)

The site now uses separate pages for readability:

- `/` (rewritten) → `public/gallery/index.html` → gallery
- `/help/` → `public/help/index.html` → help/contact
- `/login/` → `public/login/index.html` → admin login
- `/admin/` → `public/admin/index.html` → admin management

Each page keeps its own TypeScript next to its HTML, and compiled JS is emitted into the same folders.

Build the front-end scripts with:

```bash
npm run build:web
```
