
export enum UploadStatus {
    Ready = 'Ready',
    Requested = 'Requested',
    Started = 'Started',
    Failed = 'Failed',
    Completed = 'Completed'
}

export class Media {
    id?: string;
    ref?: string;
    name: string;
    tags: string[];
    orgId: string;
    url?: string;
    status?: UploadStatus;
    error?: string | null;
    progress?: number | null;
}
