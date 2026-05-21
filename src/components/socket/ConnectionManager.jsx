import React from "react";
import { socket } from "../../constants/socket";

export function ConnectionManager() {
  return (
    <div>
      <button type="button" onClick={() => socket.connect()}>
        Connect
      </button>
      <button type="button" onClick={() => socket.disconnect()}>
        Disconnect
      </button>
    </div>
  );
}

export default ConnectionManager;