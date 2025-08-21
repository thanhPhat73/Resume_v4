"use client"

import { useFormContext, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Award } from "lucide-react"
import { DragDropList } from "../drag-drop-list"
import type { ResumeData } from "../resume-builder"

export function AwardsStep() {
  const { register, control } = useFormContext<ResumeData>()
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "awards",
  })

  const addAward = () => {
    append({
      id: Date.now().toString(),
      title: "",
      issuer: "",
      date: "",
      description: "",
    })
  }

  const handleReorder = (oldIndex: number, newIndex: number) => {
    move(oldIndex, newIndex)
  }

  const renderAwardItem = (field: any, index: number, isDragging?: boolean) => (
    <Card key={field.id} className={isDragging ? "shadow-lg" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Giải thưởng {index + 1}</CardTitle>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`awardTitle-${index}`}>Tên giải thưởng *</Label>
            <Input
              id={`awardTitle-${index}`}
              {...register(`awards.${index}.title`, { required: true })}
              placeholder="Học sinh giỏi, Chứng chỉ TOEIC..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`issuer-${index}`}>Đơn vị trao *</Label>
            <Input
              id={`issuer-${index}`}
              {...register(`awards.${index}.issuer`, { required: true })}
              placeholder="Trường học, tổ chức..."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`awardDate-${index}`}>Ngày nhận *</Label>
            <Input id={`awardDate-${index}`} type="month" {...register(`awards.${index}.date`, { required: true })} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`awardDescription-${index}`}>Mô tả</Label>
          <Textarea
            id={`awardDescription-${index}`}
            {...register(`awards.${index}.description`)}
            placeholder="Mô tả chi tiết về giải thưởng..."
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Giải thưởng & Chứng chỉ</h3>
        </div>
        <Button onClick={addAward} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm giải thưởng
        </Button>
      </div>

      {fields.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Chưa có giải thưởng nào. Hãy thêm các giải thưởng và chứng chỉ của bạn!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {fields.length > 0 && (
        <div>
          <div className="mb-4 p-3 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20">
            <p className="text-sm text-muted-foreground text-center">💡 Kéo và thả để sắp xếp lại thứ tự giải thưởng</p>
          </div>
          <DragDropList
            items={fields}
            onReorder={handleReorder}
            renderItem={renderAwardItem}
            keyExtractor={(field) => field.id}
          />
        </div>
      )}
    </div>
  )
}
