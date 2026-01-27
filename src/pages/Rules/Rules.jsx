import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Stone } from "../../components/Stones";
import { STONE_TYPES } from "../../constants";
import styles from "./Rules.module.scss";

const Rules = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className={styles.rules}>
      <button className={styles.backArrow} onClick={handleBack} aria-label="Back to home">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Rules</h1>
          <p className={styles.subtitle}>
            Learn how to play Azul: Infinity Stones
          </p>
        </header>

        <div className={styles.stonesLegend}>
          {Object.values(STONE_TYPES).map((stone) => (
            <div key={stone} className={styles.stoneLegendItem}>
              <Stone stoneType={stone} size="small" />
              <span className={styles.stoneName}>{stone}</span>
            </div>
          ))}
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Objective</h2>
            <p>
              Become the ultimate collector of Infinity Stones. Score the most
              points by strategically placing stones on your Gauntlet board to
              create powerful patterns and combinations.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Setup</h2>
            <ul className={styles.list}>
              <li>
                <strong>2 players:</strong> 5 Forges (factories)
              </li>
              <li>
                <strong>3 players:</strong> 7 Forges
              </li>
              <li>
                <strong>4 players:</strong> 9 Forges
              </li>
              <li>Each Forge contains 4 random Infinity Stones</li>
              <li>Each player has a personal Gauntlet board</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Game Flow</h2>
            <p>The game is played over multiple rounds, each with two phases:</p>

            <div className={styles.phase}>
              <h3 className={styles.phaseTitle}>Phase 1: Stone Selection</h3>
              <p>Players take turns picking stones:</p>
              <ul className={styles.list}>
                <li>
                  Choose a Forge and take <strong>all stones of one type</strong>{" "}
                  from it
                </li>
                <li>Remaining stones move to the center of the table</li>
                <li>
                  Alternatively, take all stones of one type from the center
                </li>
                <li>
                  The first player to take from the center gets the{" "}
                  <strong>First Player marker</strong> (and a -1 penalty)
                </li>
              </ul>
            </div>

            <div className={styles.phase}>
              <h3 className={styles.phaseTitle}>Phase 2: Stone Placement</h3>
              <p>Place your collected stones on your Gauntlet:</p>
              <ul className={styles.list}>
                <li>
                  Place stones in one of the 5 <strong>Pattern Lines</strong> on
                  the left
                </li>
                <li>Each line can only hold one type of stone</li>
                <li>
                  Lines hold 1, 2, 3, 4, or 5 stones respectively (top to bottom)
                </li>
                <li>
                  Excess stones go to the <strong>Floor Line</strong> (negative
                  points)
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Scoring</h2>
            <p>When a Pattern Line is complete:</p>
            <ul className={styles.list}>
              <li>
                One stone moves to the matching spot on the{" "}
                <strong>Wall</strong> (5x5 grid)
              </li>
              <li>
                Score <strong>1 point</strong> for each stone in connected
                horizontal/vertical lines
              </li>
              <li>Remaining stones from that line are discarded</li>
            </ul>

            <div className={styles.bonusBox}>
              <h4>End Game Bonuses</h4>
              <ul className={styles.list}>
                <li>
                  <strong>+2 points</strong> for each complete horizontal row
                </li>
                <li>
                  <strong>+7 points</strong> for each complete vertical column
                </li>
                <li>
                  <strong>+10 points</strong> for collecting all 5 of one stone
                  type
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>End of Game</h2>
            <p>
              The game ends when any player completes at least one{" "}
              <strong>horizontal row</strong> on their Wall. Complete the current
              round, calculate final scores including bonuses, and the player
              with the most points wins!
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Strategy Tips</h2>
            <ul className={styles.list}>
              <li>Plan ahead - look at what stones others need</li>
              <li>Complete rows and columns for bonus points</li>
              <li>Avoid taking stones you cannot place</li>
              <li>
                Collect all 5 of one stone type for the powerful +10 bonus
              </li>
              <li>Watch the center - sometimes waiting is strategic</li>
            </ul>
          </section>
        </div>

        <div className={styles.actions}>
          <Button variant="primary" size="large" onClick={handleBack}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Rules;
