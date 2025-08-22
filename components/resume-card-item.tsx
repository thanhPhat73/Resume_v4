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
import { mapFormToApi, resumeApi } from "@/lib/api";

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

export function ResumeCardItem({
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
      const createResume = await resumeApi.saveMyResume(apiData);

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
            {/* <button
              onClick={handleSaveCV}
              disabled={isSaving}
              className={styles.saveButton}
            >
              <Save className={`h-4 w-4 ${isSaving ? "animate-spin" : ""}`} />
              {isSaving ? "Đang lưu..." : "Lưu CV"}
            </button> */}
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
