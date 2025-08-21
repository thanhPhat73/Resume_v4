"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Loader2, CheckCircle } from "lucide-react";
import type { ResumeData } from "./resume-builder";
import type { CustomizationOptions } from "./customization-panel";
import { PrintableResume } from "./printable-resume";

interface PDFExportProps {
  data: ResumeData;
  template: string;
  customization: CustomizationOptions;
  onSave?: (resumeData: ResumeData) => void; // Thêm dòng này
  resumeData?: ResumeData;
}

export function PDFExport({ data, template, customization }: PDFExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!contentRef.current) return;

    setIsExporting(true);

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setIsExporting(false);
      return;
    }

    // Get the content to print
    const printContent = contentRef.current.innerHTML;

    // Write the HTML structure
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.personalInfo.fullName || "Resume"}_CV</title>
          <meta charset="utf-8">
          <style>
            @page {
              size: A4;
              margin: 0.5in;
            }
            
            body {
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, sans-serif;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .print-container {
              width: 100% !important;
              height: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
            }
            
            .print-safe * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .no-print {
              display: none !important;
            }
            
            @media print {
              body {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        setIsExporting(false);
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
      }, 500);
    };
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Xuất PDF
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-medium">Tải xuống Resume</h4>
              <p className="text-sm text-muted-foreground">
                Xuất resume dưới dạng PDF để in hoặc gửi cho nhà tuyển dụng
              </p>
            </div>
            <div className="flex items-center gap-2">
              {exportSuccess && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Đã xuất
                </Badge>
              )}
              <Button
                onClick={handlePrint}
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xuất...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Tải PDF
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <h5 className="font-medium text-foreground">Lưu ý khi xuất PDF:</h5>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Đảm bảo trình duyệt hỗ trợ in nền (background graphics)</li>
              <li>Chọn khổ giấy A4 để có kết quả tốt nhất</li>
              <li>Kiểm tra xem trước trước khi in hoặc lưu</li>
              <li>Màu sắc có thể khác nhau giữa màn hình và bản in</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Hidden printable component */}
      <div style={{ display: "none" }}>
        <PrintableResume
          ref={contentRef}
          data={data}
          template={template}
          customization={customization}
        />
      </div>
    </div>
  );
}
