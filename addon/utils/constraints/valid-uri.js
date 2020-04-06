/**
 * Checks if it is a valid uri
 */

export default function constraintValidUri(value/*, options*/) {
  return value.value.match(/^(http|ftp)s?:\/\/[\w.-]+\.\w+(\/.*)?/);
}
