import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, Client, Project, ProjectPhase, ProspectStatus, PortalAccessStatus, RevisionTask, RevisionStatus, 
  ProjectFile, ProjectFolder, Agreement, Invoice, ActivityLog, ProjectDomainConfig, DnsRecordInstruction, LaunchChecklistItem 
} from '../types/portal';
import { 
  INITIAL_CLIENTS, INITIAL_PROJECTS, INITIAL_REVISIONS, 
  INITIAL_FILES, INITIAL_FOLDERS, INITIAL_AGREEMENTS, INITIAL_INVOICES, INITIAL_ACTIVITY_LOGS 
} from '../data/initialData';

export interface NewProspectPayload {
  businessName: string;
  primaryContact?: string;
  email?: string;
  phone?: string;
  projectName: string;
  projectDescription?: string;
  aiStudioPublishedUrl?: string;
  aiStudioEditorUrl?: string;
  proposedValue?: number;
  expectedCloseDate?: string;
  followUpDate?: string;
  relationshipStage?: ProspectStatus;
  notes?: string;
}

interface PortalContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeClientId: string;
  setActiveClientId: (id: string) => void;
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;
  activeClientTab: string;
  setActiveClientTab: (tab: string) => void;
  
  clients: Client[];
  projects: Project[];
  revisions: RevisionTask[];
  files: ProjectFile[];
  folders: ProjectFolder[];
  agreements: Agreement[];
  invoices: Invoice[];
  activityLogs: ActivityLog[];

  // Actions
  addProspectWithProject: (payload: NewProspectPayload) => { clientId: string; projectId: string };
  addClient: (client: Omit<Client, 'id' | 'dateCreated'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  updatePortalAccessStatus: (clientId: string, status: PortalAccessStatus) => void;
  updateProspectStatus: (clientId: string, status: ProspectStatus) => void;
  updateAiStudioUrls: (projectId: string, publishedUrl?: string, editorUrl?: string) => void;
  
  // Domain & Launch Actions
  updateProjectDomainConfig: (projectId: string, updates: Partial<ProjectDomainConfig>) => void;
  addDnsInstruction: (projectId: string, instruction: Omit<DnsRecordInstruction, 'id'>) => void;
  updateDnsInstruction: (projectId: string, instructionId: string, updates: Partial<DnsRecordInstruction>) => void;
  deleteDnsInstruction: (projectId: string, instructionId: string) => void;
  toggleLaunchChecklistItem: (projectId: string, itemId: string, completed?: boolean) => void;
  markClientDnsCompleted: (projectId: string) => void;
  submitClientDomainHelpRequest: (projectId: string, message: string, screenshotUrl?: string) => void;

  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProjectPhase: (projectId: string, newPhase: ProjectPhase) => void;
  updateProjectNotes: (projectId: string, notes: string) => void;
  
  addRevision: (revision: Omit<RevisionTask, 'id' | 'submissionDate' | 'comments'>) => void;
  updateRevisionStatus: (revisionId: string, status: RevisionStatus, responseText?: string) => void;
  addRevisionComment: (revisionId: string, author: 'admin' | 'client', authorName: string, message: string) => void;
  
  addFile: (file: Omit<ProjectFile, 'id' | 'uploadDate'>) => void;
  deleteFile: (fileId: string) => void;
  addFolder: (folder: Omit<ProjectFolder, 'id' | 'createdAt'>) => void;
  renameFolder: (folderId: string, newName: string) => void;
  deleteFolder: (folderId: string) => boolean;
  moveFileToFolder: (fileId: string, folderId: string | undefined) => void;
  
  updateAgreementStatus: (agreementId: string, status: Agreement['status']) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => void;
  updateInvoiceStatus: (invoiceId: string, status: Invoice['status']) => void;
  recordClientDesignApproval: (projectId: string) => void;
  resetToDemoData: () => void;
}

const STORAGE_KEY = '1upsites_portal_state_v3';

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('admin');
  const [activeClientId, setActiveClientId] = useState<string>('cli-salon');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeAdminTab, setActiveAdminTab] = useState<string>('overview');
  const [activeClientTab, setActiveClientTab] = useState<string>('website');

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_clients`);
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_projects`);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [revisions, setRevisions] = useState<RevisionTask[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_revisions`);
    return saved ? JSON.parse(saved) : INITIAL_REVISIONS;
  });

  const [files, setFiles] = useState<ProjectFile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_files`);
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });

  const [folders, setFolders] = useState<ProjectFolder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_folders`);
    return saved ? JSON.parse(saved) : INITIAL_FOLDERS;
  });

  const [agreements, setAgreements] = useState<Agreement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_agreements`);
    return saved ? JSON.parse(saved) : INITIAL_AGREEMENTS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_invoices`);
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_activity`);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_clients`, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_revisions`, JSON.stringify(revisions));
  }, [revisions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_files`, JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_folders`, JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_agreements`, JSON.stringify(agreements));
  }, [agreements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_activity`, JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Log activity helper
  const logActivity = (projectId: string, type: ActivityLog['type'], title: string, description: string, actor: string, actorRole: 'Admin' | 'Client') => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      projectId,
      type,
      title,
      description,
      timestamp: new Date().toISOString(),
      actor,
      actorRole
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Domain Config Handlers
  const updateProjectDomainConfig = (projectId: string, updates: Partial<ProjectDomainConfig>) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const existingConfig = p.domainConfig || {
          initiated: true,
          domainName: '',
          registrar: 'Other / Not Sure',
          dnsProvider: 'Default DNS',
          hostingProvider: 'Google AI Studio / Cloud Run',
          isNewDomain: false,
          retainRegistrar: true,
          connectionMethod: 'DNS Update (A/CNAME)',
          dnsSetupStatus: 'Not Started',
          technicalVerificationStatus: 'Pending',
          sslStatus: 'Pending',
          instructions: [],
          checklist: []
        };

        const updatedConfig = { ...existingConfig, ...updates };
        return { ...p, domainConfig: updatedConfig };
      }
      return p;
    }));

    logActivity(
      projectId,
      'domain_launch',
      'Domain Setup Updated',
      `Domain configuration settings updated for project.`,
      role === 'admin' ? '1UpSites Admin' : 'Client',
      role === 'admin' ? 'Admin' : 'Client'
    );
  };

  const addDnsInstruction = (projectId: string, instruction: Omit<DnsRecordInstruction, 'id'>) => {
    const newInstruction: DnsRecordInstruction = {
      ...instruction,
      id: `dns-${Date.now()}`
    };

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const domainConfig = p.domainConfig || {
          initiated: true,
          domainName: '',
          registrar: 'GoDaddy',
          dnsProvider: 'GoDaddy DNS',
          hostingProvider: 'Google AI Studio / Cloud Run',
          isNewDomain: false,
          retainRegistrar: true,
          connectionMethod: 'DNS Update (A/CNAME)',
          dnsSetupStatus: 'Initiated',
          technicalVerificationStatus: 'Pending',
          sslStatus: 'Pending',
          instructions: [],
          checklist: []
        };

        return {
          ...p,
          domainConfig: {
            ...domainConfig,
            instructions: [...domainConfig.instructions, newInstruction]
          }
        };
      }
      return p;
    }));
  };

  const updateDnsInstruction = (projectId: string, instructionId: string, updates: Partial<DnsRecordInstruction>) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId && p.domainConfig) {
        return {
          ...p,
          domainConfig: {
            ...p.domainConfig,
            instructions: p.domainConfig.instructions.map(inst => 
              inst.id === instructionId ? { ...inst, ...updates } : inst
            )
          }
        };
      }
      return p;
    }));
  };

  const deleteDnsInstruction = (projectId: string, instructionId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId && p.domainConfig) {
        return {
          ...p,
          domainConfig: {
            ...p.domainConfig,
            instructions: p.domainConfig.instructions.filter(inst => inst.id !== instructionId)
          }
        };
      }
      return p;
    }));
  };

  const toggleLaunchChecklistItem = (projectId: string, itemId: string, completed?: boolean) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId && p.domainConfig) {
        return {
          ...p,
          domainConfig: {
            ...p.domainConfig,
            checklist: p.domainConfig.checklist.map(chk => {
              if (chk.id === itemId) {
                return { ...chk, completed: completed !== undefined ? completed : !chk.completed };
              }
              return chk;
            })
          }
        };
      }
      return p;
    }));
  };

  const markClientDnsCompleted = (projectId: string) => {
    const timestamp = new Date().toISOString().split('T')[0];
    setProjects(prev => prev.map(p => {
      if (p.id === projectId && p.domainConfig) {
        return {
          ...p,
          domainConfig: {
            ...p.domainConfig,
            dnsSetupStatus: 'Client Completed',
            technicalVerificationStatus: 'Propagating',
            clientCompletedAt: timestamp,
            checklist: p.domainConfig.checklist.map(c => 
              c.label.includes('completed by client') ? { ...c, completed: true } : c
            )
          }
        };
      }
      return p;
    }));

    logActivity(
      projectId,
      'domain_launch',
      'Client Confirmed DNS Update',
      'Client recorded DNS changes as completed. Awaiting technical propagation and admin verification.',
      'Client',
      'Client'
    );
  };

  const submitClientDomainHelpRequest = (projectId: string, message: string, screenshotUrl?: string) => {
    const timestamp = new Date().toISOString();
    setProjects(prev => prev.map(p => {
      if (p.id === projectId && p.domainConfig) {
        return {
          ...p,
          domainConfig: {
            ...p.domainConfig,
            dnsSetupStatus: 'Issue / Attention Needed',
            clientHelpRequest: {
              message,
              requestedAt: timestamp,
              screenshotUrl,
              resolved: false
            }
          }
        };
      }
      return p;
    }));

    logActivity(
      projectId,
      'domain_launch',
      'Client Domain Help Requested',
      `Client requested assistance with DNS setup: "${message.substring(0, 60)}..."`,
      'Client',
      'Client'
    );
  };

  // Unified New Prospect + Project Creation Workflow
  const addProspectWithProject = (payload: NewProspectPayload) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const clientId = `cli-${Date.now()}`;
    const projectId = `proj-${Date.now()}`;

    const stage: ProspectStatus = payload.relationshipStage || 'Prospect';
    const publishedUrl = payload.aiStudioPublishedUrl || 'https://ai.studio/';
    const editorUrl = payload.aiStudioEditorUrl || 'https://aistudio.google.com/';

    const newClient: Client = {
      id: clientId,
      businessName: payload.businessName,
      primaryContact: payload.primaryContact || 'Primary Contact',
      email: payload.email || '',
      phone: payload.phone || '',
      status: stage,
      portalAccessStatus: 'Not Invited',
      proposedValue: payload.proposedValue || undefined,
      followUpDate: payload.followUpDate || undefined,
      dateCreated: timestamp,
      notes: payload.notes || payload.projectDescription || '',
      aiStudioPublishedUrl: publishedUrl,
      aiStudioEditorUrl: editorUrl,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250`
    };

    const newProject: Project = {
      id: projectId,
      projectName: payload.projectName,
      clientId: clientId,
      description: payload.projectDescription || 'Website design & development project created in Google AI Studio.',
      phase: 'Design',
      relationshipStage: stage,
      portalAccessStatus: 'Not Invited',
      startDate: timestamp,
      targetCompletionDate: payload.expectedCloseDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      websitePreviewUrl: publishedUrl,
      aiStudioPublishedUrl: publishedUrl,
      aiStudioEditorUrl: editorUrl,
      previewType: 'iframe',
      proposedValue: payload.proposedValue,
      internalNotes: payload.notes || 'Prospect record created. Demo website links configured.',
      assignedTasks: [
        { id: `t-${Date.now()}-1`, title: 'Build initial homepage demo in AI Studio', completed: true, category: 'Design' },
        { id: `t-${Date.now()}-2`, title: 'Send published demo link to prospect', completed: false, category: 'Review' }
      ],
      revisionConfig: {
        includedRounds: 2,
        currentRound: 1,
        maxTasksPerRound: 5,
        agreementNote: '2 revision rounds included upon contract signing.',
        postLaunchSupportDays: 7
      },
      createdAt: timestamp
    };

    setClients(prev => [newClient, ...prev]);
    setProjects(prev => [newProject, ...prev]);

    logActivity(
      projectId, 
      'prospect', 
      'New Prospect Created', 
      `Prospect "${payload.businessName}" created with project "${payload.projectName}". Portal access remains disabled.`, 
      '1UpSites Team', 
      'Admin'
    );

    return { clientId, projectId };
  };

  const addClient = (clientData: Omit<Client, 'id' | 'dateCreated'>) => {
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      dateCreated: new Date().toISOString().split('T')[0]
    };
    setClients(prev => [newClient, ...prev]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const updatePortalAccessStatus = (clientId: string, status: PortalAccessStatus) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, portalAccessStatus: status } : c));
    setProjects(prev => prev.map(p => p.clientId === clientId ? { ...p, portalAccessStatus: status } : p));

    const clientObj = clients.find(c => c.id === clientId);
    const linkedProj = projects.find(p => p.clientId === clientId);
    if (linkedProj) {
      logActivity(
        linkedProj.id,
        'portal_access',
        `Portal Access Changed: ${status}`,
        `Client portal access for "${clientObj?.businessName || 'Client'}" set to ${status}.`,
        '1UpSites Team',
        'Admin'
      );
    }
  };

  const updateProspectStatus = (clientId: string, status: ProspectStatus) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, status } : c));
    setProjects(prev => prev.map(p => p.clientId === clientId ? { ...p, relationshipStage: status } : p));

    const clientObj = clients.find(c => c.id === clientId);
    const linkedProj = projects.find(p => p.clientId === clientId);
    if (linkedProj) {
      logActivity(
        linkedProj.id,
        'prospect',
        `Sales Stage: ${status}`,
        `Relationship stage for "${clientObj?.businessName || 'Client'}" updated to "${status}".`,
        '1UpSites Team',
        'Admin'
      );
    }
  };

  const updateAiStudioUrls = (projectId: string, publishedUrl?: string, editorUrl?: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          ...(publishedUrl ? { aiStudioPublishedUrl: publishedUrl, websitePreviewUrl: publishedUrl } : {}),
          ...(editorUrl ? { aiStudioEditorUrl: editorUrl } : {})
        };
      }
      return p;
    }));

    const proj = projects.find(p => p.id === projectId);
    if (proj) {
      setClients(prev => prev.map(c => {
        if (c.id === proj.clientId) {
          return {
            ...c,
            ...(publishedUrl ? { aiStudioPublishedUrl: publishedUrl } : {}),
            ...(editorUrl ? { aiStudioEditorUrl: editorUrl } : {})
          };
        }
        return c;
      }));
    }
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProjects(prev => [newProject, ...prev]);
    logActivity(newProject.id, 'status_change', 'Project Created', `New project "${newProject.projectName}" created.`, '1UpSites Team', 'Admin');
  };

  const updateProjectPhase = (projectId: string, newPhase: ProjectPhase) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, phase: newPhase };
      }
      return p;
    }));
    const proj = projects.find(p => p.id === projectId);
    logActivity(
      projectId, 
      'status_change', 
      'Project Phase Updated', 
      `Project "${proj?.projectName || 'Project'}" moved to "${newPhase}" stage.`, 
      role === 'admin' ? '1UpSites Team' : 'Client', 
      role === 'admin' ? 'Admin' : 'Client'
    );
  };

  const updateProjectNotes = (projectId: string, notes: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, internalNotes: notes } : p));
  };

  const addRevision = (revisionData: Omit<RevisionTask, 'id' | 'submissionDate' | 'comments'>) => {
    const idNum = revisions.length + 101;
    const newRev: RevisionTask = {
      ...revisionData,
      id: `REV-${idNum}`,
      submissionDate: new Date().toISOString().split('T')[0],
      comments: []
    };
    setRevisions(prev => [newRev, ...prev]);
    logActivity(
      revisionData.projectId, 
      'revision', 
      'Revision Submitted', 
      `Revision ${newRev.id} for "${newRev.webpage}" submitted.`, 
      role === 'client' ? 'Client' : '1UpSites Team', 
      role === 'client' ? 'Client' : 'Admin'
    );
  };

  const updateRevisionStatus = (revisionId: string, status: RevisionStatus, responseText?: string) => {
    setRevisions(prev => prev.map(r => {
      if (r.id === revisionId) {
        return { 
          ...r, 
          status, 
          ...(responseText !== undefined ? { adminResponse: responseText } : {}) 
        };
      }
      return r;
    }));
    const rev = revisions.find(r => r.id === revisionId);
    if (rev) {
      logActivity(
        rev.projectId, 
        'status_change', 
        `Revision Status: ${status}`, 
        `Revision ${revisionId} marked as "${status}".`, 
        role === 'admin' ? '1UpSites Team' : 'Client', 
        role === 'admin' ? 'Admin' : 'Client'
      );
    }
  };

  const addRevisionComment = (revisionId: string, author: 'admin' | 'client', authorName: string, message: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      author,
      authorName,
      message,
      timestamp: new Date().toISOString()
    };
    setRevisions(prev => prev.map(r => {
      if (r.id === revisionId) {
        return { ...r, comments: [...r.comments, newComment] };
      }
      return r;
    }));
  };

  const addFile = (fileData: Omit<ProjectFile, 'id' | 'uploadDate'>) => {
    const newFile: ProjectFile = {
      ...fileData,
      id: `file-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setFiles(prev => [newFile, ...prev]);
    logActivity(
      fileData.projectId, 
      'file', 
      'New File Uploaded', 
      `File "${newFile.name}" added under ${newFile.category}.`, 
      fileData.uploadedBy === 'Client' ? 'Client' : '1UpSites Team', 
      fileData.uploadedBy === 'Client' ? 'Client' : 'Admin'
    );
  };

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const addFolder = (folderData: Omit<ProjectFolder, 'id' | 'createdAt'>) => {
    const newFolder: ProjectFolder = {
      ...folderData,
      id: `fold-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setFolders(prev => [...prev, newFolder]);
    logActivity(
      folderData.projectId,
      'file',
      'New Folder Created',
      `Folder "${newFolder.name}" created under ${newFolder.category}.`,
      role === 'admin' ? '1UpSites Team' : 'Client',
      role === 'admin' ? 'Admin' : 'Client'
    );
  };

  const renameFolder = (folderId: string, newName: string) => {
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, name: newName } : f));
  };

  const deleteFolder = (folderId: string): boolean => {
    const filesInFolder = files.filter(f => f.folderId === folderId);
    if (filesInFolder.length > 0) {
      setFiles(prev => prev.map(f => f.folderId === folderId ? { ...f, folderId: undefined } : f));
    }
    setFolders(prev => prev.filter(f => f.id !== folderId));
    return true;
  };

  const moveFileToFolder = (fileId: string, targetFolderId: string | undefined) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, folderId: targetFolderId } : f));
  };

  const updateAgreementStatus = (agreementId: string, status: Agreement['status']) => {
    setAgreements(prev => prev.map(a => {
      if (a.id === agreementId) {
        return { 
          ...a, 
          status, 
          ...(status === 'Signed' ? { signedDate: new Date().toISOString().split('T')[0] } : {}) 
        };
      }
      return a;
    }));
    const agr = agreements.find(a => a.id === agreementId);
    if (agr) {
      logActivity(
        agr.projectId,
        'agreement',
        `Agreement ${status}`,
        `Agreement "${agr.title}" updated to ${status}.`,
        role === 'admin' ? '1UpSites Team' : 'Client',
        role === 'admin' ? 'Admin' : 'Client'
      );
    }
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const invNum = `INV-2026-00${invoices.length + 1}`;
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      invoiceNumber: invNum
    };
    setInvoices(prev => [newInvoice, ...prev]);
    logActivity(
      invoiceData.projectId,
      'invoice',
      'Invoice Generated',
      `Invoice ${invNum} ($${newInvoice.amount.toLocaleString()}) created.`,
      '1UpSites Team',
      'Admin'
    );
  };

  const updateInvoiceStatus = (invoiceId: string, status: Invoice['status']) => {
    setInvoices(prev => prev.map(i => {
      if (i.id === invoiceId) {
        return {
          ...i,
          status,
          ...(status === 'Paid' ? { paidDate: new Date().toISOString().split('T')[0] } : {})
        };
      }
      return i;
    }));
    const inv = invoices.find(i => i.id === invoiceId);
    if (inv) {
      logActivity(
        inv.projectId,
        'invoice',
        `Invoice ${status}`,
        `Invoice ${inv.invoiceNumber} status changed to ${status}.`,
        role === 'admin' ? '1UpSites Team' : 'Client',
        role === 'admin' ? 'Admin' : 'Client'
      );
    }
  };

  const recordClientDesignApproval = (projectId: string) => {
    const timestamp = new Date().toISOString();
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { 
          ...p, 
          phase: 'Final Approval' as ProjectPhase,
          lastApprovedAt: timestamp 
        };
      }
      return p;
    }));
    logActivity(
      projectId,
      'approval',
      'Design Formally Approved',
      'Client recorded formal design sign-off for current build iteration.',
      'Client',
      'Client'
    );
  };

  const resetToDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_clients`);
    localStorage.removeItem(`${STORAGE_KEY}_projects`);
    localStorage.removeItem(`${STORAGE_KEY}_revisions`);
    localStorage.removeItem(`${STORAGE_KEY}_files`);
    localStorage.removeItem(`${STORAGE_KEY}_folders`);
    localStorage.removeItem(`${STORAGE_KEY}_agreements`);
    localStorage.removeItem(`${STORAGE_KEY}_invoices`);
    localStorage.removeItem(`${STORAGE_KEY}_activity`);
    
    setClients(INITIAL_CLIENTS);
    setProjects(INITIAL_PROJECTS);
    setRevisions(INITIAL_REVISIONS);
    setFiles(INITIAL_FILES);
    setFolders(INITIAL_FOLDERS);
    setAgreements(INITIAL_AGREEMENTS);
    setInvoices(INITIAL_INVOICES);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setActiveClientId('cli-salon');
    setActiveProjectId(null);
  };

  return (
    <PortalContext.Provider value={{
      role, setRole,
      activeClientId, setActiveClientId,
      activeProjectId, setActiveProjectId,
      activeAdminTab, setActiveAdminTab,
      activeClientTab, setActiveClientTab,
      clients, projects, revisions, files, folders, agreements, invoices, activityLogs,
      addProspectWithProject,
      addClient, updateClient, updatePortalAccessStatus, updateProspectStatus, updateAiStudioUrls,
      updateProjectDomainConfig, addDnsInstruction, updateDnsInstruction, deleteDnsInstruction,
      toggleLaunchChecklistItem, markClientDnsCompleted, submitClientDomainHelpRequest,
      addProject, updateProjectPhase, updateProjectNotes,
      addRevision, updateRevisionStatus, addRevisionComment, addFile, deleteFile,
      addFolder, renameFolder, deleteFolder, moveFileToFolder,
      updateAgreementStatus, addInvoice, updateInvoiceStatus, recordClientDesignApproval,
      resetToDemoData
    }}>
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
