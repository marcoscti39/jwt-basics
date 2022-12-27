import React from "react";
import { NotificationPayloadTypes } from "../hooks/useNotification";

const Notification = ({ message, type }: NotificationPayloadTypes) => {
  return (
    <div className="flex justify-center items-center p-1">
      <p
        className={`${
          type === "error" ? "text-red-600" : "text-green-500"
        } font-semibold`}
      >
        {message}
      </p>
    </div>
  );
};

export default Notification;
