import utf8 from 'utf8';
import base64 from 'base-64';

export function encodeBase64(str: string) {
  return base64.encode(utf8.encode(str));
}

export function decodeBase64(str: string) {
  return utf8.decode(base64.decode(str));
}
