import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { FileCategory } from '../../types/portal';
import { FolderOpen, Search, Upload, Trash2, Image, FileText, Download } from 'lucide-react';

export const AdminFiles: React.FC = () => {
  const { files, projects, deleteFile, addFile } = usePortal();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileCategory, setFileCategory] = useState<FileCategory>('Client Photography');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');

  const filteredFiles = files.filter(f => {
    const matchesCat = categoryFilter === 'ALL' || f.category === categoryFilter;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;

    addFile({
      projectId: selectedProjectId,
      name: fileName,
      category: fileCategory,
      uploadedBy: '1UpSites Admin',
      size: '3.1 MB',
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
            Global Creative Asset Repository
          </span>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
            Files & Assets
          </h1>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-[#171717] hover:bg-[#262626] text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-2 shadow-xs self-start sm:self-auto"
        >
          <Upload className="w-4 h-4 text-[#B99A74]" />
          Upload New File
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <div className="flex items-center gap-1 p-1 bg-white border border-[#E8E2D9] rounded-lg overflow-x-auto text-xs">
          {['ALL', 'Client Photography', 'Branding & Logos', 'Inspiration & References', 'Documents', 'Other Files'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded font-medium transition-colors whitespace-nowrap ${
                categoryFilter === cat ? 'bg-[#171717] text-white' : 'text-[#77736D] hover:text-[#171717]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search filenames..."
            className="w-full bg-white border border-[#E8E2D9] rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#B99A74]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredFiles.map((file) => {
          const proj = projects.find(p => p.id === file.projectId);

          return (
            <div key={file.id} className="bg-white border border-[#E8E2D9] rounded-xl p-4 shadow-2xs space-y-3 relative group hover:border-[#B99A74] transition-all">
              <div className="h-32 bg-neutral-100 rounded-lg overflow-hidden relative">
                <img src={file.previewUrl} alt={file.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 bg-[#171717]/80 text-white text-[10px] px-2 py-0.5 rounded font-semibold">
                  {file.category}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <h4 className="font-semibold text-[#171717] truncate" title={file.name}>{file.name}</h4>
                <span className="text-[10px] text-[#77736D] block truncate">Project: {proj?.projectName}</span>
                <div className="flex justify-between text-[10px] text-neutral-400">
                  <span>{file.size}</span>
                  <span>{file.uploadDate}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[#E8E2D9]">
                <span className="text-[10px] text-neutral-500">By {file.uploadedBy}</span>
                <button
                  onClick={() => deleteFile(file.id)}
                  className="p-1 text-rose-500 hover:text-rose-700 transition-colors"
                  title="Delete file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-[#E8E2D9] shadow-2xl space-y-4">
            <h3 className="font-serif-heading text-lg font-semibold text-[#171717]">Upload Asset</h3>
            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#77736D] mb-1">Target Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full p-2 border border-[#E8E2D9] rounded focus:border-[#B99A74] focus:outline-none"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.projectName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#77736D] mb-1">File Name</label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. Logo_Vector_Gold.png"
                  className="w-full p-2 border border-[#E8E2D9] rounded focus:border-[#B99A74] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#77736D] mb-1">Category</label>
                <select
                  value={fileCategory}
                  onChange={(e) => setFileCategory(e.target.value as FileCategory)}
                  className="w-full p-2 border border-[#E8E2D9] rounded focus:border-[#B99A74] focus:outline-none"
                >
                  <option value="Client Photography">Client Photography</option>
                  <option value="Branding & Logos">Branding & Logos</option>
                  <option value="Inspiration & References">Inspiration & References</option>
                  <option value="Documents">Documents</option>
                  <option value="Other Files">Other Files</option>
                </select>
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
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
