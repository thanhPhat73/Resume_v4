"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ResumeData } from "../resume-builder"
import type { CustomizationOptions } from "../customization-panel"
import { colorSchemes, fontOptions } from "../customization-panel"

interface ModernTemplateProps {
  data: ResumeData
  customization: CustomizationOptions
  isCompact?: boolean
}

export function ModernTemplate({ data, customization, isCompact = false }: ModernTemplateProps) {
  const colorScheme = colorSchemes.find((c) => c.value === customization.colorScheme) || colorSchemes[0]
  const fontFamily = fontOptions.find((f) => f.value === customization.font)?.family || "font-sans"

  const getSizeStyles = (type: "text" | "heading" | "title" | "name") => {
    const sizeMap = {
      small: {
        text: isCompact ? "4px" : "0.75rem",
        heading: isCompact ? "6px" : "0.875rem",
        title: isCompact ? "8px" : "1.125rem",
        name: isCompact ? "10px" : "1.5rem",
      },
      medium: {
        text: isCompact ? "5px" : "0.875rem",
        heading: isCompact ? "7px" : "1rem",
        title: isCompact ? "9px" : "1.25rem",
        name: isCompact ? "11px" : "1.875rem",
      },
      large: {
        text: isCompact ? "6px" : "1rem",
        heading: isCompact ? "8px" : "1.125rem",
        title: isCompact ? "10px" : "1.5rem",
        name: isCompact ? "12px" : "2.25rem",
      },
    }
    return { fontSize: sizeMap[customization.fontSize][type] }
  }

  const getSpacingStyles = () => {
    const spacingMap = {
      compact: isCompact ? "0.125rem" : "0.5rem",
      normal: isCompact ? "0.25rem" : "1rem",
      relaxed: isCompact ? "0.375rem" : "1.5rem",
    }
    return { gap: spacingMap[customization.spacing] }
  }

  const spacingStyle = getSpacingStyles()

  return (
    <div
      className={`${fontFamily} bg-white print-safe`}
      style={{
        color: "rgb(17 24 39)",
        padding: isCompact ? "0.5rem" : "2rem",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .print-safe * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          `,
        }}
      />

      {/* Header with accent color */}
      <div
        className="rounded-lg print-safe"
        style={{
          backgroundColor: colorScheme.primary,
          padding: isCompact ? "0.5rem" : "1.5rem",
          marginBottom: isCompact ? "0.25rem" : "1.5rem",
        }}
      >
        <div className="flex items-center gap-4" style={{ color: "white" }}>
          {data.personalInfo.profileImage && (
            <Avatar style={{ height: isCompact ? "2rem" : "5rem", width: isCompact ? "2rem" : "5rem" }}>
              <AvatarImage src={data.personalInfo.profileImage || "/placeholder.svg"} />
              <AvatarFallback style={{ backgroundColor: colorScheme.secondary, color: "white" }}>
                {data.personalInfo.fullName?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          )}
          <div>
            <h1 className="font-bold" style={getSizeStyles("name")}>
              {data.personalInfo.fullName || "Họ và tên"}
            </h1>
            <div
              style={{
                ...getSizeStyles("text"),
                opacity: 0.9,
                display: "flex",
                flexDirection: "column",
                gap: isCompact ? "0" : "0.25rem",
              }}
            >
              {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
              {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
              {data.personalInfo.address && <p>{data.personalInfo.address}</p>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", ...spacingStyle }}>
        {data.personalInfo.summary && (
          <section>
            <h2
              className="font-semibold print-safe"
              style={{
                ...getSizeStyles("heading"),
                marginBottom: isCompact ? "0.125rem" : "0.5rem",
                paddingBottom: "0.25rem",
                borderBottom: "2px solid",
                borderColor: colorScheme.primary,
              }}
            >
              MÔ TẢ BẢN THÂN
            </h2>
            <p style={getSizeStyles("text")}>{data.personalInfo.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <h2
              className="font-semibold print-safe"
              style={{
                ...getSizeStyles("heading"),
                marginBottom: isCompact ? "0.125rem" : "0.75rem",
                paddingBottom: "0.25rem",
                borderBottom: "2px solid",
                borderColor: colorScheme.primary,
              }}
            >
              KINH NGHIỆM LÀM VIỆC
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: isCompact ? "0.125rem" : "0.75rem" }}>
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="font-semibold print-safe"
                        style={{ ...getSizeStyles("text"), color: colorScheme.secondary }}
                      >
                        {exp.position}
                      </h3>
                      <p style={{ ...getSizeStyles("text"), color: "rgb(75 85 99)" }}>{exp.company}</p>
                    </div>
                    <p style={{ ...getSizeStyles("text"), color: "rgb(107 114 128)" }}>
                      {exp.startDate} - {exp.current ? "Hiện tại" : exp.endDate}
                    </p>
                  </div>
                  {exp.description && (
                    <p style={{ ...getSizeStyles("text"), marginTop: "0.25rem" }}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section>
            <h2
              className="font-semibold print-safe"
              style={{
                ...getSizeStyles("heading"),
                marginBottom: isCompact ? "0.125rem" : "0.75rem",
                paddingBottom: "0.25rem",
                borderBottom: "2px solid",
                borderColor: colorScheme.primary,
              }}
            >
              HỌC VẤN
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: isCompact ? "0.125rem" : "0.75rem" }}>
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="font-semibold print-safe"
                        style={{ ...getSizeStyles("text"), color: colorScheme.secondary }}
                      >
                        {edu.degree} - {edu.field}
                      </h3>
                      <p style={{ ...getSizeStyles("text"), color: "rgb(75 85 99)" }}>{edu.institution}</p>
                    </div>
                    <p style={{ ...getSizeStyles("text"), color: "rgb(107 114 128)" }}>
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                  {edu.gpa && <p style={getSizeStyles("text")}>GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills.length > 0 && (
          <section>
            <h2
              className="font-semibold print-safe"
              style={{
                ...getSizeStyles("heading"),
                marginBottom: isCompact ? "0.125rem" : "0.75rem",
                paddingBottom: "0.25rem",
                borderBottom: "2px solid",
                borderColor: colorScheme.primary,
              }}
            >
              KỸ NĂNG
            </h2>
            <div
              className="grid"
              style={{
                gridTemplateColumns: isCompact ? "repeat(1, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))",
                gap: isCompact ? "0" : "0.5rem",
              }}
            >
              {data.skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2" style={getSizeStyles("text")}>
                  <div
                    className="rounded-full print-safe"
                    style={{
                      width: isCompact ? "0.25rem" : "0.5rem",
                      height: isCompact ? "0.25rem" : "0.5rem",
                      backgroundColor: colorScheme.primary,
                    }}
                  />
                  <span className="font-medium">{skill.name}</span>
                  <span style={{ color: "rgb(75 85 99)" }}>
                    (
                    {skill.level === "beginner"
                      ? "Mới bắt đầu"
                      : skill.level === "intermediate"
                        ? "Trung bình"
                        : skill.level === "advanced"
                          ? "Nâng cao"
                          : "Chuyên gia"}
                    )
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.activities.length > 0 && (
          <section>
            <h2
              className="font-semibold print-safe"
              style={{
                ...getSizeStyles("heading"),
                marginBottom: isCompact ? "0.125rem" : "0.75rem",
                paddingBottom: "0.25rem",
                borderBottom: "2px solid",
                borderColor: colorScheme.primary,
              }}
            >
              HOẠT ĐỘNG
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: isCompact ? "0.125rem" : "0.5rem" }}>
              {data.activities.map((activity) => (
                <div key={activity.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="font-semibold print-safe"
                        style={{ ...getSizeStyles("text"), color: colorScheme.secondary }}
                      >
                        {activity.title}
                      </h3>
                      <p style={{ ...getSizeStyles("text"), color: "rgb(75 85 99)" }}>{activity.organization}</p>
                    </div>
                    <p style={{ ...getSizeStyles("text"), color: "rgb(107 114 128)" }}>
                      {activity.startDate} - {activity.endDate || "Hiện tại"}
                    </p>
                  </div>
                  {activity.description && (
                    <p style={{ ...getSizeStyles("text"), marginTop: "0.25rem" }}>{activity.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.awards.length > 0 && (
          <section>
            <h2
              className="font-semibold print-safe"
              style={{
                ...getSizeStyles("heading"),
                marginBottom: isCompact ? "0.125rem" : "0.75rem",
                paddingBottom: "0.25rem",
                borderBottom: "2px solid",
                borderColor: colorScheme.primary,
              }}
            >
              GIẢI THƯỞNG & CHỨNG CHỈ
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: isCompact ? "0.125rem" : "0.5rem" }}>
              {data.awards.map((award) => (
                <div key={award.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className="font-semibold print-safe"
                        style={{ ...getSizeStyles("text"), color: colorScheme.secondary }}
                      >
                        {award.title}
                      </h3>
                      <p style={{ ...getSizeStyles("text"), color: "rgb(75 85 99)" }}>{award.issuer}</p>
                    </div>
                    <p style={{ ...getSizeStyles("text"), color: "rgb(107 114 128)" }}>{award.date}</p>
                  </div>
                  {award.description && (
                    <p style={{ ...getSizeStyles("text"), marginTop: "0.25rem" }}>{award.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
