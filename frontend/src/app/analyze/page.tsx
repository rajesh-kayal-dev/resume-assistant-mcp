"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, Link as LinkIcon, Loader2, FileText, CheckCircle2, AlertCircle, Network, Download, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

export default function AnalyzePage() {
  const { currentAnalysis, setCurrentAnalysis, saveToHistory, isLoading, setLoading } = useAppStore();
  
  const [file, setFile] = useState<File | null>(null);
  const [jobUrl, setJobUrl] = useState("");
  const [linkedinText, setLinkedinText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles, fileRejections) => {
      setError(null);
      if (fileRejections.length > 0) {
        setError("Invalid file. Please upload a PDF or DOCX under 5MB.");
        return;
      }
      setFile(acceptedFiles[0]);
    }
  });

  const handleAnalyze = async () => {
    setError(null);
    if (!file) {
      setError("Please upload your resume.");
      return;
    }
    if (!jobUrl) {
      setError("Please provide a Job URL.");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload & Parse Resume
      const formData = new FormData();
      formData.append("file", file);
      
      const parseRes = await fetch("/api/upload-and-parse", { method: "POST", body: formData });
      const parseData = await parseRes.json();
      if (!parseRes.ok || parseData.error) throw new Error(parseData.error || "Failed to parse resume");
      
      const resumeText = parseData.parsed_text;
      if (!resumeText || resumeText.trim().length === 0) {
        throw new Error("Extracted resume text is empty. Please try a different file.");
      }

      // 2. Fetch Job Description
      const jobRes = await fetch("/api/fetch-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jobUrl })
      });
      const jobData = await jobRes.json();
      if (!jobRes.ok || jobData.error) throw new Error(jobData.error || "Failed to fetch job description");
      
      const jobText = jobData.job_text;
      if (!jobText || jobText.trim().length === 0) {
        throw new Error("Fetched job description is empty. Check the URL.");
      }

      // 3. Deep Analysis
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobText, linkedinText })
      });
      const analysisData = await analyzeRes.json();
      if (!analyzeRes.ok || analysisData.error) throw new Error(analysisData.error || "Analysis failed");

      // Store in global state & history
      setCurrentAnalysis(resumeText, jobText, linkedinText, analysisData);
      saveToHistory(file.name, "Target Role"); // In a real app, extract job title from text

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const exportPdf = () => {
    if (!currentAnalysis.data) return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Resume Analysis Report", 20, 20);
    
    doc.setFontSize(14);
    doc.text(`ATS Score: ${currentAnalysis.data.atsScore}%`, 20, 40);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    let y = 60;
    doc.text("Missing Keywords:", 20, y);
    y += 10;
    currentAnalysis.data.missingKeywords?.slice(0, 10).forEach(kw => {
      doc.text(`- ${kw}`, 25, y);
      y += 7;
    });

    y += 10;
    if (y > 270) { doc.addPage(); y = 20; }
    
    doc.setFont("helvetica", "bold");
    doc.text("Key Improvements:", 20, y);
    doc.setFont("helvetica", "normal");
    y += 10;
    currentAnalysis.data.resumeImprovements?.slice(0, 5).forEach(imp => {
      const splitText = doc.splitTextToSize(`- ${imp}`, 170);
      doc.text(splitText, 25, y);
      y += 7 * splitText.length;
      if (y > 270) { doc.addPage(); y = 20; }
    });

    doc.save("resume-analysis-report.pdf");
  };

  const hasData = !!currentAnalysis.data;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Analyzer</h1>
        <p className="text-muted-foreground">Upload your resume and a target job to get deep AI insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Setup Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-2">
                <Label>1. Upload Resume</Label>
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    isDragActive ? "border-primary bg-primary/10" : "border-white/20 hover:border-white/40 hover:bg-white/5"
                  }`}
                >
                  <input {...getInputProps()} />
                  {file ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8 text-primary" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-muted-foreground">Click or drag to replace</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <UploadCloud className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Drag & drop PDF/DOCX here, or click to select</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>2. Target Job URL</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="https://linkedin.com/jobs/..." 
                    className="pl-9 bg-white/5 border-white/10"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Accordion className="w-full">
                  <AccordionItem value="linkedin" className="border-white/10">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                      <span className="flex items-center gap-2">
                        <Network className="w-4 h-4" />
                        3. LinkedIn Profile (Optional)
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Textarea 
                        placeholder="Paste your LinkedIn profile text here..."
                        className="min-h-[100px] bg-white/5 border-white/10 text-sm"
                        value={linkedinText}
                        onChange={(e) => setLinkedinText(e.target.value)}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleAnalyze} 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Run Deep Analysis
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Validation Failed</AlertTitle>
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2">
          {!hasData && !isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border border-white/10 border-dashed rounded-xl glass text-muted-foreground min-h-[500px]">
              <Sparkles className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-foreground">Awaiting Input</h3>
              <p className="text-sm max-w-sm mt-2">Upload your resume and a job description to unlock ATS scoring, interview prep, and tailored feedback.</p>
            </div>
          ) : isLoading ? (
            <div className="h-full flex flex-col items-center justify-center p-12 border border-white/10 rounded-xl glass min-h-[500px]">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <h3 className="text-lg font-medium">Running MCP Toolchain</h3>
              <div className="w-64 mt-4 space-y-2">
                <Progress value={undefined} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">Parsing texts, comparing keywords, generating models...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Analysis Results</h2>
                <Button variant="outline" size="sm" onClick={exportPdf} className="border-white/10 bg-white/5 hover:bg-white/10">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
              
              <Tabs defaultValue="ats" className="w-full">
                <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-4 bg-white/5 border border-white/10 h-auto p-1 gap-1">
                  <TabsTrigger value="ats" className="text-xs py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">ATS</TabsTrigger>
                  <TabsTrigger value="improvements" className="text-xs py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Resume</TabsTrigger>
                  <TabsTrigger value="interview" className="text-xs py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Interview</TabsTrigger>
                  <TabsTrigger value="skills" className="text-xs py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Skills</TabsTrigger>
                  <TabsTrigger value="cover" className="text-xs py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Cover</TabsTrigger>
                  <TabsTrigger value="linkedin" disabled={!currentAnalysis.data?.linkedinSuggestions} className="text-xs py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">LinkedIn</TabsTrigger>
                </TabsList>
                
                {/* ATS Tab */}
                <TabsContent value="ats" className="space-y-6">
                  <Card className="glass border-white/10">
                    <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
                      <div className="relative flex items-center justify-center mb-6">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                          <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" 
                            strokeDasharray={377} strokeDashoffset={377 - (377 * (currentAnalysis.data?.atsScore || 0)) / 100}
                            className={`${(currentAnalysis.data?.atsScore || 0) > 75 ? 'text-green-500' : 'text-primary'} transition-all duration-1000 ease-out`} />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold">{currentAnalysis.data?.atsScore}%</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-medium">ATS Match Score</h3>
                      <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
                        Based on keyword overlap and semantic similarity to the job description.
                      </p>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="glass border-white/10">
                      <CardHeader className="pb-2"><CardTitle className="text-sm text-green-500">Matched Keywords</CardTitle></CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {currentAnalysis.data?.matchedKeywords?.map(kw => (
                            <span key={kw} className="px-2 py-1 text-xs rounded-md bg-green-500/10 border border-green-500/20 text-green-400">{kw}</span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="glass border-white/10">
                      <CardHeader className="pb-2"><CardTitle className="text-sm text-destructive">Missing Keywords</CardTitle></CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {currentAnalysis.data?.missingKeywords?.slice(0, 15).map(kw => (
                            <span key={kw} className="px-2 py-1 text-xs rounded-md bg-destructive/10 border border-destructive/20 text-destructive-foreground">{kw}</span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Improvements Tab */}
                <TabsContent value="improvements">
                  <Card className="glass border-white/10">
                    <CardHeader>
                      <CardTitle>Resume Improvements</CardTitle>
                      <CardDescription>Actionable feedback to strengthen your profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-center px-4 border-r border-white/10">
                          <div className="text-2xl font-bold">{currentAnalysis.data?.resumeMetrics?.word_count}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">Words</div>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            {currentAnalysis.data?.resumeMetrics?.has_contact_info ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-destructive" />}
                            Contact Info
                          </div>
                          <div className="flex items-center gap-2">
                            {currentAnalysis.data?.resumeMetrics?.has_quantifiable_metrics ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-destructive" />}
                            Metrics Found
                          </div>
                        </div>
                      </div>

                      <ul className="space-y-3 mt-4">
                        {currentAnalysis.data?.resumeImprovements?.map((tip, i) => (
                          <li key={i} className="flex gap-3 text-sm p-3 rounded-md bg-white/5 border border-white/10">
                            <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Interview Tab */}
                <TabsContent value="interview" className="space-y-6">
                  <Card className="glass border-white/10">
                    <CardHeader>
                      <CardTitle>Technical Questions</CardTitle>
                      <CardDescription>Based on matched and missing skills.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {currentAnalysis.data?.technicalQuestions?.map((q, i) => (
                          <li key={i} className="text-sm p-4 rounded-lg bg-primary/5 border border-primary/20 text-primary-foreground/90">
                            {q}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="glass border-white/10">
                    <CardHeader>
                      <CardTitle>HR & Behavioral</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {currentAnalysis.data?.hrQuestions?.map((q, i) => (
                          <li key={i} className="text-sm p-4 rounded-lg bg-white/5 border border-white/10 text-muted-foreground">
                            {q}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Skills Tab */}
                <TabsContent value="skills">
                  <Card className="glass border-white/10">
                    <CardHeader>
                      <CardTitle>Learning Roadmap</CardTitle>
                      <CardDescription>Suggested path to close the skill gap.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                        {currentAnalysis.data?.learningRoadmap?.map((step, i) => (
                          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                              <span className="text-primary font-bold text-sm">{i + 1}</span>
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl glass border-white/10 shadow-sm">
                              <p className="text-sm text-muted-foreground">{step}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Cover Letter Tab */}
                <TabsContent value="cover">
                  <Card className="glass border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Cover Letter Template</CardTitle>
                        <CardDescription>Drafted using your matched skills.</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="bg-white/5 border-white/10" onClick={() => navigator.clipboard.writeText(currentAnalysis.data?.coverLetterTemplate || "")}>
                        Copy Text
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="p-6 bg-white/5 border border-white/10 rounded-lg text-sm whitespace-pre-wrap text-muted-foreground font-mono leading-relaxed">
                        {currentAnalysis.data?.coverLetterTemplate}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* LinkedIn Tab */}
                <TabsContent value="linkedin">
                  <Card className="glass border-white/10">
                    <CardHeader>
                      <CardTitle>LinkedIn Optimization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-3 text-primary">Headline Suggestions</h4>
                        <ul className="space-y-2">
                          {currentAnalysis.data?.linkedinSuggestions?.headline_suggestions.map((s, i) => (
                            <li key={i} className="text-sm p-3 bg-white/5 rounded-md border border-white/10">{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-3 text-primary">Summary Advice</h4>
                        <ul className="space-y-2">
                          {currentAnalysis.data?.linkedinSuggestions?.summary_suggestions.map((s, i) => (
                            <li key={i} className="text-sm p-3 bg-white/5 rounded-md border border-white/10">{s}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
