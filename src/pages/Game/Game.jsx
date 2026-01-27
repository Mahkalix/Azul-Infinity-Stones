import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Stone } from '../../components/Stones';
import { initGame, pickFromFactory, pickFromCenter, placeStones } from '../../store/gameSlice';
import styles from './Game.module.scss';

const Game = () => {
    const dispatch = useDispatch();
    const game = useSelector((state) => state.game || {});
    const {
        factories = [],
        center = [],
        heldStones = null,
        players = [],
        currentPlayerId = 1
    } = game;

    useEffect(() => {
        if (players.length === 0) {
            dispatch(initGame());
        }
    }, [dispatch, players.length]);

    if (players.length === 0) return <div className={styles.loading}>Chargement...</div>;

    return (
        <div className={styles.gameContainer}>
            <header className={styles.gameHeader}>
                <h1>AZUL: INFINITY STONES</h1>

                <div className={styles.statusZone}>
                    {heldStones ? (
                        <div className={styles.holdingIndicator}>
                            <span>Main de Thanos : {heldStones.count}x</span>
                            <Stone stoneType={heldStones.type} size="small" />
                            <small>Placez-les sur votre plateau</small>
                        </div>
                    ) : (
                        <div className={styles.turnInfo}>
                            C'est au tour du <strong>Joueur {currentPlayerId}</strong>
                        </div>
                    )}
                </div>
            </header>

            <main className={styles.mainLayout}>
                {/* ZONE COMMUNE (HAUT) */}
                <section className={styles.commonArea}>
                    <div className={styles.factoriesGrid}>
                        {factories.map((stones, fIdx) => (
                            <div key={fIdx} className={styles.factory}>
                                {stones.map((stone, sIdx) => (
                                    <div key={sIdx} onClick={() => !heldStones && dispatch(pickFromFactory({ factoryIndex: fIdx, stoneType: stone }))}>
                                        <Stone stoneType={stone} size="medium" className={styles.interactiveStone} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className={styles.centerTable}>
                        <h3>Centre de la Galaxie</h3>
                        <div className={styles.centerStones}>
                            {center.map((stone, idx) => (
                                <div key={idx} onClick={() => !heldStones && dispatch(pickFromCenter({ stoneType: stone }))}>
                                    <Stone stoneType={stone} size="small" className={styles.interactiveStone} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ZONE DES JOUEURS (BAS - CÔTE À CÔTE) */}
                <section className={styles.playersContainer}>
                    {players.map((player) => (
                        <div
                            key={player.id}
                            className={`${styles.playerBoard} ${currentPlayerId === player.id ? styles.activeTurn : ''}`}
                        >
                            <h2 className={styles.playerTitle}>
                                JOUEUR {player.id} {currentPlayerId === player.id ? "⚡" : ""}
                            </h2>

                            <div className={styles.boardLayout}>
                                {/* Lignes de Motif */}
                                <div className={styles.patternSection}>
                                    {player.patternLines.map((line, lineIdx) => (
                                        <div
                                            key={lineIdx}
                                            className={`${styles.patternLine} ${heldStones && currentPlayerId === player.id ? styles.clickable : ''}`}
                                            onClick={() => heldStones && currentPlayerId === player.id && dispatch(placeStones({ lineIndex: lineIdx }))}
                                        >
                                            {line.map((slot, sIdx) => (
                                                <div key={sIdx} className={styles.slot}>
                                                    {slot && <Stone stoneType={slot} size="small" />}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                {/* Mur / Gant */}
                                <div className={styles.wallGrid}>
                                    {player.wall.map((row, rIdx) => (
                                        <div key={rIdx} className={styles.wallRow}>
                                            {row.map((cell, cIdx) => (
                                                <div key={cIdx} className={`${styles.wallCell} ${cell ? styles.filled : ''}`}>
                                                    {cell && <Stone stoneType={cell} size="small" />}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.scoreBadge}>Score: {player.score}</div>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
};

export default Game;