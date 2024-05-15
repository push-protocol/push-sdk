export function extractDynamicArgs(str: string) {
  const regex = /\$\{([^}]+)\}/g;
  const matches = [];
  let match;

  while ((match = regex.exec(str)) !== null) {
    matches.push(match[1]);
  }

  return matches;
}
