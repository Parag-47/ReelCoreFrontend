import {
  startAuthentication,
  browserSupportsWebAuthn,
} from '@simplewebauthn/browser';
import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/browser';
import type { PasskeyOptionsResponse } from './auth.types';

export function isPasskeySupported(): boolean {
  return browserSupportsWebAuthn();
}

export async function authenticateWithPasskey(
  options: PasskeyOptionsResponse,
): Promise<AuthenticationResponseJSON> {
  return startAuthentication({
    optionsJSON: options as unknown as PublicKeyCredentialRequestOptionsJSON,
  });
}
