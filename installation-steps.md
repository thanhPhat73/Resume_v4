# Hướng dẫn cài đặt Resume Builder

## Bước 1: Copy files
1. Copy thư mục `components/` (resume-builder và các components liên quan)
2. Copy `types/resume.ts`
3. Copy `lib/resume-storage.ts` và `lib/pdf-generator.ts`
4. Copy các file ảnh template từ `public/`

## Bước 2: Cài đặt dependencies
\`\`\`bash
npm install jspdf html2canvas lucide-react
npm install -D @types/jspdf
\`\`\`

## Bước 3: Import và sử dụng
\`\`\`tsx
import ResumeBuilder from './components/resume-builder'

function MyPage() {
  return <ResumeBuilder />
}
\`\`\`

## Lưu ý quan trọng:
- Tất cả CSS đã được tách riêng thành CSS modules
- Không cần lo lắng về xung đột CSS với dự án hiện tại
- Component hoàn toàn độc lập, không phụ thuộc vào global styles
- Có thể tùy chỉnh theme bằng cách chỉnh sửa CSS variables trong module CSS
