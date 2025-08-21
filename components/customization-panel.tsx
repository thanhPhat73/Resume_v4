"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Palette, Type, Layout } from "lucide-react"

export interface CustomizationOptions {
  font: string
  colorScheme: string
  spacing: "compact" | "normal" | "relaxed"
  fontSize: "small" | "medium" | "large"
}

export const fontOptions = [
  { value: "inter", label: "Inter", family: "font-sans" },
  { value: "serif", label: "Times New Roman", family: "font-serif" },
  { value: "mono", label: "JetBrains Mono", family: "font-mono" },
  { value: "playfair", label: "Playfair Display", family: "font-serif" },
]

export const colorSchemes = [
  { value: "blue", label: "Xanh dương", primary: "#3b82f6", secondary: "#1e40af" },
  { value: "green", label: "Xanh lá", primary: "#10b981", secondary: "#047857" },
  { value: "purple", label: "Tím", primary: "#8b5cf6", secondary: "#7c3aed" },
  { value: "red", label: "Đỏ", primary: "#ef4444", secondary: "#dc2626" },
  { value: "orange", label: "Cam", primary: "#f97316", secondary: "#ea580c" },
  { value: "gray", label: "Xám", primary: "#6b7280", secondary: "#4b5563" },
]

interface CustomizationPanelProps {
  options: CustomizationOptions
  onOptionsChange: (options: CustomizationOptions) => void
}

export function CustomizationPanel({ options, onOptionsChange }: CustomizationPanelProps) {
  const updateOption = <K extends keyof CustomizationOptions>(key: K, value: CustomizationOptions[K]) => {
    onOptionsChange({ ...options, [key]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Tùy chỉnh thiết kế</h3>
        <p className="text-sm text-muted-foreground">Cá nhân hóa resume theo phong cách của bạn</p>
      </div>

      <Card>
        <CardHeader style={{ paddingBottom: "0.75rem" }}>
          <CardTitle className="text-base flex items-center gap-2">
            <Type className="h-4 w-4" />
            Typography
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="font-select">Font chữ</Label>
            <Select value={options.font} onValueChange={(value) => updateOption("font", value)}>
              <SelectTrigger id="font-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value} className={font.family}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="font-size-select">Kích thước chữ</Label>
            <Select value={options.fontSize} onValueChange={(value) => updateOption("fontSize", value as any)}>
              <SelectTrigger id="font-size-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Nhỏ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="large">Lớn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader style={{ paddingBottom: "0.75rem" }}>
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Màu sắc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="color-select">Bảng màu</Label>
            <Select value={options.colorScheme} onValueChange={(value) => updateOption("colorScheme", value)}>
              <SelectTrigger id="color-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorSchemes.map((scheme) => (
                  <SelectItem key={scheme.value} value={scheme.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className="rounded-full border"
                        style={{
                          width: "1rem",
                          height: "1rem",
                          backgroundColor: scheme.primary,
                        }}
                      />
                      {scheme.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader style={{ paddingBottom: "0.75rem" }}>
          <CardTitle className="text-base flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="spacing-select">Khoảng cách</Label>
            <Select value={options.spacing} onValueChange={(value) => updateOption("spacing", value as any)}>
              <SelectTrigger id="spacing-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Gọn</SelectItem>
                <SelectItem value="normal">Bình thường</SelectItem>
                <SelectItem value="relaxed">Rộng rãi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
