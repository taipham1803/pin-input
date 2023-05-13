export interface PinInputProps {
  length?: number; // allows changing the number of input boxes
  secretMode?: boolean; // allows turning on/off secret mode
  regex?: string; // allows passing a regex for box input validation
  defaultValue?: string; // allows setting a default value
  onChange?: (value: string) => void; // invokes a method after each box is filled
  onComplete?: (value: string) => void; // invokes a method after all boxes are filled
}
