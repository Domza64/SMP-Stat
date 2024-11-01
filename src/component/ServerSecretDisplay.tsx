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
      <button className="bg-gray-700 p-2 rounded-lg" onClick={toggleVisibility}>
        {isVisible ? "Hide Server Secret" : "Show Server Secret"}
      </button>
      {isVisible && (
        <span className="bg-gray-700 p-2 rounded-lg">{serverSecret}</span>
      )}
    </>
  );
}
