import { exchangeNpssoForCode, exchangeCodeForAccessToken } from "psn-api";

const npsso = "OZTpAdVHRsyAjstJ0gQMci3I53aTDMHrDrFnG5ukkviLR5lg65VHJ0Omy4xiXKzF";

const accessCode = await exchangeNpssoForCode(npsso);
const tokens = await exchangeCodeForAccessToken(accessCode);
console.log("Refresh token:", tokens.refreshToken);
