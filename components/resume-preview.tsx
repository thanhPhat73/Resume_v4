"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { ResumeData } from "./resume-builder";
import type { CustomizationOptions } from "./customization-panel";
import { ModernTemplate } from "./resume-templates/modern-template";
import { ClassicTemplate } from "./resume-templates/classic-template";
import axios from "axios";
import styles from "./resume-preview.module.css";

interface ResumePreviewProps {
  data: ResumeData;
  template?: string;
  customization?: CustomizationOptions;
  isCompact?: boolean;
  onSave?: (resumeData: ResumeData) => void; // Thêm callback để chuyển về danh sách CV sau khi lưu
  resumeData?: ResumeData; // Thêm prop để nhận dữ liệu resume từ parent component
}

const defaultCustomization: CustomizationOptions = {
  font: "inter",
  colorScheme: "blue",
  spacing: "normal",
  fontSize: "medium",
};

const API_BASE_URL = "http://localhost:8080";
const TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidHlwZSI6ImFjY2Vzc190b2tlbiIsInN1YiI6InRoYW5oUGhhdCIsImlhdCI6MTc1NTc4NzgzMCwiZXhwIjoxNzU1NzkxNDMwfQ.rtbUu2DJ1fHHXerm67CQ1GiM1yjh23dWAhBF6lyY5s4";

const mapFormToApi = (data: ResumeData) => {
  return {
    fullName: data.personalInfo?.fullName || "",
    email: data.personalInfo?.email || "",
    phone: data.personalInfo?.phone || "",
    profilePicture: data.personalInfo?.profileImage || "",
    summary: data.personalInfo?.summary || "",
    jobTitle: data.personalInfo?.jobTitle || "",
    educations: (data.education || []).map((edu) => ({
      schoolName: edu.institution || "",
      degree: edu.degree || "",
      major: edu.field || "",
      startYear: edu.startDate ? parseInt(edu.startDate.split("-")[0]) : "",
      endYear: edu.endDate ? parseInt(edu.endDate.split("-")[0]) : "",
      gpa: edu.gpa || "",
    })),
    experiences: (data.experience || []).map((exp) => ({
      companyName: exp.company || "",
      position: exp.position || "",
      startYear: exp.startDate ? parseInt(exp.startDate.split("-")[0]) : "",
      endYear: exp.endDate ? parseInt(exp.endDate.split("-")[0]) : "",
      description: exp.description || "",
    })),
    awards: (data.awards || []).map((award) => ({
      awardName: award.title || "",
      awardYear: award.date ? parseInt(award.date.split("-")[0]) : "",
      donViTrao: award.issuer || "",
      description: award.description || "",
    })),
    activities: (data.activities || []).map((act) => ({
      activityName: act.title || "",
      organization: act.organization || "",
      startYear: act.startDate ? parseInt(act.startDate.split("-")[0]) : "",
      endYear: act.endDate ? parseInt(act.endDate.split("-")[0]) : "",
      description: act.description || "",
    })),
    skillsResumes: data.skills || [],
  };
};

export function ResumePreview({
  data,
  template = "modern",
  customization = defaultCustomization,
  isCompact = false,
  onSave, // Nhận callback onSave từ props
  resumeData, // Nhận resumeData từ props
}: ResumePreviewProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveCV = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const apiData = mapFormToApi(data);
      await axios.post(`${API_BASE_URL}/api/resumes/me`, apiData, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      toast({
        title: "Lưu CV thành công!",
        description: "CV của bạn đã được lưu lên server.",
      });
      if (onSave) {
        onSave(data); // Truyền dữ liệu CV đã lưu về parent component
      }
    } catch (error: any) {
      console.error("Error saving CV:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể lưu CV. Vui lòng thử lại.";
      toast({
        title: "Lỗi khi lưu CV",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderTemplate = () => {
    switch (template) {
      case "classic":
        return (
          <ClassicTemplate
            data={data}
            customization={customization}
            isCompact={isCompact}
          />
        );
      case "modern":
      default:
        return (
          <ModernTemplate
            data={data}
            customization={customization}
            isCompact={isCompact}
          />
        );
    }
  };

  return (
    <Card
      className={isCompact ? "" : "mx-auto"}
      style={isCompact ? {} : { maxWidth: "56rem" }}
    >
      <CardContent
        className={isCompact ? "" : "p-8"}
        style={isCompact ? { padding: "0" } : {}}
      >
        {!isCompact && (
          <div className={styles.saveButtonContainer}>
            <button
              onClick={handleSaveCV}
              disabled={isSaving}
              className={styles.saveButton}
            >
              <Save className={`h-4 w-4 ${isSaving ? "animate-spin" : ""}`} />
              {isSaving ? "Đang lưu..." : "Lưu CV"}
            </button>
          </div>
        )}
        <div
          className={isCompact ? "" : "shadow-lg"}
          style={isCompact ? {} : { aspectRatio: "8.5 / 11" }}
        >
          {renderTemplate()}
        </div>
      </CardContent>
    </Card>
  );
}
