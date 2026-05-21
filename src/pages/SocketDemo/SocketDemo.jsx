import React, { useEffect, useState } from "react";
import { socket } from "../../constants/socket";
import ConnectionState from "../../components/socket/ConnectionState";
import ConnectionManager from "../../components/socket/ConnectionManager";
import Events from "../../components/socket/Events";
import MyForm from "../../components/socket/MyForm";

export default function SocketDemo() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents((previous) => [...previous, value]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("hello", onFooEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("hello", onFooEvent);
    };
  }, []);

  return (
    <div className="App">
      <h1>Socket demo</h1>
      <ConnectionState isConnected={isConnected} />
      <Events events={fooEvents} />
      <ConnectionManager />
      <MyForm />
    </div>
  );
}
