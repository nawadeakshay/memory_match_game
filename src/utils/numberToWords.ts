const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen',
  'nineteen', 'twenty',
];

/** Spells out small whole numbers ("eight"); falls back to the numeral outside that range. */
export function numberToWords(value: number): string {
  if (Number.isInteger(value) && value >= 0 && value < ONES.length) {
    return ONES[value];
  }
  return String(value);
}
