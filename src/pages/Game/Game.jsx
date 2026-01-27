import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Stone } from '../../components/Stones';
import { initGame, pickFromFactory, pickFromCenter, placeStones } from '../../store/gameSlice';
import { STONE_TYPES } from '../../constants';
import styles from './Game.module.scss';

const Game = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showBag, setShowBag] = useState(false);
    const { factories, center, players, currentPlayerId, heldStones, gameState, bag } = useSelector(state => state.game);

    useEffect(() => { if (players.length === 0) dispatch(initGame()); }, [dispatch, players]);

    if (players.length === 0) return null;

    const bagStats = bag.reduce((acc, s) => {
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {});

    const WALL_ORDER = [
        [STONE_TYPES.SPACE, STONE_TYPES.MIND, STONE_TYPES.REALITY, STONE_TYPES.POWER, STONE_TYPES.TIME],
        [STONE_TYPES.TIME, STONE_TYPES.SPACE, STONE_TYPES.MIND, STONE_TYPES.REALITY, STONE_TYPES.POWER],
        [STONE_TYPES.POWER, STONE_TYPES.TIME, STONE_TYPES.SPACE, STONE_TYPES.MIND, STONE_TYPES.REALITY],
        [STONE_TYPES.REALITY, STONE_TYPES.POWER, STONE_TYPES.TIME, STONE_TYPES.SPACE, STONE_TYPES.MIND],
        [STONE_TYPES.MIND, STONE_TYPES.REALITY, STONE_TYPES.POWER, STONE_TYPES.TIME, STONE_TYPES.SPACE],
    ];

    if (gameState === "GAME_OVER") {
        const winner = [...players].sort((a, b) => b.score - a.score)[0];
        return (
            <div className={styles.gameOverOverlay}>
                <div className={styles.modal}>
                    <h2>FIN DE LA QUÊTE</h2>
                    <h3>Le Joueur {winner.id} a réuni les pierres !</h3>
                    <button onClick={() => navigate('/')} className={styles.restartBtn}>Menu Principal</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.gameContainer}>
            <header className={styles.header}>
                <h1>TOUR : JOUEUR {currentPlayerId}</h1>
                <div className={styles.controls}>
                    <button className={styles.bagBtn} onClick={() => setShowBag(true)}>
                        👜 Voir le Sac ({bag.length})
                    </button>
                </div>
                {heldStones && (
                    <div className={styles.hand}>
                        En main : {heldStones.count}x <Stone stoneType={heldStones.type} size="small" />
                    </div>
                )}
            </header>

            {showBag && (
                <div className={styles.modalOverlay} onClick={() => setShowBag(false)}>
                    <div className={styles.bagModal} onClick={e => e.stopPropagation()}>
                        <h2>Pierres restantes</h2>
                        <div className={styles.bagGrid}>
                            {Object.entries(bagStats).map(([type, count]) => (
                                <div key={type} className={styles.bagItem}>
                                    <Stone stoneType={type} size="medium" />
                                    <span>x{count}</span>
                                </div>
                            ))}
                        </div>
                        <button className={styles.closeBtn} onClick={() => setShowBag(false)}>Fermer</button>
                    </div>
                </div>
            )}

            <main className={styles.mainLayout}>
                <section className={styles.commonArea}>
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
                    <div className={styles.center}>
                        {center.map((s, i) => (
                            <div key={i} onClick={() => !heldStones && dispatch(pickFromCenter({ stoneType: s }))}>
                                <Stone stoneType={s} size="small" />
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.playersContainer}>
                    {players.map(p => (
                        <div key={p.id} className={`${styles.playerBoard} ${currentPlayerId === p.id ? styles.active : ''}`}>
                            <h3>Joueur {p.id} | Score: {p.score}</h3>
                            <div className={styles.boardGrid}>
                                <div className={styles.patterns}>
                                    {p.patternLines.map((line, i) => {
                                        const colIndex = heldStones ? WALL_ORDER[i].indexOf(heldStones.type) : -1;
                                        const isInvalid = heldStones && (
                                            p.wall[i][colIndex] !== null ||
                                            line.some(s => s !== null && s !== heldStones.type)
                                        );
                                        return (
                                            <div key={i}
                                                 className={`${styles.line} ${isInvalid ? styles.invalid : ''}`}
                                                 onClick={() => heldStones && currentPlayerId === p.id && dispatch(placeStones({ lineIndex: i }))}
                                            >
                                                {line.map((s, j) => <div key={j} className={styles.slot}>{s && <Stone stoneType={s} size="small" />}</div>)}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className={styles.wall}>
                                    {p.wall.map((row, i) => (
                                        <div key={i} className={styles.row}>
                                            {row.map((cell, j) => (
                                                <div key={j} className={`${styles.cell} ${cell ? styles.filled : ''}`}>
                                                    {cell && <Stone stoneType={cell} size="small" />}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.floor}>
                                {Array(7).fill(null).map((_, i) => (
                                    <div key={i} className={styles.floorSlot}>
                                        <span className={styles.penalty}>{-1 * (i < 2 ? 1 : i < 5 ? 2 : 3)}</span>
                                        {p.floorLine[i] === "FIRST_PLAYER" ? <div className={styles.firstMarker}>1st</div> : p.floorLine[i] && <Stone stoneType={p.floorLine[i]} size="small" />}
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