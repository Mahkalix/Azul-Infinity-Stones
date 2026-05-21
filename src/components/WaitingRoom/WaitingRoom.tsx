import React from 'react'
import styles from './WaitingRoom.module.scss';
import { socket } from '../../constants/socket';
import { Button } from '../Button';

type WaitingRoomProps = {
  roomPlayers?: string[];
  localPlayerNumber?: number | null;
};

const WaitingRoom: React.FC<WaitingRoomProps> = ({ roomPlayers = [], localPlayerNumber = null }) => {
  const isSpectator = Boolean(localPlayerNumber && localPlayerNumber > 2);

  const handleJoin = () => {
    try {
      socket.emit('join_game', { roomId: 'ROOM-1' });
    } catch (e) {
      console.warn('Failed to emit join_game', e);
    }
  };

  const handleLeave = () => {
    try {
      socket.emit('leave_game', { roomId: 'ROOM-1' });
    } catch (e) {
      console.warn('Failed to emit leave_game', e);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Salle d'attente — ROOM-1</h2>
        <p className={styles.count}>{roomPlayers.length} / 2 joueurs</p>
        {isSpectator && (
          <div className={styles.spectatorBadge}>
            Vous êtes spectateur. Les deux places de jeu sont déjà prises.
          </div>
        )}

        <ul className={styles.playerList}>
          {[0, 1].map((i) => {
            const sid = roomPlayers[i];
            const status = sid ? 'connecté' : 'en attente';
            const isLocal = localPlayerNumber === i + 1;
            return (
              <li key={i} className={styles.playerItem}>
                Joueur {i + 1} — {status} {isLocal && <span className={styles.you}>— Vous</span>}
              </li>
            );
          })}
          {isSpectator && (
            <li key="spectator" className={styles.playerItem}>
              Spectateur — Vous
            </li>
          )}
        </ul>

        <div className={styles.actions}>
          {!isSpectator && !roomPlayers.includes(socket.id) ? (
            <Button variant="primary" onClick={handleJoin}>
              Rejoindre ROOM-1
            </Button>
          ) : (
            <div className={styles.waitingText}>
              {isSpectator ? 'Mode spectateur actif' : "En attente d'un autre joueur..."}
            </div>
          )}
          <Button variant="ghost" onClick={handleLeave}>
            Quitter la room
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
