import React from "react";

type Props = {
  events: string[];
};

export function Events({ events }: Props): JSX.Element {
  return (
    <ul>
      {events.map((event, index) => (
        <li key={`${event}-${index}`}>{event}</li>
      ))}
    </ul>
  );
}

export default Events;
