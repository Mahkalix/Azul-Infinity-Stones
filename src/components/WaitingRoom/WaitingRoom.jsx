import React from "react";
import PropTypes from "prop-types";
import { Button } from "../Button";
import styles from "./WaitingRoom.module.scss";

const WaitingRoom = ({
  isOpen,
  roomId,
  roomStatus,
  roomPlayers,
  onJoinRoom,
  onContinue,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Waiting Room</h2>
        <p className={styles.status}>{roomStatus}</p>

        <div className={styles.roomCodeBox}>
          <span>Room code</span>
          <strong>{roomId || "ROOM-1"}</strong>
        </div>

        <div className={styles.actions}>
          <Button variant="primary" size="medium" onClick={onJoinRoom}>
            Rejoindre ROOM-1
          </Button>
        </div>

        <div className={styles.playersBox}>
          <h3>Players</h3>
          <ul>
            <li>Player 1 {roomPlayers.length >= 1 ? "joined" : "waiting"}</li>
            <li>Player 2 {roomPlayers.length >= 2 ? "joined" : "waiting"}</li>
          </ul>
        </div>

        <Button
          variant="ghost"
          size="small"
          onClick={onContinue}
          disabled={roomPlayers.length < 2}
        >
          Continue to game
        </Button>
      </div>
    </div>
  );
};

WaitingRoom.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  roomId: PropTypes.string.isRequired,
  roomStatus: PropTypes.string.isRequired,
  roomPlayers: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  onJoinRoom: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
};

export default WaitingRoom;