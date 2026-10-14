export type UserRole = 'admin' | 'client';

export type ProjectPhase = 
  | 'Inquiry'
  | 'Agreement'
  | 'Design'
  | 'Client Review'
  | 'Final Approval'
  | 'Payment'
  | 'Launch'
  | 'Completed';

export type ProspectStatus = 
  | 'Prospect'
  | 'Demo in Progress'
  | 'Demo Sent'
  | 'Follow-Up'
  | 'Accepted / Onboarding'
  | 'Active Client'
  | 'Lost / Declined'
  | 'Completed';

export type PortalAccessStatus = 
  | 'Not Invited'
  | 'Invitation Pending'
  | 'Active'
  | 'Revoked';

export interface Client {
  id: string;
  businessName: string;
  primaryContact: string;
  email: string;
  phone: string;
  status: ProspectStatus;
  portalAccessStatus: PortalAccessStatus;
  proposedValue?: number;
  followUpDate?: string;
  dateCreated: string;
  notes?: string;
  avatarUrl?: string;
  aiStudioPublishedUrl?: string;
  aiStudioEditorUrl?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  category?: 'Design' | 'Content' | 'Development' | 'SEO' | 'Review';
}

export interface RevisionConfig {
  includedRounds: number;
  currentRound: number;
  maxTasksPerRound: number;
  agreementNote?: string;
  postLaunchSupportDays?: number;
}

// DOMAIN & LAUNCH WORKFLOW TYPES
export type DomainRegistrar = 'GoDaddy' | 'Hostinger' | 'Squarespace' | 'Cloudflare' | 'Namecheap' | 'Google Domains / Porkbun' | 'Other / Not Sure';
export type ConnectionMethod = 'DNS Update (A/CNAME)' | 'Nameserver Change' | 'Domain Transfer' | 'Not Applicable';
export type DnsSetupStatus = 'Not Started' | 'Initiated' | 'Client Completed' | 'Verified' | 'Issue / Attention Needed' | 'Not Applicable';
export type TechnicalVerificationStatus = 'Pending' | 'Propagating' | 'Verified Live' | 'Failed Check' | 'Not Applicable';
export type SslStatus = 'Pending' | 'Provisioning' | 'Active & Secure';

export interface DnsRecordInstruction {
  id: string;
  recordType: 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX';
  hostName: string; // e.g. '@', 'www'
  requiredValue: string; // e.g. '216.239.32.21', 'ghs.googlehosted.com'
  ttl?: string;
  action: 'Add' | 'Edit' | 'Remove';
  explanation: string;
  warningNote?: string;
}

export interface LaunchChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  notes?: string;
}

export interface ProjectDomainConfig {
  initiated: boolean;
  domainName: string;
  registrar: DomainRegistrar;
  dnsProvider: string; // e.g. "Same as GoDaddy" or "Cloudflare DNS"
  hostingProvider: string; // e.g. "Google AI Studio / Cloud Run"
  isNewDomain: boolean;
  retainRegistrar: boolean;
  connectionMethod: ConnectionMethod;
  dnsSetupStatus: DnsSetupStatus;
  technicalVerificationStatus: TechnicalVerificationStatus;
  sslStatus: SslStatus;
  clientCompletedAt?: string;
  verifiedAt?: string;
  targetLaunchDate?: string;
  isNotApplicable?: boolean; // For projects with no custom domain needed
  instructions: DnsRecordInstruction[];
  checklist: LaunchChecklistItem[];
  clientHelpRequest?: {
    message: string;
    requestedAt: string;
    screenshotUrl?: string;
    resolved: boolean;
  };
}

export interface Project {
  id: string;
  projectName: string;
  clientId: string;
  description: string;
  phase: ProjectPhase;
  relationshipStage: ProspectStatus;
  portalAccessStatus: PortalAccessStatus;
  startDate: string;
  targetCompletionDate: string;
  websitePreviewUrl: string; // Public viewable URL
  aiStudioPublishedUrl?: string; // Public viewable AI Studio URL
  aiStudioEditorUrl?: string; // Admin-only private editing workspace URL
  previewType: 'custom_demo' | 'iframe';
  internalNotes: string;
  assignedTasks: TaskItem[];
  revisionConfig: RevisionConfig;
  domainConfig?: ProjectDomainConfig; // DOMAIN & LAUNCH EXPERIENCE
  proposedValue?: number;
  lastApprovedAt?: string;
  createdAt: string;
}

export type RevisionStatus = 
  | 'Submitted'
  | 'Under Review'
  | 'In Progress'
  | 'Ready for Client Review'
  | 'Approved'
  | 'Needs Clarification';

export interface RevisionComment {
  id: string;
  author: 'admin' | 'client';
  authorName: string;
  message: string;
  timestamp: string;
}

export interface PinCoordinates {
  x: number; // Percentage relative to preview width (0 - 100)
  y: number; // Percentage relative to preview height (0 - 100)
  viewportMode?: 'desktop' | 'mobile';
}

export interface RevisionTask {
  id: string;
  projectId: string;
  webpage: string;
  section: string;
  instructions: string;
  attachmentUrl?: string;
  attachedFileIds?: string[];
  screenshotUrl?: string;
  pinCoordinates?: PinCoordinates;
  additionalNotes?: string;
  status: RevisionStatus;
  roundNumber: number;
  submissionDate: string;
  targetCompletionDate?: string;
  adminResponse?: string;
  comments: RevisionComment[];
}

export type FileCategory = 
  | 'Client Photography'
  | 'Branding & Logos'
  | 'Inspiration & References'
  | 'Documents'
  | 'Other Files';

export interface ProjectFolder {
  id: string;
  projectId: string;
  name: string;
  category: FileCategory;
  createdAt: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  folderId?: string; // Optional assignment to a ProjectFolder
  name: string;
  category: FileCategory;
  uploadDate: string;
  uploadedBy: '1UpSites Admin' | 'Client';
  size: string;
  type: string;
  previewUrl: string;
  isTemporary?: boolean;
}

export type AgreementStatus = 'Draft' | 'Sent' | 'Signed';

export interface Agreement {
  id: string;
  projectId: string;
  title: string;
  documentType: 'Master Services Agreement (MSA)' | 'Statement of Work (SOW)' | 'Design Approval & Handover';
  status: AgreementStatus;
  amount: number;
  sentDate: string;
  signedDate?: string;
  summary: string;
  terms: string[];
}

export interface InvoiceLineItem {
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
}

export type InvoiceStatus = 'Paid' | 'Outstanding' | 'Overdue' | 'Draft';

export interface Invoice {
  id: string;
  projectId: string;
  invoiceNumber: string;
  title: string;
  amount: number;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  lineItems: InvoiceLineItem[];
}

export interface ActivityLog {
  id: string;
  projectId: string;
  type: 'revision' | 'file' | 'status_change' | 'approval' | 'agreement' | 'invoice' | 'note' | 'prospect' | 'portal_access' | 'domain_launch';
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  actorRole: 'Admin' | 'Client';
}
