import React, { useState, useRef } from 'react';
import { Project, RevisionTask, PinCoordinates, ProjectFile } from '../types/portal';
import { usePortal } from '../context/PortalContext';
import { 
  Monitor, Smartphone, ExternalLink, CheckCircle2, 
  MessageSquarePlus, MapPin, Building2, Lamp, Compass, 
  Eye, X, Sparkles, RefreshCw, AlertCircle, Image as ImageIcon 
} from 'lucide-react';

interface InteractiveWebsitePreviewProps {
  project: Project;
  revisions?: RevisionTask[];
  onPinLocationClick?: (coords: PinCoordinates, webpage: string, section: string) => void;
  onRequestRevision?: () => void;
  onApproveDesign?: () => void;
  isClientView?: boolean;
  selectedRevisionId?: string | null;
  onSelectRevision?: (revId: string) => void;
}

export const InteractiveWebsitePreview: React.FC<InteractiveWebsitePreviewProps> = ({
  project,
  revisions = [],
  onPinLocationClick,
  onRequestRevision,
  onApproveDesign,
  isClientView = false,
  selectedRevisionId,
  onSelectRevision
}) => {
  const { recordClientDesignApproval } = usePortal();
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'home' | 'listings' | 'contact'>('home');
  const [isPinningMode, setIsPinningMode] = useState(false);
  const [showApprovalSuccessModal, setShowApprovalSuccessModal] = useState(false);
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);

  // Iframe preview state
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [iframeError, setIframeError] = useState<boolean>(false);

  const previewFrameRef = useRef<HTMLDivElement>(null);

  const projectRevisions = revisions.filter(r => r.projectId === project.id && r.pinCoordinates);
  const isRealIframe = project.previewType === 'iframe' || project.websitePreviewUrl.includes('.ai.studio');

  const handleFrameClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPinningMode || !previewFrameRef.current) return;

    const rect = previewFrameRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPercent = Math.round((clickX / rect.width) * 100);
    const yPercent = Math.round((clickY / rect.height) * 100);

    const detectedPage = activeTab === 'home' ? 'Homepage / Hero' : activeTab === 'listings' ? 'Properties / Treatments Grid' : 'Contact & Hours';
    const detectedSection = yPercent < 35 ? 'Hero Headline & Banner' : yPercent < 70 ? 'Main Content Grid' : 'Footer & Actions';

    const coords: PinCoordinates = {
      x: xPercent,
      y: yPercent,
      viewportMode: deviceMode
    };

    setIsPinningMode(false);

    if (onPinLocationClick) {
      onPinLocationClick(coords, detectedPage, detectedSection);
    }
  };

  const handleRefreshIframe = () => {
    setIframeLoaded(false);
    setIframeError(false);
    setIframeKey(prev => prev + 1);
  };

  const handleApprove = () => {
    if (onApproveDesign) {
      onApproveDesign();
    } else {
      recordClientDesignApproval(project.id);
    }
    setShowApprovalSuccessModal(true);
  };

  return (
    <div className="bg-white border border-[#E8E2D9] rounded-xl shadow-xs overflow-hidden transition-all">
      
      {/* Frame Toolbar */}
      <div className="bg-[#171717] text-[#FAF8F4] px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#333333]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-xs font-mono text-neutral-400 truncate max-w-[220px] sm:max-w-md" title={project.websitePreviewUrl}>
            {project.websitePreviewUrl}
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[#B99A74] bg-[#B99A74]/10 px-2 py-0.5 rounded border border-[#B99A74]/20 hidden sm:inline">
            {isRealIframe ? 'Published Site' : 'Live Preview'}
          </span>
        </div>

        {/* Viewport Toggles & Actions */}
        <div className="flex items-center gap-2">
          
          {/* Refresh Frame button */}
          <button
            onClick={handleRefreshIframe}
            className="p-1.5 rounded text-xs text-neutral-400 hover:text-white bg-[#262626] border border-[#333333] transition-colors"
            title="Refresh preview frame"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Visual Pin Mode Toggle Button */}
          {isClientView && (
            <button
              onClick={() => setIsPinningMode(!isPinningMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs ${
                isPinningMode 
                  ? 'bg-amber-400 text-amber-950 font-bold animate-pulse' 
                  : 'bg-[#B99A74] hover:bg-[#a3835e] text-[#171717]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{isPinningMode ? 'Click on Website to Pin Change' : 'Pin a Change'}</span>
            </button>
          )}

          {/* Desktop / Mobile Toggles */}
          <div className="flex items-center bg-[#262626] rounded-lg p-0.5 border border-[#333333]">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded text-xs transition-colors ${deviceMode === 'desktop' ? 'bg-[#B99A74] text-[#171717]' : 'text-neutral-400 hover:text-white'}`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded text-xs transition-colors ${deviceMode === 'mobile' ? 'bg-[#B99A74] text-[#171717]' : 'text-neutral-400 hover:text-white'}`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <a
            href={project.websitePreviewUrl}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded text-xs text-neutral-300 hover:text-white bg-[#262626] border border-[#333333] transition-colors flex items-center gap-1 font-semibold"
            title="Open in separate tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Open Website</span>
          </a>
        </div>
      </div>

      {/* Pinning Mode Active Banner */}
      {isPinningMode && (
        <div className="bg-amber-500 text-amber-950 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-xs z-30">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 animate-bounce" />
            <span>Pin Mode Active: Click directly on the visible webpage preview to mark your change location.</span>
          </div>
          <button onClick={() => setIsPinningMode(false)} className="hover:underline font-bold">
            Cancel Pin
          </button>
        </div>
      )}

      {/* Main Preview Container with Visual Overlay Pins */}
      <div className="p-3 sm:p-6 bg-neutral-100/70 min-h-[500px] flex items-center justify-center transition-all duration-300 relative">
        <div 
          ref={previewFrameRef}
          onClick={handleFrameClick}
          className={`transition-all duration-300 w-full relative ${
            isPinningMode ? 'cursor-crosshair ring-2 ring-amber-500 ring-offset-2' : ''
          } ${
            deviceMode === 'mobile' 
              ? 'max-w-[390px] border-[8px] border-[#171717] rounded-[36px] shadow-2xl bg-white overflow-hidden my-2 min-h-[580px]' 
              : 'max-w-full rounded-lg border border-[#E8E2D9] shadow-sm bg-white min-h-[520px]'
          }`}
        >
          {/* Overlay Click Surface when in Pinning Mode */}
          {isPinningMode && (
            <div className="absolute inset-0 bg-amber-500/10 z-20 cursor-crosshair flex items-center justify-center pointer-events-auto">
              <div className="bg-[#171717] text-amber-300 px-4 py-2 rounded-xl border border-amber-400/50 shadow-2xl font-semibold text-xs animate-pulse">
                📍 Click anywhere on this webpage area to place a pin
              </div>
            </div>
          )}

          {/* Visual Overlay Pins for Submitted Revisions */}
          {projectRevisions.map((rev, idx) => {
            if (!rev.pinCoordinates) return null;
            const isSelected = selectedRevisionId === rev.id;

            return (
              <div
                key={rev.id}
                style={{
                  left: `${rev.pinCoordinates.x}%`,
                  top: `${rev.pinCoordinates.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectRevision) onSelectRevision(rev.id);
                }}
                onMouseEnter={() => setHoveredPinId(rev.id)}
                onMouseLeave={() => setHoveredPinId(null)}
                className={`absolute z-30 transition-all cursor-pointer ${
                  isSelected ? 'scale-125 z-40' : 'hover:scale-110'
                }`}
                title={`${rev.id}: ${rev.instructions}`}
              >
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-bold shadow-lg border ${
                  rev.status === 'Approved' 
                    ? 'bg-emerald-600 text-white border-emerald-400' 
                    : isSelected 
                    ? 'bg-[#171717] text-[#B99A74] border-[#B99A74]' 
                    : 'bg-[#B99A74] text-[#171717] border-amber-200'
                }`}>
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span>#{idx + 1}</span>
                </div>

                {/* Hover Tooltip Popup */}
                {(hoveredPinId === rev.id || isSelected) && (
                  <div className="absolute top-7 left-1/2 -translate-x-1/2 bg-[#171717] text-white p-2.5 rounded-lg shadow-xl text-[11px] w-48 z-50 border border-[#B99A74] pointer-events-none">
                    <div className="font-semibold text-[#B99A74] mb-0.5">{rev.id} · {rev.webpage}</div>
                    <p className="text-neutral-200 line-clamp-2 text-[10px] leading-tight mb-1">"{rev.instructions}"</p>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 block">Status: {rev.status}</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* REAL IFRAME PREVIEW FOR PUBLISHED SITE URLS */}
          {isRealIframe ? (
            <div className="w-full h-full min-h-[500px] relative bg-white flex flex-col">
              
              {/* Fallback Banner if frame is blocked by CSP or error occurs */}
              {iframeError && (
                <div className="p-8 text-center space-y-4 bg-[#FAF8F4] min-h-[460px] flex flex-col items-center justify-center border-2 border-dashed border-[#E8E2D9] rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 max-w-md">
                    <h3 className="font-serif-heading text-lg font-semibold text-[#171717]">
                      This website can't be displayed inside the portal
                    </h3>
                    <p className="text-xs text-[#77736D] leading-relaxed">
                      Google AI Studio security headers prevent cross-origin embedding inside preview frames. Open it in a new tab to review the latest published version.
                    </p>
                  </div>
                  <a
                    href={project.websitePreviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-[#171717] hover:bg-[#262626] text-[#B99A74] font-semibold text-xs rounded-xl shadow-xs inline-flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Website in New Tab
                  </a>
                </div>
              )}

              {/* The Live Iframe */}
              {!iframeError && (
                <iframe
                  key={iframeKey}
                  src={project.websitePreviewUrl}
                  title={project.projectName}
                  onLoad={() => setIframeLoaded(true)}
                  onError={() => setIframeError(true)}
                  className="w-full h-[520px] border-0 rounded-lg bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                ></iframe>
              )}

              {/* Toggle Fallback helper bar */}
              <div className="bg-[#FAF8F4] px-4 py-2 border-t border-[#E8E2D9] flex items-center justify-between text-[11px] text-[#77736D]">
                <span>URL: <strong className="text-[#171717]">{project.websitePreviewUrl}</strong></span>
                <button
                  onClick={() => setIframeError(!iframeError)}
                  className="text-[#B99A74] hover:underline font-medium"
                >
                  {iframeError ? 'Try Reloading Frame' : 'Show Fallback View'}
                </button>
              </div>
            </div>
          ) : (
            /* Interactive Simulated Custom Demo Frame for mock projects */
            <div className="w-full min-h-[460px] bg-white text-[#171717] font-sans">
              
              {/* Custom Header */}
              <div className="bg-[#171717] text-white px-5 py-3 flex items-center justify-between border-b border-[#333333]">
                <div className="flex items-center gap-2">
                  {project.id === 'proj-1' && <Building2 className="w-5 h-5 text-[#B99A74]" />}
                  {project.id === 'proj-2' && <Lamp className="w-5 h-5 text-[#B99A74]" />}
                  {project.id === 'proj-3' && <Compass className="w-5 h-5 text-[#B99A74]" />}
                  <span className="font-serif-heading font-semibold tracking-wide text-sm sm:text-base text-white">
                    {project.id === 'proj-1' ? 'APEX LUXURY REAL ESTATE' : project.id === 'proj-2' ? 'LUMIÈRE ARCHITECTURAL' : 'SOLSTICE RETREAT'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <button 
                    onClick={() => { if (!isPinningMode) setActiveTab('home'); }} 
                    className={`transition-colors ${activeTab === 'home' ? 'text-[#B99A74] underline font-medium' : 'text-neutral-400 hover:text-white'}`}
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => { if (!isPinningMode) setActiveTab('listings'); }} 
                    className={`transition-colors ${activeTab === 'listings' ? 'text-[#B99A74] underline font-medium' : 'text-neutral-400 hover:text-white'}`}
                  >
                    {project.id === 'proj-2' ? 'Collection' : project.id === 'proj-3' ? 'Sanctuary' : 'Listings'}
                  </button>
                  <button 
                    onClick={() => { if (!isPinningMode) setActiveTab('contact'); }} 
                    className={`transition-colors ${activeTab === 'contact' ? 'text-[#B99A74] underline font-medium' : 'text-neutral-400 hover:text-white'}`}
                  >
                    Contact
                  </button>
                </div>
              </div>

              {/* Content Tabs */}
              {activeTab === 'home' && (
                <div>
                  <div className="relative h-64 sm:h-80 bg-neutral-900 text-white flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                    <img
                      src={
                        project.id === 'proj-1' 
                          ? 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200' 
                          : project.id === 'proj-2'
                          ? 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=1200'
                          : 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200'
                      }
                      alt="Preview hero"
                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                    <div className="relative z-10 max-w-lg">
                      <span className="text-[11px] uppercase tracking-widest text-[#B99A74] font-semibold mb-2 block">
                        {project.id === 'proj-1' ? 'Beverly Hills & Coastal Malibu' : project.id === 'proj-2' ? 'Bespoke Luminaire Catalog' : 'Big Sur Coastal Retreat'}
                      </span>
                      <h2 className="font-serif-heading text-2xl sm:text-3xl font-medium mb-3">
                        {project.id === 'proj-1' ? 'Exquisite Coastal Estates & Architectural Masterpieces' : project.id === 'proj-2' ? 'Sculpted Light for Iconic Spaces' : 'A Sanctuary for Mind & Spirit'}
                      </h2>
                      <p className="text-xs text-neutral-300 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <button 
                        onClick={() => { if (!isPinningMode) setActiveTab('listings'); }}
                        className="px-4 py-2 bg-[#B99A74] text-[#171717] font-semibold rounded text-xs hover:bg-[#a3835e] transition-colors"
                      >
                        {project.id === 'proj-1' ? 'Explore Private Collection' : 'View Spec Sheets'}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-[#FAF8F4]">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-serif-heading text-lg text-[#171717] font-medium">Featured Showcases</h3>
                      <span className="text-xs text-[#77736D]">Showing 3 of 12</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        {
                          title: project.id === 'proj-1' ? 'Malibu Oceanfront Villa' : 'Eclipse Brass Pendant',
                          price: project.id === 'proj-1' ? '$18,500,000' : '$2,400',
                          img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400'
                        },
                        {
                          title: project.id === 'proj-1' ? 'Beverly Hills Modern Estate' : 'Linear Sconce No. 4',
                          price: project.id === 'proj-1' ? '$24,000,000' : '$1,850',
                          img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=400'
                        },
                        {
                          title: project.id === 'proj-1' ? 'Bel-Air Architectural Retreat' : 'Aura Chandelier Gold',
                          price: project.id === 'proj-1' ? '$31,200,000' : '$6,200',
                          img: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=400'
                        }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-white border border-[#E8E2D9] rounded-lg overflow-hidden group hover:border-[#B99A74] transition-all">
                          <div className="h-32 bg-neutral-200 relative overflow-hidden">
                            <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <span className="absolute top-2 right-2 bg-[#171717]/80 text-[#B99A74] text-[10px] font-semibold px-2 py-0.5 rounded">
                              {item.price}
                            </span>
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium text-xs text-[#171717]">{item.title}</h4>
                            <span className="text-[11px] text-[#77736D]">Full specs available · 2026 Edition</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'listings' && (
                <div className="p-6 bg-white min-h-[300px]">
                  <h3 className="font-serif-heading text-xl text-[#171717] mb-2 font-medium">Complete Collection & Filter Search</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 border border-[#E8E2D9] rounded bg-[#FAF8F4]">
                      <h4 className="font-medium text-xs mb-1">Oceanfront Malibu Sanctuary</h4>
                      <span className="text-xs text-[#77736D] block mb-2">6 Bed · 8 Bath · 9,400 sqft · $18.5M</span>
                      <button className="text-xs text-[#B99A74] font-medium hover:underline">View 3D Virtual Tour →</button>
                    </div>
                    <div className="p-4 border border-[#E8E2D9] rounded bg-[#FAF8F4]">
                      <h4 className="font-medium text-xs mb-1">Modern Beverly Crest Glass Residence</h4>
                      <span className="text-xs text-[#77736D] block mb-2">5 Bed · 7 Bath · 8,100 sqft · $24.0M</span>
                      <button className="text-xs text-[#B99A74] font-medium hover:underline">View Floor Plan PDF →</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="p-6 bg-[#FAF8F4] min-h-[300px]">
                  <h3 className="font-serif-heading text-xl text-[#171717] mb-2 font-medium">Private Advisory Inquiry</h3>
                  <div className="max-w-md bg-white p-4 rounded-lg border border-[#E8E2D9] space-y-3">
                    <div>
                      <label className="text-[11px] font-medium text-[#77736D] block mb-1">Full Name</label>
                      <input type="text" readOnly value="Elena Vance" className="w-full text-xs p-2 border border-[#E8E2D9] rounded bg-neutral-50 text-neutral-600" />
                    </div>
                    <button className="w-full py-2 bg-[#171717] text-[#B99A74] text-xs font-semibold rounded">
                      Submit Private Inquiry
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-[#171717] text-neutral-400 px-5 py-3 text-[11px] flex justify-between items-center border-t border-[#333333]">
                <span>© 2026 {project.projectName}. Powered by 1UpSites.</span>
                <span className="text-[#B99A74]">Preview Build v2.4</span>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Design Approval Modal */}
      {showApprovalSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-[#E8E2D9] shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif-heading text-xl font-semibold text-[#171717] mb-2">
              Website Design Approved!
            </h3>
            <p className="text-xs text-[#77736D] mb-4 leading-relaxed">
              Your formal design approval has been recorded in the project activity trail with timestamp <strong className="text-[#171717]">{new Date().toLocaleString()}</strong>.
            </p>
            <button
              onClick={() => setShowApprovalSuccessModal(false)}
              className="w-full py-2.5 bg-[#171717] hover:bg-[#262626] text-white font-medium text-xs rounded-lg transition-colors"
            >
              Continue to Portal
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
