"use client";

import { Button } from "@/components/ui/button";
import { CVCard } from "@/components/cv-card";
import type { ResumeData } from "@/components/resume-builder";
import styles from "./cv-list.module.css";

interface CVListProps {
  resumes: ResumeData[];
  onCreateNew: () => void;
  onEditCV: (resume: ResumeData) => void;
  onDeleteCV: (index: number) => void;
}

export function CVList({
  resumes,
  onCreateNew,
  onEditCV,
  onDeleteCV,
}: CVListProps) {
  return (
    <div className={styles.listContainer}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>CV đã tạo trên TopCV</h1>
          <Button onClick={onCreateNew} className={styles.createButton}>
            + Tạo CV
          </Button>
        </div>

        <div className={styles.resumeGrid}>
          {Array.isArray(resumes) && resumes.length > 0 ? (
            resumes.map((resume, index) =>
              resume && resume.personalInfo ? (
                <CVCard
                  key={index}
                  resume={resume}
                  onEdit={() => onEditCV(resume)}
                  onDelete={() => onDeleteCV(index)}
                />
              ) : null
            )
          ) : (
            <div>Chưa có CV nào</div>
          )}
        </div>
      </div>
    </div>
  );
}
