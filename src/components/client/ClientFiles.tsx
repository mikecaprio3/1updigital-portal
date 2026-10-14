import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { FileCategory } from '../../types/portal';
import { FolderOpen, Upload, Trash2, Image, FileText, CheckCircle2 } from 'lucide-react';

export const ClientFiles: React.FC = () => {
  const { clients, activeClientId, projects, files, addFile, deleteFile } = usePortal();

  const client = clients.find(c => c.id === activeClientId) || clients[0];
  const project = projects.find(p => p.clientId === client.id) || projects[0];
  const clientFiles = files.filter(f => f.projectId === project?.id);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState<FileCategory>('Client Photography');

  if (!project) return null;

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;

    addFile({
      projectId: project.id,
      name: fileName.endsWith('.jpg') || fileName.endsWith('.png') ? fileName : `${fileName}.jpg`,
      category,
      uploadedBy: 'Client',
      size: '4.8 MB',
      type: 'image/jpeg',
      previewUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
      isTemporary: true
    });

    setFileName('');
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B99A74] font-semibold block mb-1">
            Media & Creative Assets
          </span>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
            Project Assets & Photos
          </h1>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 bg-[#171717] hover:bg-[#262626] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Upload className="w-4 h-4 text-[#B99A74]" />
          Upload New Photos
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientFiles.map((file) => (
          <div key={file.id} className="bg-white border border-[#E8E2D9] rounded-xl p-4 shadow-2xs space-y-3 relative group">
            <div className="h-36 bg-neutral-100 rounded-lg overflow-hidden relative">
              <img src={file.previewUrl} alt={file.name} className="w-full h-full object-cover" />
              <span className="absolute bottom-2 left-2 bg-[#171717]/80 text-white text-[10px] px-2 py-0.5 rounded font-semibold">
                {file.category}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <h4 className="font-semibold text-[#171717] truncate">{file.name}</h4>
              <div className="flex justify-between text-[10px] text-[#77736D]">
                <span>{file.size}</span>
                <span>Uploaded {file.uploadDate}</span>
              </div>
            </div>

            <button
              onClick={() => deleteFile(file.id)}
              className="p-1 text-rose-500 hover:text-rose-700 transition-colors absolute top-2 right-2 bg-white/90 rounded border border-[#E8E2D9]"
              title="Remove asset"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-[#E8E2D9] shadow-2xl space-y-4">
            <h3 className="font-serif-heading text-lg font-semibold text-[#171717]">Upload Assets</h3>
            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#77736D] mb-1">File Name</label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. HighRes_Malibu_Exterior_01.jpg"
                  className="w-full p-2 border border-[#E8E2D9] rounded focus:border-[#B99A74] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#77736D] mb-1">Asset Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FileCategory)}
                  className="w-full p-2 border border-[#E8E2D9] rounded focus:border-[#B99A74] focus:outline-none"
                >
                  <option value="Client Photography">Client Photography</option>
                  <option value="Branding & Logos">Branding & Logos</option>
                  <option value="Inspiration & References">Inspiration & References</option>
                  <option value="Documents">Documents</option>
                  <option value="Other Files">Other Files</option>
                </select>
              </div>

              <div className="p-3 bg-[#FAF8F4] rounded border border-[#E8E2D9] text-[11px] text-[#77736D]">
                Temporary in-browser storage active for prototype preview.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 border border-[#E8E2D9] rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-[#171717] text-white rounded font-medium">
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
