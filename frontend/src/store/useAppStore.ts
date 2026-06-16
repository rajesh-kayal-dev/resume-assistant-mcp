import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AnalysisData {
  atsScore?: number;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  jobRole?: string;
  salary?: string;
  experienceRequired?: string;
  recommendation?: string;
  suitabilityAssessment?: string;
  resumeImprovements?: string[];
  resumeMetrics?: {
    word_count: number;
    has_contact_info: boolean;
    has_quantifiable_metrics: boolean;
  };
  technicalQuestions?: string[];
  hrQuestions?: string[];
  missingSkills?: string[];
  learningRoadmap?: string[];
  coverLetterTemplate?: string;
  linkedinSuggestions?: {
    headline_suggestions: string[];
    summary_suggestions: string[];
    general_tips: string[];
  };
  companyData?: {
    company_name: string;
    website_domain: string;
    industry: string;
    location: string;
    company_size: string;
    founded_year: string;
    about: string;
  };
}

export interface HistoryEntry {
  id: string;
  createdAt: string;
  resumeName: string;
  jobTitle: string;
  atsScore: number;
  analysisData: AnalysisData;
}

export interface AnalysisOptions {
  resumeImprovements: boolean;
  interviewQuestions: boolean;
  skillGap: boolean;
  coverLetter: boolean;
  linkedinOptimization: boolean;
  companyAnalysis: boolean;
}

export interface AppState {
  jobUrl: string;
  setJobUrl: (url: string) => void;
  linkedinText: string;
  setLinkedinText: (text: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  analysisOptions: AnalysisOptions;
  setAnalysisOptions: (options: Partial<AnalysisOptions>) => void;
  isAnalyzing: boolean;
  error: string | null;
  progress: string;
  results: AnalysisData | null;
  analyze: () => Promise<void>;
  
  currentAnalysis: {
    resumeText: string | null;
    jobText: string | null;
    linkedinText: string | null;
    data: AnalysisData | null;
  };
  history: HistoryEntry[];
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  setCurrentAnalysis: (resumeText: string, jobText: string, linkedinText: string | null, data: AnalysisData) => void;
  saveToHistory: (resumeName: string, jobTitle: string) => void;
  loadFromHistory: (id: string) => void;
  deleteFromHistory: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      jobUrl: "",
      setJobUrl: (url) => set({ jobUrl: url }),
      linkedinText: "",
      setLinkedinText: (text) => set({ linkedinText: text }),
      file: null,
      setFile: (file) => set({ file }),
      analysisOptions: {
        resumeImprovements: true,
        interviewQuestions: true,
        skillGap: true,
        coverLetter: true,
        linkedinOptimization: true,
        companyAnalysis: true,
      },
      setAnalysisOptions: (options) => set((state) => ({ analysisOptions: { ...state.analysisOptions, ...options } })),
      isAnalyzing: false,
      error: null,
      progress: "",
      results: null,
      
      analyze: async () => {
        const { file, jobUrl, linkedinText, analysisOptions } = get();
        if (!file || !jobUrl) return;
        
        set({ isAnalyzing: true, error: null, progress: "Parsing resume..." });
        try {
          const formData = new FormData();
          formData.append("file", file);
          
          const uploadRes = await fetch("/api/upload-and-parse", {
            method: "POST",
            body: formData,
          });
          if (!uploadRes.ok) throw new Error((await uploadRes.json()).error || "Failed to parse resume");
          const uploadData = await uploadRes.json();
          const resumeText = uploadData.parsed_text;

          set({ progress: "Fetching job details..." });
          const jobRes = await fetch("/api/fetch-job", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: jobUrl }),
          });
          if (!jobRes.ok) throw new Error((await jobRes.json()).error || "Failed to fetch job");
          const jobData = await jobRes.json();
          const jobText = jobData.job_text;

          set({ progress: "Running deep analysis..." });
          const analyzeRes = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resumeText, jobText, linkedinText, analysisOptions }),
          });
          if (!analyzeRes.ok) throw new Error((await analyzeRes.json()).error || "Analysis failed");
          const analyzeData = await analyzeRes.json();

          set({ results: analyzeData, progress: "Complete!" });
          get().setCurrentAnalysis(resumeText, jobText, linkedinText, analyzeData);
          get().saveToHistory(file.name, "Analyzed Job");
        } catch (error: any) {
          set({ error: error.message || "An unexpected error occurred" });
        } finally {
          set({ isAnalyzing: false });
        }
      },

      currentAnalysis: {
        resumeText: null,
        jobText: null,
        linkedinText: null,
        data: null,
      },
      history: [],
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      setCurrentAnalysis: (resumeText, jobText, linkedinText, data) => 
        set({
          currentAnalysis: {
            resumeText,
            jobText,
            linkedinText,
            data,
          },
        }),
      saveToHistory: (resumeName, jobTitle) => {
        const { currentAnalysis, history } = get();
        if (!currentAnalysis.data) return;

        const newEntry: HistoryEntry = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          resumeName,
          jobTitle,
          atsScore: currentAnalysis.data.atsScore || 0,
          analysisData: currentAnalysis.data,
        };

        set({ history: [newEntry, ...history] });
      },
      loadFromHistory: (id) => {
        const entry = get().history.find((h) => h.id === id);
        if (entry) {
          set({
            currentAnalysis: {
              resumeText: null,
              jobText: null,
              linkedinText: null,
              data: entry.analysisData,
            },
            results: entry.analysisData
          });
        }
      },
      deleteFromHistory: (id) => {
        set({ history: get().history.filter((h) => h.id !== id) });
      },
    }),
    {
      name: "resume-assistant-storage",
      partialize: (state) => ({ history: state.history }), // Only persist history, not file objects
    }
  )
);
