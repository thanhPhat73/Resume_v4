"use client";

import { useState, useEffect } from "react";
import { ResumeBuilder } from "@/components/resume-builder";
import { CVList } from "@/components/cv-list";
import { CVEmptyState } from "@/components/cv-empty-state";
import type { ResumeData } from "@/components/resume-builder";

type ViewState = "empty" | "list" | "builder";

export function CVDashboard() {
  const [currentView, setCurrentView] = useState<ViewState>("empty");
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [editingResume, setEditingResume] = useState<ResumeData | null>(null);

  useEffect(() => {
    // TODO: Gọi API để lấy danh sách CV của user
    // Tạm thời giả lập
    const mockResumes: ResumeData[] = [];
    setResumes(mockResumes);

    if (mockResumes.length > 0) {
      setCurrentView("list");
    } else {
      setCurrentView("empty");
    }
  }, []);

  const handleCreateNewCV = () => {
    setEditingResume(null);
    setCurrentView("builder");
  };

  const handleEditCV = (resume: ResumeData) => {
    setEditingResume(resume);
    setCurrentView("builder");
  };

  const handleDeleteCV = (index: number) => {
    setResumes((prev) => prev.filter((_, i) => i !== index));
    if (resumes.length === 1) {
      setCurrentView("empty");
    }
  };

  const handleBackToList = () => {
    if (resumes.length > 0) {
      setCurrentView("list");
    } else {
      setCurrentView("empty");
    }
  };

  const handleCVSaved = (newResume: ResumeData) => {
    if (editingResume) {
      setResumes((prev) =>
        prev.map((resume, index) =>
          resume === editingResume ? newResume : resume
        )
      );
    } else {
      setResumes((prev) => [...prev, newResume]);
    }
    setCurrentView("list");
  };

  if (currentView === "builder") {
    return (
      <ResumeBuilder
        onBack={handleBackToList}
        onSave={handleCVSaved}
        initialData={editingResume || undefined}
      />
    );
  }

  if (currentView === "list") {
    return (
      <CVList
        resumes={resumes}
        onCreateNew={handleCreateNewCV}
        onEditCV={handleEditCV}
        onDeleteCV={handleDeleteCV}
      />
    );
  }

  return <CVEmptyState onCreateNew={handleCreateNewCV} />;
}
