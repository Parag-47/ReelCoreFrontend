import {
  startAuthentication,
  startRegistration,
  browserSupportsWebAuthn,
} from '@simplewebauthn/browser';
import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
  PublicKeyCredentialCreationOptionsJSON,
} from '@simplewebauthn/browser';
import type {
  PasskeyOptionsResponse,
  PasskeyRegistrationOptionsResponse,
} from './auth.types';

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

export async function registerWithPasskey(
  options: PasskeyRegistrationOptionsResponse,
): Promise<RegistrationResponseJSON> {
  return startRegistration({
    optionsJSON:
      options as unknown as PublicKeyCredentialCreationOptionsJSON,
  });
}
