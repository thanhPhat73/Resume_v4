import { CVDashboard } from "@/components/cv-dashboard"
import { ResumeBuilder } from "@/components/resume-builder"

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)" }}>
      {/* <ResumeBuilder /> */}
      <CVDashboard />
    </div>
  )
}
