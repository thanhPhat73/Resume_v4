"use client"

import { useFormContext, useFieldArray } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Briefcase } from "lucide-react"
import { DragDropList } from "../drag-drop-list"
import type { ResumeData } from "../resume-builder"
import styles from "./experience-step.module.css"

export function ExperienceStep() {
  const { register, control, watch, setValue } = useFormContext<ResumeData>()
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "experience",
  })

  const positionOptions = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer",
    "Marketing Manager",
    "Sales Manager",
    "Business Analyst",
    "Project Manager",
    "Quality Assurance",
    "System Administrator",
    "Database Administrator",
    "Mobile Developer",
    "Web Developer",
    "Technical Lead",
    "Team Lead",
    "Senior Developer",
    "Junior Developer",
    "Intern",
    "Freelancer",
    "Consultant",
    "Other",
  ]

  const addExperience = () => {
    append({
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    })
  }

  const handleReorder = (oldIndex: number, newIndex: number) => {
    move(oldIndex, newIndex)
  }

  const renderExperienceItem = (field: any, index: number, isDragging?: boolean) => {
    return (
      <Card key={field.id} className={isDragging ? "shadow-lg" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Kinh nghiệm {index + 1}</CardTitle>
            <button onClick={() => remove(index)} className={styles.deleteButton}>
              <Trash2 className="h-4 w-4" />
            </button>
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
              <Label htmlFor={`company-${index}`}>Công ty *</Label>
              <Input
                id={`company-${index}`}
                {...register(`experience.${index}.company`, { required: true })}
                placeholder="Tên công ty"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`position-${index}`}>Vị trí *</Label>
              <Select
                value={watch(`experience.${index}.position`)}
                onValueChange={(value) => setValue(`experience.${index}.position`, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vị trí công việc" />
                </SelectTrigger>
                <SelectContent>
                  {positionOptions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`startDate-${index}`}>Ngày bắt đầu *</Label>
              <Input
                id={`startDate-${index}`}
                type="month"
                {...register(`experience.${index}.startDate`, { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`endDate-${index}`}>Ngày kết thúc</Label>
              <Input id={`endDate-${index}`} type="month" {...register(`experience.${index}.endDate`)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`description-${index}`}>Mô tả công việc</Label>
            <Textarea
              id={`description-${index}`}
              {...register(`experience.${index}.description`)}
              placeholder="Mô tả chi tiết về công việc, thành tích đạt được..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className={styles.headerContainer}>
        <div className={styles.titleContainer}>
          <Briefcase className="h-5 w-5" />
          <h3 className={styles.title}>Kinh nghiệm làm việc</h3>
        </div>
        <button onClick={addExperience} className={styles.addButton}>
          <Plus className="h-4 w-4" />
          Thêm kinh nghiệm
        </button>
      </div>

      {fields.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Chưa có kinh nghiệm làm việc nào. Hãy thêm kinh nghiệm đầu tiên của bạn!
              </p>
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
            <p className="text-sm text-muted-foreground text-center">💡 Kéo và thả để sắp xếp lại thứ tự kinh nghiệm</p>
          </div>
          <DragDropList
            items={fields}
            onReorder={handleReorder}
            renderItem={renderExperienceItem}
            keyExtractor={(field) => field.id}
          />
        </div>
      )}
    </div>
  )
}
