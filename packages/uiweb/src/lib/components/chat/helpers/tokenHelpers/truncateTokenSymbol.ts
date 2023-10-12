function truncateTokenSymbol(inputString: string, length:number): string {
  const input = inputString.split(" ").join("");
  if (input.length <= length) {
    return input;
  } else {
    return input.slice(0, length-3) + '...';
  }
}

export { truncateTokenSymbol };
