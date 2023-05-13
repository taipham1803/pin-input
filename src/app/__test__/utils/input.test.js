import { parsePinInput } from "@/app/utils/input";

describe('Test parsePinInput', () => {
  it('parsePinInput', () => {
    expect(parsePinInput('12')).toBe('12');
  })
})