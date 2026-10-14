import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { FileCategory, ProjectFile, ProjectFolder } from '../../types/portal';
import { 
  FolderOpen, FolderPlus, Upload, Trash2, Search, 
  Image as ImageIcon, Link as LinkIcon, Folder, Edit3, 
  ArrowLeft, ChevronRight, MoveRight, X, Sparkles 
} from 'lucide-react';

export const ClientProjectFiles: React.FC = () => {
  const { 
    clients, activeClientId, projects, files, folders, revisions, 
    addFile, deleteFile, addFolder, renameFolder, deleteFolder, moveFileToFolder 
  } = usePortal();

  const client = clients.find(c => c.id === activeClientId) || clients[0];
  const project = projects.find(p => p.clientId === client.id) || projects[0];
  
  const clientFiles = files.filter(f => f.projectId === project?.id);
  const clientFolders = folders.filter(f => f.projectId === project?.id);
  const clientRevisions = revisions.filter(r => r.projectId === project?.id);

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Navigation inside a specific folder
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [movingFile, setMovingFile] = useState<ProjectFile | null>(null);
  const [renamingFolder, setRenamingFolder] = useState<ProjectFolder | null>(null);

  // Form States
  const [fileName, setFileName] = useState('');
  const [fileCategory, setFileCategory] = useState<FileCategory>('Client Photography');
  const [targetFolderForUpload, setTargetFolderForUpload] = useState<string>('');

  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderCategory, setNewFolderCategory] = useState<FileCategory>('Client Photography');
  const [renameInput, setRenameInput] = useState('');

  if (!project) return null;

  const currentFolder = clientFolders.find(f => f.id === activeFolderId);

  // Filtering Folders & Files
  const filteredFolders = clientFolders.filter(f => {
    if (activeFolderId) return false; // Don't show folder list inside another folder
    const matchesCat = categoryFilter === 'ALL' || f.category === categoryFilter;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredFiles = clientFiles.filter(f => {
    // If inside a folder, show files in that folder
    if (activeFolderId) {
      const matchesFolder = f.folderId === activeFolderId;
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFolder && matchesSearch;
    }

    // If viewing root category list, show loose files (files without folder or matching search)
    const matchesCat = categoryFilter === 'ALL' || f.category === categoryFilter;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // When searching, show all matching files across folders. Otherwise show loose files without a folder in category view!
    if (searchQuery.trim().length > 0) {
      return matchesCat && matchesSearch;
    }

    return matchesCat && !f.folderId;
  });

  // Handlers
  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName) return;

    addFolder({
      projectId: project.id,
      name: newFolderName,
      category: newFolderCategory
    });

    setNewFolderName('');
    setShowFolderModal(false);
  };

  const handleRenameFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingFolder || !renameInput) return;

    renameFolder(renamingFolder.id, renameInput);
    setRenamingFolder(null);
  };

  const handleDeleteFolderClick = (folder: ProjectFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    const count = clientFiles.filter(f => f.folderId === folder.id).length;
    
    if (confirm(`Delete folder "${folder.name}"? ${count > 0 ? `${count} file(s) inside will be moved out to loose files.` : ''}`)) {
      deleteFolder(folder.id);
      if (activeFolderId === folder.id) {
        setActiveFolderId(null);
      }
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;

    const assignedFolder = targetFolderForUpload || activeFolderId || undefined;

    addFile({
      projectId: project.id,
      folderId: assignedFolder,
      name: fileName.endsWith('.jpg') || fileName.endsWith('.png') || fileName.endsWith('.pdf') ? fileName : `${fileName}.jpg`,
      category: fileCategory,
      uploadedBy: 'Client',
      size: '4.8 MB',
      type: 'image/jpeg',
      previewUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
      isTemporary: true
    });

    setFileName('');
    setShowUploadModal(false);
  };

  const handleMoveFileSubmit = (targetFoldId: string | undefined) => {
    if (!movingFile) return;
    moveFileToFolder(movingFile.id, targetFoldId);
    setMovingFile(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D9]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B99A74] font-semibold block mb-1">
            Shared Media & Assets Library
          </span>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
            Project Files
          </h1>
        </div>

        {/* Action Buttons: New Folder & Upload File */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              setNewFolderCategory(categoryFilter !== 'ALL' ? (categoryFilter as FileCategory) : 'Client Photography');
              setShowFolderModal(true);
            }}
            className="px-3.5 py-2.5 bg-white border border-[#E8E2D9] hover:border-[#B99A74] text-[#171717] text-xs font-semibold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
          >
            <FolderPlus className="w-4 h-4 text-[#B99A74]" />
            New Folder
          </button>

          <button
            onClick={() => {
              setFileCategory(categoryFilter !== 'ALL' ? (categoryFilter as FileCategory) : 'Client Photography');
              setTargetFolderForUpload(activeFolderId || '');
              setShowUploadModal(true);
            }}
            className="px-4 py-2.5 bg-[#171717] hover:bg-[#262626] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-[#B99A74]" />
            Upload New File
          </button>
        </div>
      </div>

      {/* Breadcrumb Navigation when viewing inside a folder */}
      {currentFolder && (
        <div className="flex items-center gap-2 p-3 bg-[#FAF8F4] border border-[#E8E2D9] rounded-xl text-xs">
          <button
            onClick={() => setActiveFolderId(null)}
            className="flex items-center gap-1 font-semibold text-[#B99A74] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Files</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[#77736D]">{currentFolder.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="font-bold text-[#171717] flex items-center gap-1.5">
            <Folder className="w-4 h-4 text-[#B99A74]" />
            {currentFolder.name}
          </span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <div className="flex items-center gap-1 p-1 bg-white border border-[#E8E2D9] rounded-lg overflow-x-auto text-xs">
          {['ALL', 'Client Photography', 'Branding & Logos', 'Inspiration & References', 'Documents', 'Other Files'].map(cat => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                setActiveFolderId(null);
              }}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors whitespace-nowrap ${
                categoryFilter === cat && !activeFolderId ? 'bg-[#171717] text-white' : 'text-[#77736D] hover:text-[#171717]'
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
            placeholder="Search filenames or folders..."
            className="w-full bg-white border border-[#E8E2D9] rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#B99A74]"
          />
        </div>
      </div>

      {/* Main Grid: Render Folders FIRST, then Files */}
      <div className="space-y-6">
        
        {/* FOLDERS SECTION */}
        {filteredFolders.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#77736D]">
              Folders ({filteredFolders.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFolders.map((folder) => {
                const folderFiles = clientFiles.filter(f => f.folderId === folder.id);

                return (
                  <div
                    key={folder.id}
                    onClick={() => setActiveFolderId(folder.id)}
                    className="p-4 bg-white border border-[#E8E2D9] hover:border-[#B99A74] rounded-xl shadow-2xs transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="p-2.5 bg-[#FAF8F4] group-hover:bg-[#171717] rounded-lg border border-[#E8E2D9] transition-colors shrink-0">
                        <Folder className="w-5 h-5 text-[#B99A74]" />
                      </div>
                      <div className="truncate">
                        <h4 className="font-semibold text-xs text-[#171717] group-hover:text-[#B99A74] transition-colors truncate">
                          {folder.name}
                        </h4>
                        <span className="text-[10px] text-[#77736D] block">
                          {folderFiles.length} file(s) · {folder.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingFolder(folder);
                          setRenameInput(folder.name);
                        }}
                        className="p-1 text-neutral-400 hover:text-[#171717] rounded"
                        title="Rename folder"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => handleDeleteFolderClick(folder, e)}
                        className="p-1 text-neutral-400 hover:text-rose-600 rounded"
                        title="Delete folder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FILES SECTION */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#77736D]">
              {activeFolderId ? `Files in "${currentFolder?.name}"` : `Files (${filteredFiles.length})`}
            </h3>
          </div>

          {filteredFiles.length === 0 && filteredFolders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-[#E8E2D9] p-6 text-xs text-[#77736D]">
              No files found in this category or folder. Click "Upload New File" or "New Folder" to add assets.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file) => {
                const referencingRevisions = clientRevisions.filter(r => r.attachedFileIds?.includes(file.id));
                const fileFolder = clientFolders.find(fold => fold.id === file.folderId);

                return (
                  <div key={file.id} className="bg-white border border-[#E8E2D9] rounded-xl p-4 shadow-2xs space-y-3 relative group hover:border-[#B99A74] transition-all">
                    <div className="h-36 bg-neutral-100 rounded-lg overflow-hidden relative">
                      <img src={file.previewUrl} alt={file.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 bg-[#171717]/80 text-white text-[10px] px-2 py-0.5 rounded font-semibold">
                        {file.category}
                      </span>
                      {fileFolder && (
                        <span className="absolute top-2 left-2 bg-[#B99A74] text-[#171717] text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                          <Folder className="w-3 h-3" /> {fileFolder.name}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-xs">
                      <h4 className="font-semibold text-[#171717] truncate">{file.name}</h4>
                      
                      {/* Referencing Revision Badge */}
                      {referencingRevisions.length > 0 ? (
                        <div className="flex items-center gap-1.5 text-[10px] text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <LinkIcon className="w-3 h-3 text-amber-700 shrink-0" />
                          <span>Used in {referencingRevisions.map(r => r.id).join(', ')}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-neutral-400 block">Available for revisions</span>
                      )}

                      <div className="flex justify-between text-[10px] text-[#77736D] pt-1">
                        <span>{file.size}</span>
                        <span>Uploaded {file.uploadDate}</span>
                      </div>
                    </div>

                    {/* Move & Delete Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D9] text-[11px]">
                      <button
                        onClick={() => setMovingFile(file)}
                        className="text-[#B99A74] hover:underline font-medium flex items-center gap-1"
                      >
                        <MoveRight className="w-3 h-3" />
                        <span>Move to Folder</span>
                      </button>

                      <button
                        onClick={() => deleteFile(file.id)}
                        className="p-1 text-rose-500 hover:text-rose-700 transition-colors"
                        title="Remove asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* CREATE FOLDER MODAL */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E2D9] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8E2D9]">
              <h3 className="font-serif-heading text-lg font-semibold text-[#171717]">Create New Folder</h3>
              <button onClick={() => setShowFolderModal(false)} className="text-neutral-400 hover:text-[#171717]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFolderSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#77736D] mb-1 font-semibold">Folder Name *</label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Malibu Oceanfront Photos"
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-lg focus:border-[#B99A74] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#77736D] mb-1 font-semibold">Asset Category</label>
                <select
                  value={newFolderCategory}
                  onChange={(e) => setNewFolderCategory(e.target.value as FileCategory)}
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-lg focus:border-[#B99A74] focus:outline-none"
                >
                  <option value="Client Photography">Client Photography</option>
                  <option value="Branding & Logos">Branding & Logos</option>
                  <option value="Inspiration & References">Inspiration & References</option>
                  <option value="Documents">Documents</option>
                  <option value="Other Files">Other Files</option>
                </select>
              </div>

              <div className="p-3 bg-[#FAF8F4] rounded-lg border border-[#E8E2D9] text-[11px] text-[#77736D]">
                Folders allow organizing project photos, brand decks, and references into clean single-level collections.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="px-4 py-2 border border-[#E8E2D9] rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#171717] text-white text-xs font-semibold rounded-lg">
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENAME FOLDER MODAL */}
      {renamingFolder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E2D9] shadow-2xl space-y-4">
            <h3 className="font-serif-heading text-lg font-semibold text-[#171717]">Rename Folder</h3>
            <form onSubmit={handleRenameFolderSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#77736D] mb-1 font-semibold">New Folder Name *</label>
                <input
                  type="text"
                  required
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-lg focus:border-[#B99A74] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setRenamingFolder(null)}
                  className="px-4 py-2 border border-[#E8E2D9] rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#171717] text-white font-semibold rounded-lg">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOVE FILE MODAL */}
      {movingFile && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E2D9] shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E2D9]">
              <h3 className="font-serif-heading text-lg font-semibold text-[#171717]">Move File to Folder</h3>
              <button onClick={() => setMovingFile(null)} className="text-neutral-400 hover:text-[#171717]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#77736D]">
              Moving <strong className="text-[#171717]">{movingFile.name}</strong> will reorganize it without changing its revision linkages.
            </p>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => handleMoveFileSubmit(undefined)}
                className={`w-full p-3 rounded-xl border text-left font-medium flex items-center justify-between ${
                  !movingFile.folderId ? 'border-[#B99A74] bg-[#FAF8F4]' : 'border-[#E8E2D9] hover:bg-neutral-50'
                }`}
              >
                <span>Loose File (No Folder)</span>
                {!movingFile.folderId && <span className="text-[10px] font-bold text-[#B99A74]">Current Location</span>}
              </button>

              {clientFolders.map(fold => (
                <button
                  key={fold.id}
                  onClick={() => handleMoveFileSubmit(fold.id)}
                  className={`w-full p-3 rounded-xl border text-left font-medium flex items-center justify-between ${
                    movingFile.folderId === fold.id ? 'border-[#B99A74] bg-[#FAF8F4]' : 'border-[#E8E2D9] hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-[#B99A74]" />
                    <span>{fold.name} ({fold.category})</span>
                  </div>
                  {movingFile.folderId === fold.id && <span className="text-[10px] font-bold text-[#B99A74]">Current Location</span>}
                </button>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setMovingFile(null)}
                className="px-4 py-2 border border-[#E8E2D9] rounded-lg text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD FILE MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E2D9] shadow-2xl space-y-4">
            <h3 className="font-serif-heading text-lg font-semibold text-[#171717]">Upload Project File</h3>
            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#77736D] mb-1 font-semibold">File Name *</label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. HighRes_Malibu_Exterior_01.jpg"
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-lg focus:border-[#B99A74] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#77736D] mb-1 font-semibold">Asset Category</label>
                <select
                  value={fileCategory}
                  onChange={(e) => setFileCategory(e.target.value as FileCategory)}
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-lg focus:border-[#B99A74] focus:outline-none"
                >
                  <option value="Client Photography">Client Photography</option>
                  <option value="Branding & Logos">Branding & Logos</option>
                  <option value="Inspiration & References">Inspiration & References</option>
                  <option value="Documents">Documents</option>
                  <option value="Other Files">Other Files</option>
                </select>
              </div>

              <div>
                <label className="block text-[#77736D] mb-1 font-semibold">Target Folder (Optional)</label>
                <select
                  value={targetFolderForUpload}
                  onChange={(e) => setTargetFolderForUpload(e.target.value)}
                  className="w-full p-2.5 border border-[#E8E2D9] rounded-lg focus:border-[#B99A74] focus:outline-none"
                >
                  <option value="">Loose File (No Folder)</option>
                  {clientFolders.map(fold => (
                    <option key={fold.id} value={fold.id}>
                      Folder: {fold.name} ({fold.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-[#FAF8F4] rounded-lg border border-[#E8E2D9] text-[11px] text-[#77736D]">
                Uploaded files are immediately saved to your shared asset library and accessible in revision requests.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D9]">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-[#E8E2D9] rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#171717] text-white text-xs font-semibold rounded-lg">
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
