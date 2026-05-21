import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Stone } from "../../components/Stones";
import {
  initGame,
  pickFromFactory,
  pickFromCenter,
  placeStones,
  resetToLobby,
} from "../../store/gameSlice";
import { STONE_TYPES } from "../../constants";
import { socket } from "../../constants/socket";
import styles from "./Game.module.scss";
import { Button } from "../../components/Button";
import WaitingRoom from "../../components/WaitingRoom";

const Game = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showBag, setShowBag] = useState(false);
  const [localPlayerNumber, setLocalPlayerNumber] = useState(null);
  const [roomPlayers, setRoomPlayers] = useState([]);
  const {
    factories,
    center,
    players,
    currentPlayerId,
    heldStones,
    gameState,
    bag,
  } = useSelector((state) => state.game);

  useEffect(() => {
    if (players.length === 0) dispatch(initGame());
  }, [dispatch, players]);

  useEffect(() => {
    const handleWaitingForPlayer = ({ roomId, players: roomPlayers }) => {
      console.log("En attente dans la room:", roomId, roomPlayers);
      setRoomPlayers(roomPlayers || []);
      const local = resolveLocalPlayer(roomPlayers);
      if (local) {
        setLocalPlayerNumber(local);
        console.log(`Player ${local} connected`);
      }
    };

    const resolveLocalPlayer = (roomPlayers) => {
      if (!roomPlayers || !socket?.id) return null;
      if (roomPlayers.length === 0) return null;
      const sid = socket.id;
      if (typeof roomPlayers[0] === "string") {
        const idx = roomPlayers.indexOf(sid);
        return idx !== -1 ? idx + 1 : null;
      }
      if (typeof roomPlayers[0] === "object") {
        const idx = roomPlayers.findIndex(
          (p) => p.id === sid || p.socketId === sid || p.socket === sid,
        );
        return idx !== -1 ? idx + 1 : null;
      }
      return null;
    };

    const handleGameStart = ({ roomId, players: roomPlayers }) => {
      console.log("La partie commence dans:", roomId, "avec", roomPlayers);
      setRoomPlayers(roomPlayers || []);
      const local = resolveLocalPlayer(roomPlayers);
      if (local) {
        setLocalPlayerNumber(local);
        console.log(`Player ${local} connected`);
      }
    };

    const handleDisconnect = () => {
      console.log("Déconnecté");
      setLocalPlayerNumber(null);
    };

    socket.emit("join_game", { roomId: "ROOM-1" });
    socket.on("waiting_for_player", handleWaitingForPlayer);
    socket.on("game_start", handleGameStart);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("waiting_for_player", handleWaitingForPlayer);
      socket.off("game_start", handleGameStart);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  // If server indicates lobby or room isn't full, show waiting room
  if (gameState === "LOBBY" || (roomPlayers && roomPlayers.length < 2)) {
    return (
      <WaitingRoom
        roomPlayers={roomPlayers}
        localPlayerNumber={localPlayerNumber}
      />
    );
  }

  const bagStats = (bag || []).reduce((acc, s) => {
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const WALL_ORDER = [
    [
      STONE_TYPES.SPACE,
      STONE_TYPES.MIND,
      STONE_TYPES.REALITY,
      STONE_TYPES.POWER,
      STONE_TYPES.TIME,
    ],
    [
      STONE_TYPES.TIME,
      STONE_TYPES.SPACE,
      STONE_TYPES.MIND,
      STONE_TYPES.REALITY,
      STONE_TYPES.POWER,
    ],
    [
      STONE_TYPES.POWER,
      STONE_TYPES.TIME,
      STONE_TYPES.SPACE,
      STONE_TYPES.MIND,
      STONE_TYPES.REALITY,
    ],
    [
      STONE_TYPES.REALITY,
      STONE_TYPES.POWER,
      STONE_TYPES.TIME,
      STONE_TYPES.SPACE,
      STONE_TYPES.MIND,
    ],
    [
      STONE_TYPES.MIND,
      STONE_TYPES.REALITY,
      STONE_TYPES.POWER,
      STONE_TYPES.TIME,
      STONE_TYPES.SPACE,
    ],
  ];

  if (gameState === "GAME_OVER") {
    const sorted = [...players].sort((a, b) => b.score - a.score);
    return (
      <div className={styles.gameOverOverlay}>
        <div className={styles.finalModal}>
          <h2>🏆 VICTOIRE DU HÉRO {sorted[0].id} 🏆</h2>
          <div className={styles.resultsContainer}>
            {sorted.map((p) => (
              <div key={p.id} className={styles.playerResultCard}>
                <h3>HÉRO {p.id}</h3>
                <div className={styles.finalWallPreview}>
                  {p.wall.map((row, i) => (
                    <div key={i} className={styles.row}>
                      {row.map((cell, j) => (
                        <div
                          key={j}
                          className={`${styles.cell} ${cell ? styles.filled : ""}`}
                        >
                          {cell ? (
                            <Stone stoneType={cell} size="small" />
                          ) : (
                            <div className={styles.ghost}>
                              <Stone
                                stoneType={WALL_ORDER[i][j]}
                                size="small"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button variant="primary" size="large" onClick={() => navigate("/")}>
            Menu Principal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gameContainer}>
      <header className={styles.header}>
        {localPlayerNumber && (
          <div className={styles.localBadge}>
            Vous êtes le joueur {localPlayerNumber}
          </div>
        )}
        <h1>TOUR : JOUEUR {currentPlayerId}</h1>
        <div className={styles.controls}>
          <Button size="small" onClick={() => setShowBag(true)}>
            👜 Voir le Sac ({bag?.length || 0})
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={() => {
              if (
                window.confirm(
                  "Réinitialiser la partie ? Toutes les données locales seront perdues.",
                )
              ) {
                dispatch(resetToLobby());
                setLocalPlayerNumber(null);
                try {
                  socket.emit("reset_game", { roomId: "ROOM-1" });
                } catch (e) {
                  console.warn("Socket emit failed on reset:", e);
                }
              }
            }}
          >
            Réinitialiser la partie
          </Button>
        </div>
        {heldStones && (
          <div className={styles.hand}>
            Main: {heldStones.count}x{" "}
            <Stone stoneType={heldStones.type} size="small" />
          </div>
        )}
      </header>

      {showBag && (
        <div className={styles.modalOverlay} onClick={() => setShowBag(false)}>
          <div className={styles.bagModal} onClick={(e) => e.stopPropagation()}>
            <h2>Contenu du Sac</h2>
            <div className={styles.bagGrid}>
              {Object.entries(bagStats).map(([type, count]) => (
                <div key={type} className={styles.bagItem}>
                  <Stone stoneType={type} size="medium" />
                  <span>x{count}</span>
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              size="small"
              onClick={() => setShowBag(false)}
              className={styles.closeBagBtn}
            >
              Fermer
            </Button>
          </div>
        </div>
      )}

      <main className={styles.mainLayout}>
        <section className={styles.commonArea}>
          <div className={styles.factories}>
            {factories.map((stones, i) => (
              <div key={i} className={styles.factory}>
                {stones.map((s, j) => (
                  <div
                    key={j}
                    onClick={() =>
                      !heldStones &&
                      dispatch(
                        pickFromFactory({ factoryIndex: i, stoneType: s }),
                      )
                    }
                  >
                    <Stone stoneType={s} size="medium" />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className={styles.center}>
            {center.map((s, i) => (
              <div
                key={i}
                onClick={() =>
                  !heldStones && dispatch(pickFromCenter({ stoneType: s }))
                }
              >
                <Stone stoneType={s} size="small" />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.playersContainer}>
          {players.map((p) => (
            <div
              key={p.id}
              className={`${styles.playerBoard} ${currentPlayerId === p.id ? styles.active : ""}`}
            >
              <h3>
                Joueur {p.id}{" "}
                {p.id === localPlayerNumber && (
                  <span className={styles.youTag}>— Vous</span>
                )}{" "}
                | Score: {p.score}
              </h3>
              <div className={styles.boardGrid}>
                <div className={styles.patterns}>
                  {p.patternLines.map((line, i) => {
                    const colIndex = heldStones
                      ? WALL_ORDER[i].indexOf(heldStones.type)
                      : -1;
                    const isInvalid =
                      heldStones &&
                      (p.wall[i][colIndex] !== null ||
                        line.some((s) => s !== null && s !== heldStones.type));
                    return (
                      <div
                        key={i}
                        className={`${styles.line} ${isInvalid ? styles.invalid : ""}`}
                        onClick={() =>
                          heldStones &&
                          currentPlayerId === p.id &&
                          dispatch(placeStones({ lineIndex: i }))
                        }
                      >
                        <div className={styles.lineSlots}>
                          {line.map((s, j) => (
                            <div key={j} className={styles.slot}>
                              {s && <Stone stoneType={s} size="small" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className={styles.wall}>
                  {p.wall.map((row, i) => (
                    <div key={i} className={styles.row}>
                      {row.map((cell, j) => (
                        <div
                          key={j}
                          className={`${styles.cell} ${cell ? styles.filled : ""}`}
                        >
                          {cell ? (
                            <Stone stoneType={cell} size="small" />
                          ) : (
                            <div className={styles.ghost}>
                              <Stone
                                stoneType={WALL_ORDER[i][j]}
                                size="small"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.floor}>
                {Array(7)
                  .fill(null)
                  .map((_, i) => (
                    <div key={i} className={styles.floorSlot}>
                      <span className={styles.penalty}>
                        {-1 * (i < 2 ? 1 : i < 5 ? 2 : 3)}
                      </span>
                      {p.floorLine[i] === "FIRST_PLAYER" ? (
                        <div className={styles.firstMarker}>1st</div>
                      ) : (
                        p.floorLine[i] && (
                          <Stone stoneType={p.floorLine[i]} size="small" />
                        )
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Game;
