import { profanity } from '@2toad/profanity';

export function containsProfanity(text) {
  if (!text || typeof text !== 'string') return false;
  return profanity.exists(text);
}

export function censorProfanity(text) {
  if (!text || typeof text !== 'string') return text;
  return profanity.censor(text);
}
