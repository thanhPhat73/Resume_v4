"use client";

import type React from "react";
import { useState } from "react";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, User } from "lucide-react";
import type { ResumeData } from "../resume-builder";

export function PersonalInfoStep() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ResumeData>();
  const [imagePreview, setImagePreview] = useState<string | null>(
    watch("personalInfo.profileImage") || null
  );

  const profileImage = watch("personalInfo.profileImage");
  const fullName = watch("personalInfo.fullName");

  // Xử lý khi chọn file ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setValue("personalInfo.profileImage", base64String, {
        shouldValidate: true,
      });
    };
    reader.readAsDataURL(file);
  };

  // Xóa ảnh
  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("personalInfo.profileImage", "", { shouldValidate: true });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Card>
        <CardHeader>
          <CardTitle
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <User className="h-5 w-5" />
            Ảnh đại diện
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Avatar style={{ height: "5rem", width: "5rem" }}>
              <AvatarImage src={profileImage || "/placeholder.svg"} />
              <AvatarFallback>
                {fullName ? (
                  fullName.charAt(0).toUpperCase()
                ) : (
                  <User className="h-8 w-8" />
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="profile-image" style={{ cursor: "pointer" }}>
                <Button
                  variant="outline"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    backgroundColor: "transparent",
                  }}
                  asChild
                >
                  <span>
                    <Upload className="h-4 w-4" />
                    Tải ảnh lên
                  </span>
                </Button>
              </Label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--muted-foreground)",
                  marginTop: "0.5rem",
                }}
              >
                Khuyến nghị: Ảnh vuông, kích thước tối thiểu 200x200px
              </p>
                {/* {imagePreview && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "5rem",
                        height: "5rem",
                        objectFit: "cover",
                        borderRadius: "0.375rem",
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={handleRemoveImage}
                      style={{ height: "2rem", width: "2rem", padding: 0 }}
                    >
                      <span style={{ fontSize: "1rem", lineHeight: 0 }}>×</span>
                    </Button>
                  </div>
                )} */}
            </div>
          </div>
        </CardContent>
      </Card>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1rem",
        }}
        className="responsive-grid"
      >
        <style jsx>{`
          @media (min-width: 768px) {
            .responsive-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }
        `}</style>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <Label htmlFor="fullName">Họ và tên *</Label>
          <Input
            id="fullName"
            {...register("personalInfo.fullName", {
              required: "Vui lòng nhập họ tên",
            })}
            placeholder="Nguyễn Văn A"
          />
          {errors.personalInfo?.fullName && (
            <p style={{ fontSize: "0.875rem", color: "var(--destructive)" }}>
              {errors.personalInfo.fullName.message}
            </p>
          )}
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register("personalInfo.email", {
              required: "Vui lòng nhập email",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email không hợp lệ",
              },
            })}
            placeholder="example@email.com"
          />
          {errors.personalInfo?.email && (
            <p style={{ fontSize: "0.875rem", color: "var(--destructive)" }}>
              {errors.personalInfo.email.message}
            </p>
          )}
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <Label htmlFor="phone">Số điện thoại *</Label>
          <Input
            id="phone"
            {...register("personalInfo.phone", {
              required: "Vui lòng nhập số điện thoại",
            })}
            placeholder="0123456789"
          />
          {errors.personalInfo?.phone && (
            <p style={{ fontSize: "0.875rem", color: "var(--destructive)" }}>
              {errors.personalInfo.phone.message}
            </p>
          )}
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <Label htmlFor="jobTitle">Vị trí công việc *</Label>
          <Input
            id="jobTitle"
            {...register("personalInfo.jobTitle", {
              required: "Vui lòng nhập vị trí công việc",
            })}
            placeholder="Senior Developer, Marketing Manager..."
          />
          {errors.personalInfo?.jobTitle && (
            <p style={{ fontSize: "0.875rem", color: "var(--destructive)" }}>
              {errors.personalInfo.jobTitle.message}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Label htmlFor="summary">Mô tả bản thân</Label>
        <Textarea
          id="summary"
          {...register("personalInfo.summary")}
          placeholder="Mô tả ngắn gọn về bản thân, mục tiêu nghề nghiệp..."
          rows={4}
        />
        <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
          Viết 2-3 câu ngắn gọn về kinh nghiệm và mục tiêu của bạn
        </p>
      </div>
    </div>
  );
}
