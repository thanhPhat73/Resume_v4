"use client"

import { useFormContext, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, GraduationCap } from "lucide-react"
import { DragDropList } from "../drag-drop-list"
import type { ResumeData } from "../resume-builder"

export function EducationStep() {
  const { register, control, watch, setValue } = useFormContext<ResumeData>()
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "education",
  })

  const degreeOptions = [
    "Tiến sĩ (Ph.D)",
    "Thạc sĩ (Master)",
    "Cử nhân (Bachelor)",
    "Kỹ sư (Engineer)",
    "Cao đẳng (Associate)",
    "Trung cấp (Diploma)",
    "Chứng chỉ (Certificate)",
    "Khác",
  ]

  const majorOptions = [
    "Công nghệ thông tin",
    "Khoa học máy tính",
    "Kỹ thuật phần mềm",
    "Hệ thống thông tin",
    "An ninh mạng",
    "Trí tuệ nhân tạo",
    "Khoa học dữ liệu",
    "Kỹ thuật điện tử",
    "Kỹ thuật cơ khí",
    "Kỹ thuật xây dựng",
    "Kinh tế",
    "Quản trị kinh doanh",
    "Marketing",
    "Tài chính - Ngân hàng",
    "Kế toán",
    "Luật",
    "Y học",
    "Dược học",
    "Giáo dục",
    "Ngôn ngữ Anh",
    "Thiết kế đồ họa",
    "Kiến trúc",
    "Khác",
  ]

  const addEducation = () => {
    append({
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
    })
  }

  const handleReorder = (oldIndex: number, newIndex: number) => {
    move(oldIndex, newIndex)
  }

  const renderEducationItem = (field: any, index: number, isDragging?: boolean) => (
    <Card key={field.id} className={isDragging ? "shadow-lg" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Học vấn {index + 1}</CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={() => remove(index)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4" style={{ gridTemplateColumns: "repeat(1, minmax(0, 1fr))" }}>
          <style jsx>{`
            @media (min-width: 768px) {
              .grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
            }
          `}</style>
          <div className="space-y-2">
            <Label htmlFor={`institution-${index}`}>Trường học *</Label>
            <Input
              id={`institution-${index}`}
              {...register(`education.${index}.institution`, { required: true })}
              placeholder="Tên trường học"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`degree-${index}`}>Bằng cấp *</Label>
            <Select
              value={watch(`education.${index}.degree`)}
              onValueChange={(value) => setValue(`education.${index}.degree`, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn bằng cấp" />
              </SelectTrigger>
              <SelectContent>
                {degreeOptions.map((degree) => (
                  <SelectItem key={degree} value={degree}>
                    {degree}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`field-${index}`}>Chuyên ngành *</Label>
            <Select
              value={watch(`education.${index}.field`)}
              onValueChange={(value) => setValue(`education.${index}.field`, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn chuyên ngành" />
              </SelectTrigger>
              <SelectContent>
                {majorOptions.map((major) => (
                  <SelectItem key={major} value={major}>
                    {major}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`gpa-${index}`}>GPA</Label>
            <Input id={`gpa-${index}`} {...register(`education.${index}.gpa`)} placeholder="3.5/4.0" />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`startDate-${index}`}>Ngày bắt đầu *</Label>
            <Input
              id={`startDate-${index}`}
              type="month"
              {...register(`education.${index}.startDate`, { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`endDate-${index}`}>Ngày tốt nghiệp *</Label>
            <Input
              id={`endDate-${index}`}
              type="month"
              {...register(`education.${index}.endDate`, { required: true })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Học vấn</h3>
        </div>
        <Button onClick={addEducation} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm học vấn
        </Button>
      </div>

      {fields.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Chưa có thông tin học vấn nào. Hãy thêm trình độ học vấn của bạn!</p>
            </div>
          </CardContent>
        </Card>
      )}

      {fields.length > 0 && (
        <div>
          <div
            className="mb-4 p-3 rounded-lg"
            style={{
              backgroundColor: "color-mix(in srgb, var(--muted) 50%, transparent)",
              border: "2px dashed color-mix(in srgb, var(--muted-foreground) 20%, transparent)",
            }}
          >
            <p className="text-sm text-muted-foreground text-center">💡 Kéo và thả để sắp xếp lại thứ tự học vấn</p>
          </div>
          <DragDropList
            items={fields}
            onReorder={handleReorder}
            renderItem={renderEducationItem}
            keyExtractor={(field) => field.id}
          />
        </div>
      )}
    </div>
  )
}
