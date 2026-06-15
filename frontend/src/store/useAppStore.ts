import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AnalysisData {
  atsScore?: number;
  matchedKeywords?: string[];
  missingKeywords?: string[];
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
}

export interface HistoryEntry {
  id: string;
  createdAt: string;
  resumeName: string;
  jobTitle: string;
  atsScore: number;
  analysisData: AnalysisData;
}

interface AppState {
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
          // We don't have the raw texts in history, but we have the analysis data
          // We could store raw texts in history if needed, but for now we just load data.
          set({
            currentAnalysis: {
              resumeText: null,
              jobText: null,
              linkedinText: null,
              data: entry.analysisData,
            },
          });
        }
      },
      deleteFromHistory: (id) => {
        set({ history: get().history.filter((h) => h.id !== id) });
      },
    }),
    {
      name: "resume-assistant-storage",
    }
  )
);
