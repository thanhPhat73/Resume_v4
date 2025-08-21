"use client";

import styles from "./cv-empty-state.module.css";

interface CVEmptyStateProps {
  onCreateNew: () => void;
}

export function CVEmptyState({ onCreateNew }: CVEmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>CV đã tạo trên TopCV</h1>
        <button className={styles.createButton} onClick={onCreateNew}>
          + Tạo CV
        </button>
      </div>

      <div className={styles.emptyContent}>
        <div className={styles.iconContainer}>
          <svg
            className={styles.emptyIcon}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="20"
              y="30"
              width="80"
              height="60"
              rx="4"
              stroke="#E5E7EB"
              strokeWidth="2"
              fill="none"
            />
            <rect x="30" y="40" width="60" height="4" rx="2" fill="#E5E7EB" />
            <rect x="30" y="50" width="40" height="4" rx="2" fill="#E5E7EB" />
            <rect x="30" y="60" width="50" height="4" rx="2" fill="#E5E7EB" />
            <rect x="30" y="70" width="35" height="4" rx="2" fill="#E5E7EB" />
            <path
              d="M70 15 L85 25 L70 35"
              stroke="#E5E7EB"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M80 25 L95 25"
              stroke="#E5E7EB"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className={styles.emptyText}>Chưa có CV nào được tạo.</p>
      </div>
    </div>
  );
}
