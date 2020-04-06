/**
 * Checks if the given value is a valid year.
 * For now we assume a valid year to contain:
 *  - a number
 *  - 4 consecutive numbers between 0 and 9
 */
export default function constraintValidYear(value, options) {
  let yearString = value.value;
  if(!/^\d{4}$/.test(yearString))
    return false;
  return !isNaN(yearString);
}
