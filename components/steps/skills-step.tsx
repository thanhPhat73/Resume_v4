"use client"

import { useFormContext, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Zap } from "lucide-react"
import { DragDropList } from "../drag-drop-list"
import type { ResumeData } from "../resume-builder"

export function SkillsStep() {
  const { register, control } = useFormContext<ResumeData>()
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "skills",
  })

  const addSkill = () => {
    append("") // Now just adding empty string instead of object
  }

  const handleReorder = (oldIndex: number, newIndex: number) => {
    move(oldIndex, newIndex)
  }

  const renderSkillItem = (field: any, index: number, isDragging?: boolean) => (
    <Card key={field.id} className={isDragging ? "shadow-lg" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Kỹ năng {index + 1}</CardTitle>
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
        <div className="space-y-2">
          <Label htmlFor={`skill-${index}`}>Tên kỹ năng *</Label>
          <Input
            id={`skill-${index}`}
            {...register(`skills.${index}`, { required: true })}
            placeholder="JavaScript, Photoshop, Marketing..."
          />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Kỹ năng</h3>
        </div>
        <Button onClick={addSkill} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm kỹ năng
        </Button>
      </div>

      {fields.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Chưa có kỹ năng nào. Hãy thêm những kỹ năng của bạn!</p>
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
            <p className="text-sm text-muted-foreground text-center">💡 Kéo và thả để sắp xếp lại thứ tự kỹ năng</p>
          </div>
          <DragDropList
            items={fields}
            onReorder={handleReorder}
            renderItem={renderSkillItem}
            keyExtractor={(field) => field.id}
          />
        </div>
      )}
    </div>
  )
}
