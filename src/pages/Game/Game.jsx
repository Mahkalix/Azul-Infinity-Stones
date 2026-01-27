import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { initGame } from '../../store/gameSlice';
import Factory from '../../components/Factory/Factory';
import styles from './Game.module.scss';

const Game = () => {
    const dispatch = useDispatch();
    const { factories, center, players } = useSelector((state) => state.game);

    useEffect(() => {
        // Initialisation d'une partie à 2 joueurs par défaut
        dispatch(initGame({ playerCount: 2 }));
    }, [dispatch]);

    return (
        <div className={styles.gameContainer}>
            <div className={styles.factoriesGrid}>
                {factories.map((stones, index) => (
                    <Factory
                        key={index}
                        stones={stones}
                        onStoneClick={(stoneType) => console.log(`Pierre ${stoneType} choisie dans fabrique ${index}`)}
                    />
                ))}
            </div>

            <div className={styles.centerArea}>
                {/* Zone pour les pierres rejetées au centre */}
                <h3>Centre de la table</h3>
                <div className={styles.centerStones}>
                    {center.map((stone, idx) => (
                        <Stone key={idx} stoneType={stone} size="small" />
                    ))}
                </div>
            </div>

            {/* Affichage du plateau du joueur actuel */}
            <div className={styles.playerBoards}>
                {/* Vous appellerez ici un composant PlayerBoard */}
            </div>
        </div>
    );
};

export default Game;