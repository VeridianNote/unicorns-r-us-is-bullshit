import React, {useState, useCallback} from 'react';
import styles from './styles.module.css';

export default function FlowchartReveal() {
  const [revealed, setRevealed] = useState(false);

  const handleTap = useCallback(() => {
    setRevealed((prev) => !prev);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.container} ${revealed ? styles.revealed : ''}`}
        onClick={handleTap}
        role="button"
        tabIndex={0}
        aria-label="Tap to reveal the flowchart underneath the stamp"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTap();
          }
        }}
      >
        <a
          href="/img/hotbibabe-flowchart-large.webp"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.chartLink}
          onClick={(e) => {
            if (!revealed) {
              e.preventDefault();
            }
          }}
        >
          <img
            src="/img/hotbibabe-flowchart-large.webp"
            alt='Flowchart from unicorns-r-us.com by Franklin Veaux'
            className={styles.chart}
            loading="lazy"
          />
        </a>
        <img
          src="/img/Unicorns-r-us-is-Bullshit-Stamp.png"
          alt="Bullshit stamp"
          className={styles.stamp}
          aria-hidden="true"
        />
        <span className={styles.hint}>
          {revealed ? 'click image to open full size' : 'tap to reveal'}
        </span>
      </div>
    </div>
  );
}
