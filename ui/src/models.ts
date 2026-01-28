export interface DiveResponse {
  layer: DiveLayer[];
  image: DiveImageStats;
}

export interface DiveImageStats {
  sizeBytes: number;
  inefficientBytes: number;
  efficiencyScore: number;
  fileReference: FileReference[];
}

export interface FileReference {
  count: number;
  sizeBytes: number;
  file: string;
}

export interface DiveLayer {
  index: number;
  id: string;
  digestId: string;
  sizeBytes: number;
  command: string;
}

export interface AnalysisResult {
  image: Image;
  dive: DiveResponse;
}

export interface Image {
  name: string;
  id: string;
}

export type AnalysisSource = "docker" | "docker-archive";

export type JobStatus = "queued" | "running" | "succeeded" | "failed";

export interface AnalyzeRequest {
  image?: string;
  source: AnalysisSource;
  archivePath?: string;
}

export interface AnalyzeResponse {
  jobId: string;
  status: JobStatus;
}

export interface AnalysisStatusResponse {
  jobId: string;
  status: JobStatus;
  message?: string;
}

export interface AnalysisErrorResponse {
  status?: JobStatus;
  message: string;
}