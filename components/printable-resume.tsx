"use client"

import { forwardRef } from "react"
import type { ResumeData } from "./resume-builder"
import type { CustomizationOptions } from "./customization-panel"
import { ModernTemplate } from "./resume-templates/modern-template"
import { ClassicTemplate } from "./resume-templates/classic-template"

interface PrintableResumeProps {
  data: ResumeData
  template: string
  customization: CustomizationOptions
}

export const PrintableResume = forwardRef<HTMLDivElement, PrintableResumeProps>(
  ({ data, template, customization }, ref) => {
    const renderTemplate = () => {
      switch (template) {
        case "classic":
          return <ClassicTemplate data={data} customization={customization} isCompact={false} />
        case "modern":
        default:
          return <ModernTemplate data={data} customization={customization} isCompact={false} />
      }
    }

    return (
      <div
        ref={ref}
        className="print-container bg-white text-black"
        style={{
          width: "210mm",
          minHeight: "297mm",
          fontSize: "12pt",
          lineHeight: "1.4",
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @media print {
              .print-container {
                width: 100% !important;
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
              }
              
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              .no-print {
                display: none !important;
              }
              
              .print-break {
                page-break-before: always;
              }
            }
          `,
          }}
        />
        {renderTemplate()}
      </div>
    )
  },
)

PrintableResume.displayName = "PrintableResume"
