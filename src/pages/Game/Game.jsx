import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Stone } from '../../components/Stones';
import { initGame, pickFromFactory, pickFromCenter, placeStones } from '../../store/gameSlice';
import styles from './Game.module.scss';

const Game = () => {
    const dispatch = useDispatch();
    const { factories, center, players, currentPlayerId, heldStones } = useSelector(state => state.game);

    useEffect(() => { if (players.length === 0) dispatch(initGame()); }, [dispatch, players]);

    if (players.length === 0) return <div className={styles.loading}>Chargement du Gant...</div>;

    return (
        <div className={styles.gameContainer}>
            <header className={styles.header}>
                <h1>Tour : Joueur {currentPlayerId}</h1>
                {heldStones && (
                    <div className={styles.hand}>
                        En main : {heldStones.count}x <Stone stoneType={heldStones.type} size="small" />
                    </div>
                )}
            </header>

            <div className={styles.mainContent}>
                <section className={styles.supply}>
                    <div className={styles.factories}>
                        {factories.map((stones, i) => (
                            <div key={i} className={styles.factory}>
                                {stones.map((s, j) => (
                                    <div key={j} onClick={() => !heldStones && dispatch(pickFromFactory({ factoryIndex: i, stoneType: s }))}>
                                        <Stone stoneType={s} size="medium" />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className={styles.center} onClick={() => console.log("Clic centre")}>
                        {center.map((s, i) => (
                            <div key={i} onClick={(e) => { e.stopPropagation(); if (!heldStones) dispatch(pickFromCenter({ stoneType: s })); }}>
                                <Stone stoneType={s} size="small" />
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.players}>
                    {players.map(p => (
                        <div key={p.id} className={`${styles.playerBoard} ${currentPlayerId === p.id ? styles.active : ''}`}>
                            <h3>Joueur {p.id} - Score: {p.score}</h3>
                            <div className={styles.boardGrid}>
                                <div className={styles.patterns}>
                                    {p.patternLines.map((line, i) => (
                                        <div key={i} className={styles.line} onClick={() => heldStones && currentPlayerId === p.id && dispatch(placeStones({ lineIndex: i }))}>
                                            {line.map((s, j) => <div key={j} className={styles.slot}>{s && <Stone stoneType={s} size="small" />}</div>)}
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.wall}>
                                    {p.wall.map((row, i) => (
                                        <div key={i} className={styles.row}>
                                            {row.map((cell, j) => <div key={j} className={`${styles.cell} ${cell ? styles.filled : ''}`}>{cell && <Stone stoneType={cell} size="small" />}</div>)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.floor}>
                                {Array(7).fill(null).map((_, i) => (
                                    <div key={i} className={styles.floorSlot}>
                                        {p.floorLine[i] === "FIRST_PLAYER" ? "1st" : p.floorLine[i] && <Stone stoneType={p.floorLine[i]} size="small" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default Game;