import React, { useState } from "react";
import { socket } from "../../constants/socket";

export function MyForm() {
  const [value, setValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!value.trim()) {
      return;
    }

    socket.emit("hello", value);
    setValue("");
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Type something"
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default MyForm;
