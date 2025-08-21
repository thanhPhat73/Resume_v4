"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ResumeData } from "../resume-builder"
import type { CustomizationOptions } from "../customization-panel"
import { fontOptions } from "../customization-panel"

interface ClassicTemplateProps {
  data: ResumeData
  customization: CustomizationOptions
  isCompact?: boolean
}

export function ClassicTemplate({ data, customization, isCompact = false }: ClassicTemplateProps) {
  const fontFamily = fontOptions.find((f) => f.value === customization.font)?.family || "font-serif"

  const sizeClasses = {
    small: {
      text: isCompact ? "text-[4px]" : "text-xs",
      heading: isCompact ? "text-[6px]" : "text-sm",
      title: isCompact ? "text-[8px]" : "text-lg",
      name: isCompact ? "text-[10px]" : "text-2xl",
    },
    medium: {
      text: isCompact ? "text-[5px]" : "text-sm",
      heading: isCompact ? "text-[7px]" : "text-base",
      title: isCompact ? "text-[9px]" : "text-xl",
      name: isCompact ? "text-[11px]" : "text-3xl",
    },
    large: {
      text: isCompact ? "text-[6px]" : "text-base",
      heading: isCompact ? "text-[8px]" : "text-lg",
      title: isCompact ? "text-[10px]" : "text-2xl",
      name: isCompact ? "text-[12px]" : "text-4xl",
    },
  }

  const spacingClasses = {
    compact: isCompact ? "space-y-0.5" : "space-y-2",
    normal: isCompact ? "space-y-1" : "space-y-4",
    relaxed: isCompact ? "space-y-1.5" : "space-y-6",
  }

  const sizes = sizeClasses[customization.fontSize]
  const spacing = spacingClasses[customization.spacing]

  return (
    <div className={`${fontFamily} bg-white text-black ${isCompact ? "p-2" : "p-8"} print-safe`}>
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

      {/* Classic centered header */}
      <div
        className={`text-center ${isCompact ? "mb-1" : "mb-6"} border-b-2 border-black ${isCompact ? "pb-1" : "pb-4"} print-safe`}
      >
        {data.personalInfo.profileImage && (
          <div className={`${isCompact ? "mb-1" : "mb-4"} flex justify-center`}>
            <Avatar className={isCompact ? "h-6 w-6" : "h-20 w-20"}>
              <AvatarImage src={data.personalInfo.profileImage || "/placeholder.svg"} />
              <AvatarFallback className="bg-gray-200 text-black">
                {data.personalInfo.fullName?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        <h1 className={`${sizes.name} font-bold ${isCompact ? "mb-0.5" : "mb-2"}`}>
          {data.personalInfo.fullName || "Họ và tên"}
        </h1>
        <div className={`${sizes.text} ${isCompact ? "space-y-0" : "space-y-1"}`}>
          {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
          {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
          {data.personalInfo.address && <p>{data.personalInfo.address}</p>}
        </div>
      </div>

      <div className={spacing}>
        {data.personalInfo.summary && (
          <section>
            <h2
              className={`${sizes.heading} font-bold ${isCompact ? "mb-0.5" : "mb-2"} text-center uppercase tracking-wide`}
            >
              Mô tả bản thân
            </h2>
            <p className={`${sizes.text} text-justify`}>{data.personalInfo.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <h2
              className={`${sizes.heading} font-bold ${isCompact ? "mb-0.5" : "mb-3"} text-center uppercase tracking-wide`}
            >
              Kinh nghiệm làm việc
            </h2>
            <div className={isCompact ? "space-y-0.5" : "space-y-3"}>
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="text-center">
                    <h3 className={`${sizes.text} font-bold`}>{exp.position}</h3>
                    <p className={`${sizes.text} italic`}>{exp.company}</p>
                    <p className={`${sizes.text} text-gray-600`}>
                      {exp.startDate} - {exp.current ? "Hiện tại" : exp.endDate}
                    </p>
                  </div>
                  {exp.description && <p className={`${sizes.text} mt-1 text-justify`}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section>
            <h2
              className={`${sizes.heading} font-bold ${isCompact ? "mb-0.5" : "mb-3"} text-center uppercase tracking-wide`}
            >
              Học vấn
            </h2>
            <div className={isCompact ? "space-y-0.5" : "space-y-3"}>
              {data.education.map((edu) => (
                <div key={edu.id} className="text-center">
                  <h3 className={`${sizes.text} font-bold`}>
                    {edu.degree} - {edu.field}
                  </h3>
                  <p className={`${sizes.text} italic`}>{edu.institution}</p>
                  <p className={`${sizes.text} text-gray-600`}>
                    {edu.startDate} - {edu.endDate}
                  </p>
                  {edu.gpa && <p className={sizes.text}>GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills.length > 0 && (
          <section>
            <h2
              className={`${sizes.heading} font-bold ${isCompact ? "mb-0.5" : "mb-3"} text-center uppercase tracking-wide`}
            >
              Kỹ năng
            </h2>
            <div className="text-center">
              <p className={sizes.text}>
                {data.skills
                  .map(
                    (skill) =>
                      `${skill.name} (${
                        skill.level === "beginner"
                          ? "Mới bắt đầu"
                          : skill.level === "intermediate"
                            ? "Trung bình"
                            : skill.level === "advanced"
                              ? "Nâng cao"
                              : "Chuyên gia"
                      })`,
                  )
                  .join(" • ")}
              </p>
            </div>
          </section>
        )}

        {data.activities.length > 0 && (
          <section>
            <h2
              className={`${sizes.heading} font-bold ${isCompact ? "mb-0.5" : "mb-3"} text-center uppercase tracking-wide`}
            >
              Hoạt động
            </h2>
            <div className={isCompact ? "space-y-0.5" : "space-y-2"}>
              {data.activities.map((activity) => (
                <div key={activity.id} className="text-center">
                  <h3 className={`${sizes.text} font-bold`}>{activity.title}</h3>
                  <p className={`${sizes.text} italic`}>{activity.organization}</p>
                  <p className={`${sizes.text} text-gray-600`}>
                    {activity.startDate} - {activity.endDate || "Hiện tại"}
                  </p>
                  {activity.description && <p className={`${sizes.text} mt-1 text-justify`}>{activity.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.awards.length > 0 && (
          <section>
            <h2
              className={`${sizes.heading} font-bold ${isCompact ? "mb-0.5" : "mb-3"} text-center uppercase tracking-wide`}
            >
              Giải thưởng & Chứng chỉ
            </h2>
            <div className={isCompact ? "space-y-0.5" : "space-y-2"}>
              {data.awards.map((award) => (
                <div key={award.id} className="text-center">
                  <h3 className={`${sizes.text} font-bold`}>{award.title}</h3>
                  <p className={`${sizes.text} italic`}>{award.issuer}</p>
                  <p className={`${sizes.text} text-gray-600`}>{award.date}</p>
                  {award.description && <p className={`${sizes.text} mt-1 text-justify`}>{award.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
