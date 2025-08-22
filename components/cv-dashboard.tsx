"use client";

import { useState, useEffect } from "react";
import { ResumeBuilder } from "@/components/resume-builder";
import { CVList } from "@/components/cv-list";
import { CVEmptyState } from "@/components/cv-empty-state";
import type { ResumeData } from "@/components/resume-builder";
import { useCallback } from "react";
import { mapApiToForm, resumeApi } from "@/lib/api";
import { set } from "date-fns";
import { useToast } from "./ui/use-toast";

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
      toast({ description: "Lỗi: Không thể tải danh sách CV" });
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

  const handleEditCV = async (resume: ResumeData) => {
    try {
      const getDataResumeById = await resumeApi.getResumeById(resume.id);
      const mappedResume = mapApiToForm(getDataResumeById);
      setEditingResume(mappedResume);
      setCurrentView("builder");
    } catch (error) {
      console.error("Failed to load resume:", error);
      toast({ description: "Lỗi: Không thể tải CV" });
    }
  };

  const handleDeleteCV = async (resumeId: number) => {
    try {
      await resumeApi.deleteResume(resumeId);

      // remove from local state
      setResumes((prev) => prev.filter((resume) => resume.id !== resumeId));
      if (resumes.length === 1) {
        setCurrentView("empty");
      } else {
        setCurrentView("list");
      }
      await loadResumes();
    } catch (error) {
      console.error("Failed to delete resume:", error);
      toast({ description: "Lỗi: Không thể xóa CV" });
    }
  };

  const handleBackToList = () => {
    if (resumes.length > 0) {
      setCurrentView("list");
    } else {
      setCurrentView("empty");
    }
  };

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
