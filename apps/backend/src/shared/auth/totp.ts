import * as OTPAuth from "otpauth";

export function verifyTOTP(
  secret: string,
  token: string,

  label: string,
  issuer = "aligo",
): boolean {
  const totp = new OTPAuth.TOTP({ issuer, label, secret });
  return totp.validate({ token, window: 1 }) !== null;
}

export function generateTOTP(label: string, issuer = "aligo") {
  const totp = new OTPAuth.TOTP({ issuer, label });
  return {
    secret: totp.secret.base32,
    uri: totp.toString(),
  };
}

export function getTOTPURI(
  label: string,
  secret: string,
  issuer = "aligo",
): string {
  const totp = new OTPAuth.TOTP({
    issuer: "aligo",
    label: label,
    secret: OTPAuth.Secret.fromBase32(secret),
  });

  return totp.toString();
}
