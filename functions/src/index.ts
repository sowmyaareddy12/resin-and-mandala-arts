import {setGlobalOptions} from "firebase-functions";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {getAuth} from "firebase-admin/auth";

// For cost control
setGlobalOptions({ maxInstances: 10 });

/**
 * Callable function to grant admin role to a user.
 * Only existing admins can call this, or run once via Firebase CLI/Console.
 *
 * Usage: call with { uid: "USER_UID_TO_MAKE_ADMIN" }
 * The caller must already have admin claim, OR you can temporarily allow
 * unauthenticated and run once, then restrict.
 */
export const setAdminClaim = onCall({enforceAppCheck: false}, async (request) => {
  const uid = request.data?.uid as string | undefined;
  if (!uid || typeof uid !== "string") {
    throw new HttpsError("invalid-argument", "Missing uid");
  }
  const callerUid = request.auth?.uid;
  if (!callerUid) {
    throw new HttpsError("unauthenticated", "Must be signed in");
  }
  const callerToken = await getAuth().getUser(callerUid);
  const isCallerAdmin = callerToken.customClaims?.admin === true;
  if (!isCallerAdmin) {
    throw new HttpsError("permission-denied", "Only admins can set admin claims");
  }
  await getAuth().setCustomUserClaims(uid, {admin: true});
  return {success: true};
});

/**
 * One-time bootstrap: grant admin to the first user.
 * Call from browser console after deploy:
 *   firebase.functions().httpsCallable('bootstrapAdmin')({uid: 'YOUR_UID'})
 * Get UID from Firebase Console > Authentication > Users.
 * Remove or restrict this function after first use.
 */
export const bootstrapAdmin = onCall({enforceAppCheck: false}, async (request) => {
  const uid = request.data?.uid as string | undefined;
  if (!uid || typeof uid !== "string") {
    throw new HttpsError("invalid-argument", "Provide { uid: 'YOUR_UID' }");
  }
  await getAuth().setCustomUserClaims(uid, {admin: true});
  return {success: true, message: "Admin claim set. Sign out and sign in again."};
});
