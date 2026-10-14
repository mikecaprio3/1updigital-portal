import { Client, Project, RevisionTask, ProjectFile, ProjectFolder, Agreement, Invoice, ActivityLog, ProjectDomainConfig } from '../types/portal';

export const INITIAL_FOLDERS: ProjectFolder[] = [
  {
    id: 'fold-1',
    projectId: 'proj-1',
    name: 'Malibu Coastal High-Res Photos',
    category: 'Client Photography',
    createdAt: '2026-09-18'
  },
  {
    id: 'fold-2',
    projectId: 'proj-1',
    name: 'Vector Logos & Brand Deck',
    category: 'Branding & Logos',
    createdAt: '2026-09-20'
  }
];

export const INITIAL_FILES: ProjectFile[] = [
  {
    id: 'file-1',
    projectId: 'proj-1',
    folderId: 'fold-2',
    name: 'Apex_Luxury_Brand_Guidelines_v2.pdf',
    category: 'Branding & Logos',
    uploadDate: '2026-09-16',
    uploadedBy: 'Client',
    size: '4.2 MB',
    type: 'application/pdf',
    previewUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'file-2',
    projectId: 'proj-1',
    folderId: 'fold-1',
    name: 'Malibu_Oceanfront_Hero_4K.jpg',
    category: 'Client Photography',
    uploadDate: '2026-09-18',
    uploadedBy: 'Client',
    size: '8.7 MB',
    type: 'image/jpeg',
    previewUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'file-3',
    projectId: 'proj-1',
    folderId: 'fold-1',
    name: 'BeverlyHills_Estate_Exterior.jpg',
    category: 'Client Photography',
    uploadDate: '2026-09-18',
    uploadedBy: 'Client',
    size: '6.1 MB',
    type: 'image/jpeg',
    previewUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'file-4',
    projectId: 'proj-1',
    folderId: 'fold-2',
    name: 'ChampagneGold_VectorLogo_Transparent.png',
    category: 'Branding & Logos',
    uploadDate: '2026-09-20',
    uploadedBy: '1UpSites Admin',
    size: '1.1 MB',
    type: 'image/png',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'file-5',
    projectId: 'proj-2',
    name: 'Lumiere_Fixtures_2026_Catalog.pdf',
    category: 'Documents',
    uploadDate: '2026-09-23',
    uploadedBy: 'Client',
    size: '12.4 MB',
    type: 'application/pdf',
    previewUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=400'
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-salon',
    businessName: 'That Hair Though Beauty Bar',
    primaryContact: 'Chloe Bennett',
    email: 'chloe@thathairthoughsalon.com',
    phone: '(203) 555-0188',
    status: 'Demo Sent',
    portalAccessStatus: 'Active',
    proposedValue: 4800,
    followUpDate: '2026-10-18',
    dateCreated: '2026-10-02',
    notes: 'Boutique hair salon & spa in North Haven, CT. Published website demo generated in Google AI Studio.',
    avatarUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=250',
    aiStudioPublishedUrl: 'https://that-hair-though-beauty-bar-north-haven-ct-salon.ai.studio/',
    aiStudioEditorUrl: 'https://aistudio.google.com/prompts/thathairthough-salon-editor'
  },
  {
    id: 'cli-1',
    businessName: 'Apex Luxury Real Estate',
    primaryContact: 'Elena Vance',
    email: 'elena@apexluxuryre.com',
    phone: '(310) 555-0192',
    status: 'Active Client',
    portalAccessStatus: 'Active',
    proposedValue: 9500,
    dateCreated: '2026-09-10',
    notes: 'Premier coastal real estate agency requiring high-conversion listing pages and interactive 3D virtual tour embeds.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    aiStudioPublishedUrl: 'https://apex-luxury-real-estate.ai.studio/',
    aiStudioEditorUrl: 'https://aistudio.google.com/prompts/apex-luxury-editor'
  },
  {
    id: 'cli-2',
    businessName: 'Lumière Architectural Lighting',
    primaryContact: 'Julian Hayes',
    email: 'julian@lumiere-light.com',
    phone: '(212) 555-0144',
    status: 'Active Client',
    portalAccessStatus: 'Active',
    proposedValue: 11200,
    dateCreated: '2026-09-18',
    notes: 'Custom boutique lighting design firm based in SoHo. Focus on dark mode aesthetics and interactive product showcases.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    aiStudioPublishedUrl: 'https://lumiere-lighting-fixtures.ai.studio/',
    aiStudioEditorUrl: 'https://aistudio.google.com/prompts/lumiere-lighting-editor'
  },
  {
    id: 'cli-3',
    businessName: 'Solstice Wellness Retreat',
    primaryContact: 'Maya Lin',
    email: 'maya@solsticewellness.co',
    phone: '(415) 555-0823',
    status: 'Active Client',
    portalAccessStatus: 'Active',
    proposedValue: 7800,
    dateCreated: '2026-10-01',
    notes: 'Luxury holistic sanctuary in Big Sur. Needs seamless online booking calendar integration and serene video background hero.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    aiStudioPublishedUrl: 'https://solstice-retreat-sanctuary.ai.studio/',
    aiStudioEditorUrl: 'https://aistudio.google.com/prompts/solstice-retreat-editor'
  },
  {
    id: 'cli-kismet',
    businessName: 'Kismet Artisan Bakery & Cafe',
    primaryContact: 'Marco Rossi',
    email: 'marco@kismetbakery.com',
    phone: '(212) 555-0812',
    status: 'Demo in Progress',
    portalAccessStatus: 'Not Invited',
    proposedValue: 5200,
    followUpDate: '2026-10-16',
    dateCreated: '2026-10-08',
    notes: 'Artisan sourdough bakery & espresso bar in West Village. Demo website build in progress in AI Studio.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    aiStudioPublishedUrl: 'https://kismet-artisan-bakery.ai.studio/',
    aiStudioEditorUrl: 'https://aistudio.google.com/prompts/kismet-bakery-editor'
  }
];

export const SALON_DOMAIN_CONFIG: ProjectDomainConfig = {
  initiated: true,
  domainName: 'thathairthoughsalon.com',
  registrar: 'GoDaddy',
  dnsProvider: 'GoDaddy DNS',
  hostingProvider: 'Google AI Studio / Cloud Run',
  isNewDomain: false,
  retainRegistrar: true,
  connectionMethod: 'DNS Update (A/CNAME)',
  dnsSetupStatus: 'Initiated',
  technicalVerificationStatus: 'Pending',
  sslStatus: 'Provisioning',
  targetLaunchDate: '2026-10-25',
  instructions: [
    {
      id: 'dns-1',
      recordType: 'A',
      hostName: '@',
      requiredValue: '216.239.32.21',
      ttl: '3600',
      action: 'Add',
      explanation: 'Points your primary domain (thathairthoughsalon.com) to Google web hosting servers.',
      warningNote: 'Do NOT touch or delete your MX or SPF records! Your business email will stay 100% active.'
    },
    {
      id: 'dns-2',
      recordType: 'CNAME',
      hostName: 'www',
      requiredValue: 'ghs.googlehosted.com',
      ttl: '3600',
      action: 'Add',
      explanation: 'Ensures visitors typing www.thathairthoughsalon.com land seamlessly on your website.'
    }
  ],
  checklist: [
    { id: 'c-1', label: 'Domain ownership confirmed by client', completed: true },
    { id: 'c-2', label: 'DNS provider identified (GoDaddy DNS)', completed: true },
    { id: 'c-3', label: 'Production DNS instruction card prepared by 1UpSites', completed: true },
    { id: 'c-4', label: 'DNS updates completed by client', completed: false },
    { id: 'c-5', label: 'DNS records verified live via lookup', completed: false },
    { id: 'c-6', label: 'SSL/HTTPS certificate active & secure', completed: false },
    { id: 'c-7', label: 'Root (@) and www redirects tested', completed: false },
    { id: 'c-8', label: 'Business email service verified unaffected', completed: true },
    { id: 'c-9', label: 'Website mobile & desktop functionality tested', completed: true },
    { id: 'c-10', label: 'Final client design approval recorded', completed: true },
    { id: 'c-11', label: 'Launch balance payment cleared', completed: true },
    { id: 'c-12', label: 'Official domain DNS launch completed', completed: false }
  ]
};

export const APEX_DOMAIN_CONFIG: ProjectDomainConfig = {
  initiated: true,
  domainName: 'apexluxuryre.com',
  registrar: 'Cloudflare',
  dnsProvider: 'Cloudflare DNS',
  hostingProvider: '1UpSites Dedicated Engine',
  isNewDomain: false,
  retainRegistrar: true,
  connectionMethod: 'DNS Update (A/CNAME)',
  dnsSetupStatus: 'Verified',
  technicalVerificationStatus: 'Verified Live',
  sslStatus: 'Active & Secure',
  verifiedAt: '2026-10-10',
  targetLaunchDate: '2026-10-28',
  instructions: [
    {
      id: 'dns-apex-1',
      recordType: 'A',
      hostName: '@',
      requiredValue: '199.36.158.100',
      ttl: 'Auto',
      action: 'Edit',
      explanation: 'Points root domain to dedicated 1UpSites high-speed edge proxy.',
      warningNote: 'Keep Cloudflare proxy toggle (orange cloud) set to Proxied.'
    },
    {
      id: 'dns-apex-2',
      recordType: 'CNAME',
      hostName: 'www',
      requiredValue: 'apexluxuryre.com',
      ttl: 'Auto',
      action: 'Edit',
      explanation: 'Alias www to root domain.'
    }
  ],
  checklist: [
    { id: 'ca-1', label: 'Domain ownership confirmed by client', completed: true },
    { id: 'ca-2', label: 'DNS provider identified (Cloudflare DNS)', completed: true },
    { id: 'ca-3', label: 'Production DNS instructions prepared', completed: true },
    { id: 'ca-4', label: 'DNS updates completed by client', completed: true },
    { id: 'ca-5', label: 'DNS records verified live via lookup', completed: true },
    { id: 'ca-6', label: 'SSL/HTTPS certificate active & secure', completed: true },
    { id: 'ca-7', label: 'Root (@) and www redirects tested', completed: true },
    { id: 'ca-8', label: 'Business email service verified unaffected', completed: true },
    { id: 'ca-9', label: 'Website mobile & desktop functionality tested', completed: true },
    { id: 'ca-10', label: 'Final client design approval recorded', completed: true },
    { id: 'ca-11', label: 'Launch balance payment cleared', completed: true },
    { id: 'ca-12', label: 'Official domain DNS launch completed', completed: true }
  ]
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-salon',
    projectName: 'That Hair Though Beauty Bar Website',
    clientId: 'cli-salon',
    description: 'Boutique salon digital experience, treatment menu, appointment request flow, and stylist portfolio in North Haven, CT.',
    phase: 'Client Review',
    relationshipStage: 'Demo Sent',
    portalAccessStatus: 'Active',
    startDate: '2026-10-02',
    targetCompletionDate: '2026-10-30',
    websitePreviewUrl: 'https://that-hair-though-beauty-bar-north-haven-ct-salon.ai.studio/',
    aiStudioPublishedUrl: 'https://that-hair-though-beauty-bar-north-haven-ct-salon.ai.studio/',
    aiStudioEditorUrl: 'https://aistudio.google.com/prompts/thathairthough-salon-editor',
    previewType: 'iframe',
    proposedValue: 4800,
    internalNotes: 'Published version live at https://that-hair-though-beauty-bar-north-haven-ct-salon.ai.studio/. Waiting on client review.',
    assignedTasks: [
      { id: 't-salon-1', title: 'Verify published AI Studio URL embedding', completed: true, category: 'Development' },
      { id: 't-salon-2', title: 'Add treatment menu price list', completed: true, category: 'Content' }
    ],
    revisionConfig: {
      includedRounds: 2,
      currentRound: 1,
      maxTasksPerRound: 5,
      agreementNote: '2 revision rounds included per proposal.',
      postLaunchSupportDays: 7
    },
    domainConfig: SALON_DOMAIN_CONFIG,
    createdAt: '2026-10-02'
  },
  {
    id: 'proj-1',
    projectName: 'Apex Luxury Digital Experience & Portal',
    clientId: 'cli-1',
    description: 'Bespoke web architecture, private property portal, and high-converting listing engine with champagne gold visual accents.',
    phase: 'Client Review',
    relationshipStage: 'Active Client',
    portalAccessStatus: 'Active',
    startDate: '2026-09-15',
    targetCompletionDate: '2026-10-28',
    websitePreviewUrl: 'https://apexluxury-demo.1upsites.com',
    aiStudioPublishedUrl: 'https://apex-luxury-real-estate.ai.studio/',
    aiStudioEditorUrl: 'https://aistudio.google.com/prompts/apex-luxury-editor',
    previewType: 'custom_demo',
    proposedValue: 9500,
    internalNotes: 'Elena loved the property card layout. Waiting on final review for Round 1 revisions. Target launch end of October.',
    assignedTasks: [
      { id: 't-1', title: 'Finalize mobile layout for listing filter modal', completed: true, category: 'Design' },
      { id: 't-2', title: 'Optimize high-res property hero images', completed: true, category: 'Development' },
      { id: 't-3', title: 'Implement champagne gold hover states on listings', completed: false, category: 'Design' },
      { id: 't-4', title: 'SEO meta tags setup for Malibu & Beverly Hills pages', completed: false, category: 'SEO' }
    ],
    revisionConfig: {
      includedRounds: 2,
      currentRound: 1,
      maxTasksPerRound: 5,
      agreementNote: '2 comprehensive revision rounds included per SOW #1U-2026-088. Additional rounds available at $150/hr.',
      postLaunchSupportDays: 7
    },
    domainConfig: APEX_DOMAIN_CONFIG,
    lastApprovedAt: '2026-10-05T14:30:00Z',
    createdAt: '2026-09-15'
  },
  {
    id: 'proj-2',
    projectName: 'Lumière Architectural Storefront',
    clientId: 'cli-2',
    description: 'E-commerce showcase and architectural specification portal for high-end luminaire fixture collections.',
    phase: 'Design',
    relationshipStage: 'Active Client',
    portalAccessStatus: 'Active',
    startDate: '2026-09-22',
    targetCompletionDate: '2026-11-12',
    websitePreviewUrl: 'https://lumiere-demo.1upsites.com',
    aiStudioPublishedUrl: 'https://lumiere-lighting-fixtures.ai.studio/',
    aiStudioEditorUrl: 'https://aistudio.google.com/prompts/lumiere-lighting-editor',
    previewType: 'custom_demo',
    proposedValue: 11200,
    internalNotes: 'Julian provided vector CAD drawings. Figma frames prepared for lighting collection filters.',
    assignedTasks: [
      { id: 't-5', title: 'Build spec sheet PDF generator component', completed: false, category: 'Development' },
      { id: 't-6', title: 'Client photography grid color grading', completed: true, category: 'Design' }
    ],
    revisionConfig: {
      includedRounds: 2,
      currentRound: 1,
      maxTasksPerRound: 5,
      agreementNote: '2 revision rounds included.',
      postLaunchSupportDays: 7
    },
    createdAt: '2026-09-22'
  },
  {
    id: 'proj-3',
    projectName: 'Solstice Retreat Online Booking Experience',
    clientId: 'cli-3',
    description: 'Serene coastal web experience with real-time room availability and wellness program reservation flow.',
    phase: 'Final Approval',
    relationshipStage: 'Active Client',
    portalAccessStatus: 'Active',
    startDate: '2026-10-01',
    targetCompletionDate: '2026-10-22',
    websitePreviewUrl: 'https://solstice-demo.1upsites.com',
    aiStudioPublishedUrl: 'https://solstice-retreat-sanctuary.ai.studio/',
    aiStudioEditorUrl: 'https://aistudio.google.com/prompts/solstice-retreat-editor',
    previewType: 'custom_demo',
    proposedValue: 7800,
    internalNotes: 'Client review almost complete. Final approval pending invoice #INV-2026-003 clearance.',
    assignedTasks: [
      { id: 't-7', title: 'Connect calendar availability widget', completed: true, category: 'Development' },
      { id: 't-8', title: 'Final copy proofreading for sanctuary treatments', completed: true, category: 'Content' }
    ],
    revisionConfig: {
      includedRounds: 2,
      currentRound: 2,
      maxTasksPerRound: 4,
      agreementNote: '2 revision rounds completed.',
      postLaunchSupportDays: 7
    },
    lastApprovedAt: '2026-10-12T11:00:00Z',
    createdAt: '2026-10-01'
  },
  {
    id: 'proj-kismet',
    projectName: 'Kismet Artisan Web Showcase',
    clientId: 'cli-kismet',
    description: 'Artisan bakery menu showcase, catering lead form, and online order redirect.',
    phase: 'Design',
    relationshipStage: 'Demo in Progress',
    portalAccessStatus: 'Not Invited',
    startDate: '2026-10-08',
    targetCompletionDate: '2026-11-05',
    websitePreviewUrl: 'https://kismet-artisan-bakery.ai.studio/',
    aiStudioPublishedUrl: 'https://kismet-artisan-bakery.ai.studio/',
    aiStudioEditorUrl: 'https://aistudio.google.com/prompts/kismet-bakery-editor',
    previewType: 'iframe',
    proposedValue: 5200,
    internalNotes: 'Generating initial bakery homepage demo in Google AI Studio before presenting to Marco.',
    assignedTasks: [
      { id: 't-kismet-1', title: 'Generate hero section in AI Studio', completed: true, category: 'Design' }
    ],
    revisionConfig: {
      includedRounds: 2,
      currentRound: 1,
      maxTasksPerRound: 5,
      agreementNote: 'Proposal pending client acceptance.'
    },
    createdAt: '2026-10-08'
  }
];

export const INITIAL_REVISIONS: RevisionTask[] = [
  {
    id: 'REV-101',
    projectId: 'proj-1',
    webpage: 'Homepage / Hero Section',
    section: 'Primary Call to Action & Headline',
    instructions: 'Please change the hero tag line from "Defining Luxury Living" to "Exquisite Coastal Estates & Architectural Masterpieces". Also update the primary CTA button text to "Explore Private Collection".',
    attachmentUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
    attachedFileIds: ['file-1', 'file-2'],
    screenshotUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    pinCoordinates: { x: 50, y: 28, viewportMode: 'desktop' },
    additionalNotes: 'Refer to page 4 of the brand deck uploaded in assets.',
    status: 'In Progress',
    roundNumber: 1,
    submissionDate: '2026-10-11',
    targetCompletionDate: '2026-10-14',
    adminResponse: 'Typography updated in development build. Applying gold hover glow effect.',
    comments: [
      {
        id: 'c-1',
        author: 'client',
        authorName: 'Elena Vance',
        message: 'Could we ensure the gold accent matches hex #B99A74 from our palette?',
        timestamp: '2026-10-11T16:20:00Z'
      },
      {
        id: 'c-2',
        author: 'admin',
        authorName: '1UpSites Team',
        message: 'Absolutely Elena! Color exact-matched in CSS variables.',
        timestamp: '2026-10-11T17:05:00Z'
      }
    ]
  },
  {
    id: 'REV-102',
    projectId: 'proj-1',
    webpage: 'Property Listing Grid',
    section: 'Price Tags & Filter Drawer',
    instructions: 'On mobile view, the price badge overlaps slightly with the property square footage indicator. Please add 8px padding below the price tag.',
    attachmentUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
    attachedFileIds: ['file-3'],
    pinCoordinates: { x: 22, y: 68, viewportMode: 'desktop' },
    status: 'Ready for Client Review',
    roundNumber: 1,
    submissionDate: '2026-10-09',
    targetCompletionDate: '2026-10-12',
    adminResponse: 'Mobile flex layout updated. Added 12px responsive spacing and verified on iPhone 15 & Pixel 8.',
    comments: [
      {
        id: 'c-3',
        author: 'admin',
        authorName: '1UpSites Team',
        message: 'This fix is live in the preview container above. Please test on your mobile device when ready!',
        timestamp: '2026-10-10T10:15:00Z'
      }
    ]
  },
  {
    id: 'REV-103',
    projectId: 'proj-1',
    webpage: 'Agent Contact Modal',
    section: 'Inquiry Form',
    instructions: 'Add an optional field for "Preferred Viewing Date" with a calendar picker.',
    pinCoordinates: { x: 78, y: 82, viewportMode: 'desktop' },
    status: 'Approved',
    roundNumber: 1,
    submissionDate: '2026-10-06',
    targetCompletionDate: '2026-10-08',
    adminResponse: 'Date picker integrated and connected to contact handler.',
    comments: [
      {
        id: 'c-4',
        author: 'client',
        authorName: 'Elena Vance',
        message: 'Looks wonderful! Tested and working perfectly.',
        timestamp: '2026-10-07T14:45:00Z'
      }
    ]
  },
  {
    id: 'REV-104',
    projectId: 'proj-2',
    webpage: 'Product Detail Page',
    section: 'Photometric Specification Downloads',
    instructions: 'Add IES file download links alongside PDF spec sheets.',
    status: 'Submitted',
    roundNumber: 1,
    submissionDate: '2026-10-12',
    targetCompletionDate: '2026-10-16',
    comments: []
  }
];

export const INITIAL_AGREEMENTS: Agreement[] = [
  {
    id: 'agr-1',
    projectId: 'proj-1',
    title: 'Master Web Design & Custom Portal SOW',
    documentType: 'Statement of Work (SOW)',
    status: 'Signed',
    amount: 9500,
    sentDate: '2026-09-11',
    signedDate: '2026-09-12',
    summary: 'Comprehensive design and development of Apex Luxury Real Estate website, private listings portal, client dashboard, and 2 contractual revision rounds.',
    terms: [
      'Scope includes responsive desktop & mobile web development.',
      'Includes 2 dedicated revision rounds during Client Review phase.',
      'Deposit of 50% ($4,750) due upon agreement signing.',
      'Remaining 50% due prior to domain DNS launch.',
      'Includes optional 7-day post-launch support window.'
    ]
  },
  {
    id: 'agr-2',
    projectId: 'proj-2',
    title: 'Lumière Storefront & Spec System Agreement',
    documentType: 'Statement of Work (SOW)',
    status: 'Signed',
    amount: 11200,
    sentDate: '2026-09-19',
    signedDate: '2026-09-20',
    summary: 'Architectural lighting web catalog, custom CAD specification viewer, and Shopify/Headless integration.',
    terms: [
      'Includes product spec sheets PDF renderer.',
      'Includes 2 revision rounds.',
      'Milestone payments: 50% deposit, 25% design signoff, 25% launch.'
    ]
  },
  {
    id: 'agr-3',
    projectId: 'proj-3',
    title: 'Solstice Retreat Booking Web SOW',
    documentType: 'Statement of Work (SOW)',
    status: 'Signed',
    amount: 7800,
    sentDate: '2026-09-28',
    signedDate: '2026-09-29',
    summary: 'Holistic wellness sanctuary web application with integrated stay reservation system.',
    terms: [
      'Booking engine integration.',
      '2 revision rounds included.'
    ]
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-101',
    projectId: 'proj-1',
    invoiceNumber: 'INV-2026-001',
    title: 'Project Deposit (50%) — Web Design & Development',
    amount: 4750,
    status: 'Paid',
    issuedDate: '2026-10-02',
    dueDate: '2026-10-16',
    paidDate: '2026-10-03',
    lineItems: [
      { description: 'Initial Deposit for Apex Luxury Digital Experience (50% of $9,500 contract)', qty: 1, unitPrice: 4750, amount: 4750 }
    ]
  },
  {
    id: 'inv-102',
    projectId: 'proj-1',
    invoiceNumber: 'INV-2026-002',
    title: 'Final Milestone & Launch Clearance (50%)',
    amount: 4750,
    status: 'Outstanding',
    issuedDate: '2026-10-10',
    dueDate: '2026-10-25',
    lineItems: [
      { description: 'Final Balance upon Client Review Sign-off & Launch Clearance', qty: 1, unitPrice: 4750, amount: 4750 }
    ]
  },
  {
    id: 'inv-201',
    projectId: 'proj-2',
    invoiceNumber: 'INV-2026-003',
    title: 'Deposit (50%) — Architectural Storefront',
    amount: 5600,
    status: 'Paid',
    issuedDate: '2026-10-01',
    dueDate: '2026-10-15',
    paidDate: '2026-10-04',
    lineItems: [
      { description: 'Lumière Architectural Storefront Web Build Deposit', qty: 1, unitPrice: 5600, amount: 5600 }
    ]
  },
  {
    id: 'inv-301',
    projectId: 'proj-3',
    invoiceNumber: 'INV-2026-004',
    title: 'Final Balance — Solstice Booking Web',
    amount: 3900,
    status: 'Outstanding',
    issuedDate: '2026-10-08',
    dueDate: '2026-10-22',
    lineItems: [
      { description: 'Remaining 50% Balance for Solstice Sanctuary Web Portal', qty: 1, unitPrice: 3900, amount: 3900 }
    ]
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    projectId: 'proj-1',
    type: 'revision',
    title: 'Revision Request Submitted',
    description: 'Elena Vance submitted Revision REV-101 for Homepage / Hero Section.',
    timestamp: '2026-10-11T16:20:00Z',
    actor: 'Elena Vance',
    actorRole: 'Client'
  },
  {
    id: 'act-2',
    projectId: 'proj-1',
    type: 'status_change',
    title: 'Revision Status Updated to In Progress',
    description: '1UpSites Team updated Revision REV-101 status from Submitted to In Progress.',
    timestamp: '2026-10-11T17:05:00Z',
    actor: '1UpSites Team',
    actorRole: 'Admin'
  },
  {
    id: 'act-3',
    projectId: 'proj-1',
    type: 'approval',
    title: 'Revision Approved by Client',
    description: 'Elena Vance approved Revision REV-103 (Agent Contact Modal).',
    timestamp: '2026-10-07T14:45:00Z',
    actor: 'Elena Vance',
    actorRole: 'Client'
  },
  {
    id: 'act-4',
    projectId: 'proj-1',
    type: 'file',
    title: 'Asset Uploaded',
    description: '1UpSites Admin uploaded ChampagneGold_VectorLogo_Transparent.png.',
    timestamp: '2026-09-20T11:30:00Z',
    actor: '1UpSites Team',
    actorRole: 'Admin'
  },
  {
    id: 'act-5',
    projectId: 'proj-1',
    type: 'invoice',
    title: 'Invoice Issued',
    description: 'Invoice INV-2026-002 ($4,750.00) issued to Apex Luxury Real Estate.',
    timestamp: '2026-10-10T09:00:00Z',
    actor: '1UpSites Team',
    actorRole: 'Admin'
  }
];
