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
    <form action={updateServerAccess} className="flex gap-2">
      <input type="hidden" name="id" value={id} />
      <input
        name="isPrivate"
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      {showSaveButton && (
        <button className="font-medium text-green-400 hover:text-green-500 underline">
          Save changes
        </button>
      )}
    </form>
  );
}
