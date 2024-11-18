"use client";

import { useFormState } from "react-dom";
import { useRef } from "react";
import { addUser } from "@/app/Actions";

const initialState = {
  error: null,
  success: false,
};

export default function AddUserForm({
  serverId,
  serverName,
}: {
  serverId: string;
  serverName: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(
    async (prevState: any, formData: FormData) => {
      const result = await addUser(formData, serverId, serverName);
      if (result.error === null) {
        formRef.current?.reset();
      }
      return result;
    },
    initialState
  );

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "USER_ALREADY_ADDED":
        return "User is already on the list";
      case "USER_NOT_FOUND":
        return "User not found";
      default:
        return "Failed to add user";
    }
  };

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex gap-2 flex-col mt-8"
    >
      <label htmlFor="mailOrUsername" className="text-lg font-medium">
        Add new user
      </label>
      {state.error && (
        <span className="text-red-400">{getErrorMessage(state.error)}</span>
      )}
      <div className="flex gap-2 flex-col sm:flex-row">
        <input
          type="text"
          name="mailOrUsername"
          className="w-max text-white bg-slate-950 p-1 px-3 rounded border-gray-400 border-2 border-dashed"
          placeholder="Enter email or username"
          required
        />
        <button className="bg-gray-300 hover:bg-gray-400 w-max text-black font-medium p-1 px-3 rounded">
          Add user
        </button>
      </div>
    </form>
  );
}
