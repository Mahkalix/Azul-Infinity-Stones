import React from 'react';
import { Stone } from '../Stones';
import styles from './Factory.module.scss';

type Props = {
  stones: string[];
  onStoneClick: (stone: string) => void;
};

const Factory = ({ stones, onStoneClick }: Props) => {
    return (
        <div className={styles.factory}>
            {stones.map((stone, index) => (
                <div key={index} className={styles.stoneWrapper} onClick={() => onStoneClick(stone)}>
                    <Stone stoneType={stone as any} size="medium" />
                </div>
            ))}
        </div>
    );
};

export default Factory;
