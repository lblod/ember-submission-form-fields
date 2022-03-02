export function formatDate(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    return '';
  }

  let day = `${date.getDate()}`.padStart(2, '0');
  let month = `${date.getMonth() + 1}`.padStart(2, '0');

  return `${day}.${month}.${date.getFullYear()}`;
}
