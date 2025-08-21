import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const API_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidHlwZSI6ImFjY2Vzc190b2tlbiIsInN1YiI6InRoYW5oUGhhdCIsImlhdCI6MTc1NTcxMTI0MiwiZXhwIjoxNzU1Nzk3NjQyfQ.QrFyUvdjvoeFB9tfU0N_f_sWsIqOoyDSyGGoxpJFIj0";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

export interface ApiResumeData {
  fullName: string;
  email: string;
  phone: string;
  profilePicture?: string;
  summary: string;
  jobTitle: string;
  educations: Array<{
    schoolName: string;
    degree: string;
    major: string;
    startYear: string;
    endYear: string;
    GPA?: string;
  }>;
  awards: Array<{
    awardName: string;
    awardYear: string;
    donViTrao: string;
    description: string;
  }>;
  activities: Array<{
    activityName: string;
    organization: string;
    startYear: string;
    endYear: string;
    description: string;
  }>;
  skillsResumes: string[];
}

export function mapFormToApi(formData: any): ApiResumeData {
  return {
    fullName: formData.personalInfo?.fullName || "",
    email: formData.personalInfo?.email || "",
    phone: formData.personalInfo?.phone || "",
    profilePicture: formData.personalInfo?.profileImage || "",
    summary: formData.personalInfo?.summary || "",
    jobTitle: formData.personalInfo?.jobTitle || "",
    educations: (formData.education || []).map((edu: any) => ({
      schoolName: edu.institution || "",
      degree: edu.degree || "",
      major: edu.field || "",
      startYear: edu.startDate || "",
      endYear: edu.endDate || "",
      GPA: edu.gpa || "",
    })),
    awards: (formData.awards || []).map((award: any) => ({
      awardName: award.title || "",
      awardYear: award.date || "",
      donViTrao: award.issuer || "",
      description: award.description || "",
    })),
    activities: (formData.activities || []).map((activity: any) => ({
      activityName: activity.title || "",
      organization: activity.organization || "",
      startYear: activity.startDate || "",
      endYear: activity.endDate || "",
      description: activity.description || "",
    })),
    skillsResumes: formData.skills || [],
  };
}

export function mapApiToForm(apiData: ApiResumeData): any {
  return {
    personalInfo: {
      fullName: apiData.fullName,
      email: apiData.email,
      phone: apiData.phone,
      profileImage: apiData.profilePicture,
      summary: apiData.summary,
      jobTitle: apiData.jobTitle,
    },
    education: apiData.educations.map((edu) => ({
      institution: edu.schoolName,
      degree: edu.degree,
      field: edu.major,
      startDate: edu.startYear,
      endDate: edu.endYear,
      gpa: edu.GPA,
    })),
    awards: apiData.awards.map((award) => ({
      title: award.awardName,
      date: award.awardYear,
      issuer: award.donViTrao,
      description: award.description,
    })),
    activities: apiData.activities.map((activity) => ({
      title: activity.activityName,
      organization: activity.organization,
      startDate: activity.startYear,
      endDate: activity.endYear,
      description: activity.description,
    })),
    skills: apiData.skillsResumes,
  };
}

export const resumeApi = {
  getMyResume: async (): Promise<ApiResumeData> => {
    const response = await api.get("/api/resumes/me");
    return response.data;
  },

  getResumeById: async (id: number | string): Promise<ApiResumeData> => {
    const response = await api.get(`/api/resumes/${id}`);
    return response.data;
  },

  saveMyResume: async (data: ApiResumeData): Promise<any> => {
    const response = await api.post("/api/resumes/me", data);
    return response.data;
  },

  updateMyResume: async (id: number, data: ApiResumeData): Promise<any> => {
    const response = await api.patch(`/api/resumes/me/${id}`, data);
    return response.data;
  },

  deleteResume: async (id: number | string): Promise<void> => {
    await api.delete(`/api/resumes/${id}`);
  },
};
