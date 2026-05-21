import React, { useState } from "react";
import { socket } from "../../constants/socket";

export function MyForm(): JSX.Element {
  const [value, setValue] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!value.trim()) {
      return;
    }

    socket.emit("foo", value);
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
