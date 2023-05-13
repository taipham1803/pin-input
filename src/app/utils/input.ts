export const parsePinInput = (str: string, regex = '^[0-9]*$'): string | undefined => {
  return str.match(new RegExp(regex))?.toString();
}