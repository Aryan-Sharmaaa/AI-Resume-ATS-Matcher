import { useEffect, useRef, useState } from "react";
import { Upload, FileText, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import type { Resume } from "@/lib/mock-data";

interface ResumeUploaderProps {
  onResumeSelect?: (resumeId: string | null) => void;
}

export function ResumeUploader({
  onResumeSelect,
}: ResumeUploaderProps) {
  // Currently uploaded file
  const [file, setFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  // Existing resumes from backend
  const [resumes, setResumes] = useState<Resume[]>([]);

  // UI states
  const [dragOver, setDragOver] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Load resumes from backend
  const loadResumes = async () => {
    try {
      setError(null);

      const data = await api.listResumes();

      console.log("RESUMES FROM BACKEND:", data);

      setResumes(data);
    } catch (err) {
      console.error("Failed to load resumes:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load existing resumes."
      );
    }
  };

  // Load existing resumes when page opens
  useEffect(() => {
    loadResumes();
  }, []);

  // Upload new resume
  const handleFiles = async (files: FileList | null) => {
    const selectedFile = files?.[0];

    if (!selectedFile) {
      return;
    }

    // Only allow PDF
    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please upload a PDF file.");
      return;
    }

    // Maximum file size: 5 MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File must be smaller than 5 MB.");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Upload resume to backend
      const uploadedResume = await api.uploadResume(selectedFile);

      console.log("UPLOADED RESUME:", uploadedResume);

      // Show uploaded file
      setFile({
        name: selectedFile.name,
        size: selectedFile.size,
      });

      // Select newly uploaded resume
      setSelectedId(uploadedResume.id);

      // IMPORTANT:
      // Send resume ID to New Analysis page
      onResumeSelect?.(uploadedResume.id);

      // Refresh list of resumes
      await loadResumes();
    } catch (err) {
      console.error("Resume upload failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload resume."
      );
    } finally {
      setUploading(false);

      // Allow same file to be selected again
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  // Remove uploaded file selection
  const removeUploadedFile = () => {
    setFile(null);
    setSelectedId(null);

    // Tell New Analysis no resume is selected
    onResumeSelect?.(null);
  };

  // Select an existing resume
  const selectExistingResume = (resumeId: string) => {
    setSelectedId(resumeId);

    // Remove uploaded-file display
    setFile(null);

    setError(null);

    // IMPORTANT:
    // Send selected resume ID to New Analysis
    onResumeSelect?.(resumeId);
  };

  return (
    <div className="space-y-4">

      {/* UPLOAD AREA */}

      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => {
            setDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);

            if (!uploading) {
              handleFiles(e.dataTransfer.files);
            }
          }}
          className={cn(
            "flex flex-col items-center justify-center rounded-md border border-dashed bg-card px-6 py-12 text-center transition-colors",
            dragOver
              ? "border-foreground bg-muted/50"
              : "border-border"
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          <p className="mt-3 text-sm font-medium">
            {uploading
              ? "Uploading resume..."
              : "Drop your resume here"}
          </p>

          {!uploading && (
            <>
              <p className="mt-1 text-xs text-muted-foreground">
                or choose a file
              </p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
              >
                Choose PDF
              </Button>
            </>
          )}

          <p className="mt-3 text-[11px] text-muted-foreground">
            PDF only, up to 5 MB
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      ) : (

        /* UPLOADED FILE */

        <div className="flex items-center justify-between rounded-md border bg-card p-3">
          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
              <FileText className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-medium">
                {file.name}
              </p>

              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(0)} KB ·{" "}

                <span className="inline-flex items-center gap-1 text-[var(--color-success)]">
                  <Check className="h-3 w-3" />
                  Uploaded & selected
                </span>
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={removeUploadedFile}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ERROR MESSAGE */}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
          <p className="text-xs text-destructive">
            {error}
          </p>
        </div>
      )}

      {/* EXISTING RESUMES */}

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Or select an existing resume
        </p>

        <div className="space-y-1.5">

          {resumes.length === 0 ? (
            <p className="py-2 text-xs text-muted-foreground">
              No resumes uploaded yet.
            </p>
          ) : (
            resumes.map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => selectExistingResume(r.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50",
                  selectedId === r.id
                    ? "border-foreground bg-muted/50"
                    : "border-border"
                )}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />

                  <span className="truncate">
                    {r.name}
                  </span>
                </div>

                <div className="ml-3 flex items-center gap-2">

                  <span className="text-xs text-muted-foreground">
                    {r.uploadedAt}
                  </span>

                  {selectedId === r.id && (
                    <Check className="h-4 w-4" />
                  )}

                </div>
              </button>
            ))
          )}

        </div>
      </div>

    </div>
  );
}