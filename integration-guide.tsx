"use client"

// Cách sử dụng Resume Builder trong dự án khác

import ResumeBuilder from "./components/resume-builder"
import { useState } from "react"

// 1. Trong page component của bạn:
export function ResumePage() {
  return (
    <div>
      <h1>Tạo CV của bạn</h1>
      <ResumeBuilder />
    </div>
  )
}

// 2. Hoặc như một modal/popup:
export default function MyApp() {
  const [showResumeBuilder, setShowResumeBuilder] = useState(false)

  return (
    <div>
      <button onClick={() => setShowResumeBuilder(true)}>Tạo CV</button>

      {showResumeBuilder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90vw",
              height: "90vh",
              backgroundColor: "white",
              borderRadius: "8px",
              overflow: "auto",
            }}
          >
            <button
              onClick={() => setShowResumeBuilder(false)}
              style={{ position: "absolute", top: "10px", right: "10px" }}
            >
              ✕
            </button>
            <ResumeBuilder />
          </div>
        </div>
      )}
    </div>
  )
}
