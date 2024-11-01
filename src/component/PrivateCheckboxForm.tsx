"use client";

import { updateServerAccess } from "@/app/Actions";
import { useState, ChangeEvent } from "react";

interface PrivateCheckboxFormProps {
  isPrivate: boolean;
  id: string;
}

export default function PrivateCheckboxForm({
  isPrivate,
  id,
}: PrivateCheckboxFormProps) {
  const [isChecked, setIsChecked] = useState(isPrivate);
  const [showSaveButton, setShowSaveButton] = useState(false);

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    setShowSaveButton(checked !== isPrivate);
  };

  return (
    <form action={updateServerAccess}>
      <label htmlFor="isPrivate">private server</label>
      <input type="hidden" name="id" value={id} />
      <input
        name="isPrivate"
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      {showSaveButton && (
        <button className="bg-green-400 text-black">Save</button>
      )}
    </form>
  );
}
