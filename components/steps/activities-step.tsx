"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Users } from "lucide-react";
import { DragDropList } from "../drag-drop-list";
import type { ResumeData } from "../resume-builder";

export function ActivitiesStep() {
  const { register, control } = useFormContext<ResumeData>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "activities",
  });

  const addActivity = () => {
    append({
      id: Date.now().toString(),
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    move(oldIndex, newIndex);
  };

  const renderActivityItem = (
    field: any,
    index: number,
    isDragging?: boolean
  ) => (
    <Card key={field.id} className={isDragging ? "shadow-lg" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Hoạt động {index + 1}</CardTitle>
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
            <Label htmlFor={`activityTitle-${index}`}>Tên hoạt động *</Label>
            <Input
              id={`activityTitle-${index}`}
              {...register(`activities.${index}.title`, { required: true })}
              placeholder="Tình nguyện viên, Chủ tịch CLB..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`organization-${index}`}>Tổ chức *</Label>
            <Input
              id={`organization-${index}`}
              {...register(`activities.${index}.organization`, {
                required: true,
              })}
              placeholder="Tên tổ chức, câu lạc bộ..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`activityStartDate-${index}`}>Ngày bắt đầu *</Label>
            <Input
              id={`activityStartDate-${index}`}
              type="month"
              {...register(`activities.${index}.startDate`, { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`activityEndDate-${index}`}>Ngày kết thúc</Label>
            <Input
              id={`activityEndDate-${index}`}
              type="month"
              {...register(`activities.${index}.endDate`)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`activityDescription-${index}`}>Mô tả</Label>
          <Textarea
            id={`activityDescription-${index}`}
            {...register(`activities.${index}.description`)}
            placeholder="Mô tả chi tiết về hoạt động và vai trò của bạn..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Hoạt động</h3>
        </div>
        <Button onClick={addActivity} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm hoạt động
        </Button>
      </div>

      {fields.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Chưa có hoạt động nào. Hãy thêm các hoạt động ngoại khóa của
                bạn!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {fields.length > 0 && (
        <div>
          <div className="mb-4 p-3 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20">
            <p className="text-sm text-muted-foreground text-center">
              💡 Kéo và thả để sắp xếp lại thứ tự hoạt động
            </p>
          </div>
          <DragDropList
            items={fields}
            onReorder={handleReorder}
            renderItem={renderActivityItem}
            keyExtractor={(field) => field.id}
          />
        </div>
      )}
    </div>
  );
}
