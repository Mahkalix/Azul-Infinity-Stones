import React from "react";

export function Events({ events }) {
  return (
    <ul>
      {events.map((event, index) => (
        <li key={`${event}-${index}`}>{event}</li>
      ))}
    </ul>
  );
}

export default Events;