/**
 * Cryptographic utilities for simulated blockchain
 */

export function generatePublicKey() {
  return '0x' + Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

export function generateSignature(voterId, rankedChoices) {
  const data = `${voterId}_${rankedChoices.join('_')}_${Date.now()}`;
  return '0x' + Array.from({ length: 128 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

export function generateVoterId() {
  return `voter_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
