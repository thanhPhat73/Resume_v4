"use client";
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Save,
  Palette,
  FileText,
  Download,
  Menu,
  Eye,
} from "lucide-react";
import { PersonalInfoStep } from "./steps/personal-info-step";
import { ExperienceStep } from "./steps/experience-step";
import { EducationStep } from "./steps/education-step";
import { SkillsStep } from "./steps/skills-step";
import { ActivitiesStep } from "./steps/activities-step";
import { AwardsStep } from "./steps/awards-step";
import { ResumePreview } from "./resume-preview";
import { TemplateSelector } from "./template-selector";
import {
  CustomizationPanel,
  type CustomizationOptions,
} from "./customization-panel";
import { PDFExport } from "./pdf-export";
import { useToast } from "@/hooks/use-toast";
import styles from "./resume-builder.module.css";

export interface ResumeData {
  id: number;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    jobTitle: string; // Changed from address to jobTitle
    summary: string;
    profileImage?: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: Array<string>; // Simplified to array of strings, removed level and category
  activities: Array<{
    id: string;
    title: string;
    organization: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  awards: Array<{
    id: string;
    title: string;
    issuer: string;
    date: string;
    description: string;
  }>;
}

const steps = [
  {
    id: "personal",
    title: "Thông tin cá nhân",
    component: PersonalInfoStep,
    fields: ["personalInfo"],
  },
  {
    id: "experience",
    title: "Kinh nghiệm làm việc",
    component: ExperienceStep,
    fields: ["experience"],
  },
  {
    id: "education",
    title: "Học vấn",
    component: EducationStep,
    fields: ["education"],
  },
  { id: "skills", title: "Kỹ năng", component: SkillsStep, fields: ["skills"] },
  {
    id: "activities",
    title: "Hoạt động",
    component: ActivitiesStep,
    fields: ["activities"],
  },
  {
    id: "awards",
    title: "Giải thưởng",
    component: AwardsStep,
    fields: ["awards"],
  },
];

interface ResumeBuilderProps {
  onBack?: () => void; // Callback để quay lại danh sách CV
  onSave?: (resumeData: ResumeData) => void; // Callback để lưu CV và chuyển về danh sách
  initialData?: ResumeData; // Dữ liệu khởi tạo cho resume
}
export function ResumeBuilder({ onBack, onSave }: ResumeBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    font: "inter",
    colorScheme: "blue",
    spacing: "normal",
    fontSize: "medium",
  });
  const { toast } = useToast();

  const methods = useForm<ResumeData>({
    mode: "onChange",
    defaultValues: {
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        jobTitle: "", // Changed from address to jobTitle
        summary: "",
      },
      experience: [],
      education: [],
      skills: [], // Changed to simple array
      activities: [],
      awards: [],
    },
  });

  const {
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = methods;

  const autoSave = async () => {
    if (!mounted) return;

    setIsAutoSaving(true);
    setTimeout(() => {
      localStorage.setItem("resume-draft", JSON.stringify(watch()));
      setIsAutoSaving(false);
    }, 1000);
  };

  useEffect(() => {
    const timeoutId = setTimeout(autoSave, 2000);
    return () => clearTimeout(timeoutId);
  }, [watch, mounted]);

  useEffect(() => {
    setMounted(true);

    const savedDraft = localStorage.getItem("resume-draft");
    if (savedDraft) {
      try {
        const parsedData = JSON.parse(savedDraft);
        methods.reset(parsedData);
        toast({
          title: "Đã khôi phục bản nháp",
          description: "Dữ liệu đã lưu trước đó đã được khôi phục.",
        });
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, [methods, toast]);

  if (!mounted) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingContent}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  const validateCurrentStep = async () => {
    const currentStepFields = steps[currentStep].fields;
    const isValid = await trigger(currentStepFields as any);

    if (isValid && !completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (!isValid) {
      toast({
        title: "Vui lòng kiểm tra lại thông tin",
        description: "Có một số trường bắt buộc chưa được điền.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = async (stepIndex: number) => {
    if (stepIndex < currentStep || completedSteps.includes(stepIndex)) {
      setCurrentStep(stepIndex);
    } else {
      const isValid = await validateCurrentStep();
      if (isValid) {
        setCurrentStep(stepIndex);
      }
    }
  };

  const onSubmit = (data: ResumeData) => {
    console.log("Resume data:", data);
    setShowPreview(true);
  };

  const stepHasErrors = (stepIndex: number) => {
    const stepFields = steps[stepIndex].fields;
    return stepFields.some((field) => errors[field as keyof typeof errors]);
  };

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  if (showPreview) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Button
            variant="outline"
            onClick={onBack ? onBack : () => setShowPreview(false)}
            className={styles.actionButton}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className={styles.hiddenOnMobile}>
              {onBack ? "Quay lại danh sách" : "Quay lại chỉnh sửa"}
            </span>
            <span className={styles.hiddenOnDesktop}>Quay lại</span>
          </Button>
        </div>
        <div className={`${styles.mainGrid} ${styles.previewGrid}`}>
          <div className={styles.previewSidebarXl}>
            <PDFExport
              data={methods.getValues()}
              template={selectedTemplate}
              customization={customization}
              onSave={onSave} // Pass callback to handle save and navigation
              resumeData={methods.getValues()} // Pass resume data
            />
          </div>
          <div className={styles.previewMainXl}>
            <ResumePreview
              data={methods.getValues()}
              template={selectedTemplate}
              customization={customization}
              onSave={onSave}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Tạo Resume</h1>
          <div className={styles.subtitle}>
            <p className={`${styles.subtitleText} ${styles.hiddenOnMobile}`}>
              Tạo resume chuyên nghiệp trong vài phút
            </p>
            {isAutoSaving && (
              <div className={styles.autoSaveIndicator}>
                <Save className="h-3 w-3 animate-spin" />
                <span className={styles.hiddenOnMobile}>Đang lưu...</span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.headerActions}>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`${styles.actionButton} ${styles.hiddenOnDesktop}`}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <MobileSidebar
                  currentStep={currentStep}
                  completedSteps={completedSteps}
                  stepHasErrors={stepHasErrors}
                  goToStep={goToStep}
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={setSelectedTemplate}
                  customization={customization}
                  setCustomization={setCustomization}
                  resumeData={watch()}
                  onMenuClose={() => setMobileMenuOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.sidebar}>
          <DesktopSidebar
            currentStep={currentStep}
            completedSteps={completedSteps}
            stepHasErrors={stepHasErrors}
            goToStep={goToStep}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            customization={customization}
            setCustomization={setCustomization}
            resumeData={watch()}
          />
        </div>

        <div className={styles.mainContent}>
          <Card>
            <CardHeader className={styles.cardHeader}>
              <div className={styles.cardHeaderContent}>
                <div className={styles.cardTitleContainer}>
                  <CardTitle className={styles.cardTitle}>
                    {steps[currentStep].title}
                  </CardTitle>
                  {completedSteps.includes(currentStep) && (
                    <Badge className={styles.completedBadge}>
                      <Check className="h-3 w-3 mr-1" />
                      <span className={styles.hiddenOnMobile}>Hoàn thành</span>
                    </Badge>
                  )}
                </div>
                <span className={styles.stepCounter}>
                  {currentStep + 1} / {steps.length}
                </span>
              </div>
              <Progress value={progress} className={styles.progress} />
            </CardHeader>
            <CardContent className={styles.formContainer}>
              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 lg-space-y-6"
                >
                  <CurrentStepComponent />

                  <div className={styles.formActions}>
                    <Button
                      type="button"
                      variant="outline"
                      // onClick={prevStep}
                      onClick={onBack ? onBack : () => setShowPreview(false)}
                      disabled={currentStep === 0}
                      className={`${styles.actionButton} ${styles.secondaryButton}`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Quay lại
                    </Button>

                    {currentStep === steps.length - 1 ? (
                      <Button
                        type="submit"
                        className={`${styles.actionButton} ${styles.primaryButton}`}
                      >
                        <span className={styles.hiddenOnMobile}>
                          Xem trước Resume
                        </span>
                        <span className={styles.hiddenOnDesktop}>
                          Xem trước
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className={`${styles.actionButton} ${styles.primaryButton}`}
                      >
                        Tiếp theo
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </div>

        <div className={styles.previewSidebar}>
          <Card className={styles.previewCard}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Xem trước
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <div className={styles.previewContainer}>
                <div className={styles.previewContent}>
                  <ResumePreview
                    data={watch()}
                    template={selectedTemplate}
                    customization={customization}
                    isCompact
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowPreview(true)}
                className="w-full mt-4 text-sm"
              >
                Xem toàn màn hình
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className={styles.floatingPreview}>
        <Button
          onClick={() => setShowPreview(true)}
          className={styles.floatingButton}
        >
          <Eye className="h-4 w-4" />
          <span className={styles.hiddenOnMobile}>Xem trước</span>
        </Button>
      </div>
    </div>
  );
}

function DesktopSidebar({
  currentStep,
  completedSteps,
  stepHasErrors,
  goToStep,
  selectedTemplate,
  setSelectedTemplate,
  customization,
  setCustomization,
  resumeData,
}: any) {
  return (
    <Tabs defaultValue="steps" className="w-full">
      <TabsList className={styles.tabsList}>
        <TabsTrigger value="steps" className={styles.tabsTrigger}>
          <FileText className="h-3 w-3" />
          Bước
        </TabsTrigger>
        <TabsTrigger value="design" className={styles.tabsTrigger}>
          <Palette className="h-3 w-3" />
          Thiết kế
        </TabsTrigger>
        <TabsTrigger value="export" className={styles.tabsTrigger}>
          <Download className="h-3 w-3" />
          Xuất
        </TabsTrigger>
      </TabsList>

      <TabsContent value="steps" className="mt-4">
        <Card className={styles.previewCard}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className="text-base">Các bước</CardTitle>
          </CardHeader>
          <CardContent className={styles.stepsList}>
            {steps.map((step, index) => (
              <StepButton
                key={step.id}
                step={step}
                index={index}
                currentStep={currentStep}
                completedSteps={completedSteps}
                stepHasErrors={stepHasErrors}
                goToStep={goToStep}
              />
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="design" className="mt-4">
        <Card className={`${styles.previewCard} max-h-80vh overflow-y-auto`}>
          <CardContent className={styles.sidebarContent}>
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
            />
            <CustomizationPanel
              options={customization}
              onOptionsChange={setCustomization}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="export" className="mt-4">
        <Card className={styles.previewCard}>
          <CardContent className="p-4">
            <PDFExport
              data={resumeData}
              template={selectedTemplate}
              customization={customization}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function MobileSidebar({
  currentStep,
  completedSteps,
  stepHasErrors,
  goToStep,
  selectedTemplate,
  setSelectedTemplate,
  customization,
  setCustomization,
  resumeData,
  onMenuClose,
}: any) {
  return (
    <Tabs defaultValue="steps" className="w-full">
      <TabsList className={styles.tabsList}>
        <TabsTrigger value="steps">
          <FileText className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="design">
          <Palette className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="export">
          <Download className="h-4 w-4" />
        </TabsTrigger>
      </TabsList>

      <TabsContent value="steps" className="mt-4 space-y-2">
        <h3 className="font-medium text-sm mb-3">Các bước</h3>
        <div className={styles.stepsList}>
          {steps.map((step, index) => (
            <StepButton
              key={step.id}
              step={step}
              index={index}
              currentStep={currentStep}
              completedSteps={completedSteps}
              stepHasErrors={stepHasErrors}
              goToStep={(stepIndex: number) => {
                goToStep(stepIndex);
                onMenuClose();
              }}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="design" className="mt-4 space-y-6">
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
        />
        <CustomizationPanel
          options={customization}
          onOptionsChange={setCustomization}
        />
      </TabsContent>

      <TabsContent value="export" className="mt-4">
        <PDFExport
          data={resumeData}
          template={selectedTemplate}
          customization={customization}
        />
      </TabsContent>
    </Tabs>
  );
}

function StepButton({
  step,
  index,
  currentStep,
  completedSteps,
  stepHasErrors,
  goToStep,
}: any) {
  const isCurrentStep = index === currentStep;
  const isCompleted = completedSteps.includes(index);
  const hasErrors = stepHasErrors(index);

  let buttonClass = styles.stepButton;
  if (isCurrentStep) {
    buttonClass += ` ${styles.stepButtonActive}`;
  } else if (isCompleted) {
    buttonClass += ` ${styles.stepButtonCompleted}`;
  } else if (hasErrors) {
    buttonClass += ` ${styles.stepButtonError}`;
  }

  return (
    <button onClick={() => goToStep(index)} className={buttonClass}>
      <div className={styles.stepButtonContent}>
        <div className={styles.stepButtonText}>
          <div className={styles.stepButtonTitle}>{step.title}</div>
          <div className={styles.stepButtonSubtitle}>Bước {index + 1}</div>
        </div>
        <div className={styles.stepButtonIcon}>
          {isCompleted && <Check className="h-4 w-4 text-green-600" />}
          {hasErrors && <AlertCircle className="h-4 w-4 text-red-600" />}
        </div>
      </div>
    </button>
  );
}

export default ResumeBuilder;
