"use client";

import { useState, useEffect } from "react";
import { ResumeBuilder } from "@/components/resume-builder";
import { CVList } from "@/components/cv-list";
import { CVEmptyState } from "@/components/cv-empty-state";
import type { ResumeData } from "@/components/resume-builder";
import { useCallback } from "react";
import { mapApiToForm, resumeApi } from "@/lib/api";

type ViewState = "empty" | "list" | "builder";

export function CVDashboard() {
  const [currentView, setCurrentView] = useState<ViewState>("empty");
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [editingResume, setEditingResume] = useState<ResumeData | null>(null);
  const { toast } = useToast();

  const loadResumes = async () => {
    try {
      const apiResumes = await resumeApi.getMyResume();
      const mappedResumes = Array.isArray(apiResumes)
        ? apiResumes.map((r: any) => mapApiToForm(r))
        : apiResumes
        ? [mapApiToForm(apiResumes)]
        : [];
      setResumes(mappedResumes);

      if (mappedResumes.length > 0) {
        setCurrentView("list");
      } else {
        setCurrentView("empty");
      }
    } catch (error) {
      console.error("Failed to load resumes:", error);
      toast("Lỗi: Không thể tải danh sách CV");
      setCurrentView("empty");
    }
  };

  useEffect(() => {
    loadResumes();
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

  // const handleCVSaved = (newResume: ResumeData) => {
  //   if (editingResume) {
  //     setResumes((prev) =>
  //       prev.map((resume, index) =>
  //         resume === editingResume ? newResume : resume
  //       )
  //     );
  //   } else {
  //     setResumes((prev) => [...prev, newResume]);
  //   }
  //   setCurrentView("list");
  // };
  const handleCVSaved = async (newResume: ResumeData) => {
    await loadResumes(); // Gọi lại API để lấy danh sách mới nhất
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

function useToast(): { toast: (message: string) => void } {
  const toast = useCallback((message: string) => {
    // Simple browser alert for demonstration; replace with a real toast in production
    window.alert(message);
  }, []);
  return { toast };
}
