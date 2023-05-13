"use client"

import { useState, useRef, useEffect, useCallback } from "react";
import { PinInputProps } from './types';
import { parsePinInput } from "@/app/utils/input";

const PinInput = ({
  length = 5,
  secretMode = false,
  regex = '^[0-9]*$',
  defaultValue = "",
  onChange,
  onComplete,
}: PinInputProps) => {
  const [value, setValue] = useState(defaultValue);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus(); // autofocus on first box
  }, []);

  const onBoxFocus = useCallback(() => {
    const curIndex = value.length;
    if (curIndex < inputRefs.current.length) {
      inputRefs?.current[curIndex]?.focus();
    }
  }, [value.length])

  useEffect(() => {
    onBoxFocus()
  }, [length, onBoxFocus, secretMode]);

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const clipboardData = event.clipboardData.getData('text');
    const newValue = clipboardData.replace(/[^\d]/g, '').substring(0, length);
    setValue(newValue);
    inputRefs.current[newValue.length]?.focus()
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const inputIndex = inputRefs.current.indexOf(event.target as HTMLInputElement);

    if (event.key === "Backspace" && inputIndex > 0) {
      event.preventDefault();
      const prevInput = inputRefs.current[inputIndex - 1];

      if (!prevInput.value) {
        prevInput.focus();
      } else {
        const currInput = inputRefs.current[inputIndex];
        const prevValue = prevInput.value;
        prevInput.value = "";
        prevInput.focus();
        currInput.value = prevValue;
        const newValue = value.slice(0, inputIndex - 1) + value.slice(inputIndex, value.length - 1)
        setValue(newValue);
      }
    } else if (parsePinInput(event.key, regex)) {
      const newValue = value.slice(0, inputIndex) + event.key + value.slice(inputIndex + 1);
      setValue(newValue);
      if (inputIndex < length - 1 && event.key !== "") {
        inputRefs.current[inputIndex + 1].focus();
      }
      if (onChange) {
        onChange(newValue);
      }
      if (newValue.length === length && onComplete) {
        onComplete(newValue);
      }
    }
  };

  return (
    <div className="flex flex-col p-4 sm:p-20 bg-white" onClick={onBoxFocus}>
      <div className="flex flex-row space-x-2 sm:space-x-4" >
        {Array.from({ length }).map((_, i) => {
          return (
            <div key={i} className="flex bg-white">
              <input
                onPaste={handlePaste}
                className="w-12 h-12 sm:w-20 sm:h-20 text-black text-center border border-black"
                type={secretMode ? "password" : "text"}
                maxLength={1}
                value={value[i] ?? ""}
                onKeyDown={handleInputKeyDown}
                onClick={onBoxFocus}
                ref={(input) => {
                  inputRefs.current[i] = input as HTMLInputElement;
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default PinInput;
