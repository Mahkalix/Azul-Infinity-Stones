import React from "react";

export function ConnectionState({ isConnected }) {
  return (
    <p>
      State: <strong>{isConnected ? "connected" : "disconnected"}</strong>
    </p>
  );
}

export default ConnectionState;