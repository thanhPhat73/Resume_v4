"use client";

import type { ResumeData } from "./resume-builder";
import { ResumePreview } from "./resume-preview";
import styles from "./cv-card.module.css";

interface CVCardProps {
  resume: ResumeData;
  onEdit: () => void;
  onDelete: () => void;
}

export function CVCard({ resume, onEdit, onDelete }: CVCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className={styles.card}>
      <div className={styles.previewContainer}>
        <div className={styles.previewWrapper}>
          <ResumePreview data={resume} />
        </div>
        <div className={styles.overlay}>
          <div className={styles.actions}>
            <button
              className={styles.editButton}
              onClick={onEdit}
              title="Chỉnh sửa"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              className={styles.deleteButton}
              onClick={onDelete}
              title="Xóa"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="3,6 5,6 21,6" />
                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>
          {resume?.personalInfo?.fullName || "CV không có tên"}
        </h3>
        <p className={styles.date}>Cập nhật {formatDate(new Date())}</p>
      </div>
    </div>
  );
}
