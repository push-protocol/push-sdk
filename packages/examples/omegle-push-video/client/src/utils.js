export function truncateAddress(input) {
  if (input.length <= 5) {
    return input;
  } else {
    return input.substring(0, 5) + "...." + input.substring(input.length - 5);
  }
}
