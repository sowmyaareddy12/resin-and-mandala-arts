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
