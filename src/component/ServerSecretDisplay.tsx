"use client";

import { useState } from "react";

export default function ServerSecretDisplay({
  serverSecret,
}: {
  serverSecret: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((prevState) => !prevState);
  };

  return (
    <>
      <button className="underline" onClick={toggleVisibility}>
        {isVisible ? "Hide Server Secret" : "Show Server Secret"}
      </button>
      {isVisible && (
        <div className="rounded border border-gray-600 mt-2 p-2 bg-gray-800 flex gap-4">
          <span>{serverSecret}</span>
          <button className="underline cursor-pointer">Copy</button>
        </div>
      )}
    </>
  );
}
