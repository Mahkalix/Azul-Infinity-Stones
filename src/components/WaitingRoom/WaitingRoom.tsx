import React from "react";
import { Button } from "../Button";
import styles from "./WaitingRoom.module.scss";

type Props = {
  isOpen: boolean;
  roomId: string;
  roomStatus: string;
  roomPlayers: Array<number | string>;
  onRoomInputChange?: (v: string) => void;
  onCreateRoom?: () => void;
  onJoinRoom: () => void;
  onContinue: () => void;
  localPlayerNumber?: number | null;
};

const WaitingRoom = ({
  isOpen,
  roomId,
  roomStatus,
  roomPlayers,
  onJoinRoom,
  onContinue,
}: Props) => {
  if (!isOpen) return null;

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

        {localPlayerNumber ? (
          <div className={styles.youAre}>Vous êtes le joueur {localPlayerNumber}</div>
        ) : (
          <div className={styles.youAre}>Vous n'êtes pas encore dans la room</div>
        )}

        <Button variant="ghost" size="small" onClick={onContinue} disabled={roomPlayers.length < 2}>
          Continue to game
        </Button>
      </div>
    </div>
  );
};

export default WaitingRoom;
