import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Trash2, Share2, Eye, PenTool, X, CheckCircle, Clock, FileCheck } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import SignatureCanvas from 'react-signature-canvas';

type DocStatus = 'Draft' | 'In Review' | 'Signed';

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  status: DocStatus;
  previewUrl?: string;
}

const initialDocuments: Document[] = [
  { id: 1, name: 'Pitch Deck 2024.pdf', type: 'PDF', size: '2.4 MB', lastModified: '2024-02-15', shared: true, status: 'Signed' },
  { id: 2, name: 'Financial Projections.xlsx', type: 'Spreadsheet', size: '1.8 MB', lastModified: '2024-02-10', shared: false, status: 'In Review' },
  { id: 3, name: 'Business Plan.docx', type: 'Document', size: '3.2 MB', lastModified: '2024-02-05', shared: true, status: 'Draft' },
  { id: 4, name: 'Market Research.pdf', type: 'PDF', size: '5.1 MB', lastModified: '2024-01-28', shared: false, status: 'In Review' },
];

const statusConfig = {
  Draft: { color: 'bg-gray-100 text-gray-700', icon: <Clock size={12} /> },
  'In Review': { color: 'bg-yellow-100 text-yellow-700', icon: <Clock size={12} /> },
  Signed: { color: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} /> },
};

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [activeTab, setActiveTab] = useState<'all' | 'chamber'>('all');
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [signDoc, setSignDoc] = useState<Document | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isSigned, setIsSigned] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadFile(file);
  };

  const handleUpload = () => {
    if (!uploadFile) return;
    const newDoc: Document = {
      id: Date.now(),
      name: uploadFile.name,
      type: uploadFile.name.split('.').pop()?.toUpperCase() || 'File',
      size: `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB`,
      lastModified: new Date().toISOString().split('T')[0],
      shared: false,
      status: 'Draft',
      previewUrl: uploadFile.type === 'application/pdf' ? URL.createObjectURL(uploadFile) : undefined,
    };
    setDocuments([newDoc, ...documents]);
    setUploadFile(null);
    setShowUploadModal(false);
  };

  // Delete handler
  const handleDelete = (id: number) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  // Status change
  const handleStatusChange = (id: number, status: DocStatus) => {
    setDocuments(documents.map(d => d.id === id ? { ...d, status } : d));
  };

  // Signature
  const handleSign = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      if (signDoc) {
        handleStatusChange(signDoc.id, 'Signed');
        setIsSigned(true);
        setTimeout(() => {
          setSignDoc(null);
          setIsSigned(false);
        }, 1500);
      }
    }
  };

  const clearSignature = () => sigCanvas.current?.clear();

  const chamberDocs = documents.filter(d => d.status !== 'Draft' || d.type === 'PDF');

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-2 sm:p-0">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 text-sm">Manage your startup's important files</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium w-full sm:w-auto"
        >
          <Upload size={16} /> Upload Document
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
        >
          📁 All Documents
        </button>
        <button
          onClick={() => setActiveTab('chamber')}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'chamber' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
        >
          🔐 Document Chamber
        </button>
      </div>

      {/* All Documents Tab */}
      {activeTab === 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">

          {/* Storage Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Storage</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Used</span>
                  <span className="font-medium text-gray-900">12.5 GB</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available</span>
                  <span className="font-medium text-gray-900">7.5 GB</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Access</h3>
                <div className="space-y-1">
                  {['Recent Files', 'Shared with Me', 'Starred', 'Trash'].map(item => (
                    <button key={item} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Summary */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Status Summary</h3>
                <div className="space-y-2">
                  {(['Draft', 'In Review', 'Signed'] as DocStatus[]).map(s => (
                    <div key={s} className="flex justify-between items-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${statusConfig[s].color}`}>
                        {statusConfig[s].icon} {s}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {documents.filter(d => d.status === s).length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Document List */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <h2 className="text-lg font-medium text-gray-900">All Documents</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Sort by</Button>
                  <Button variant="outline" size="sm">Filter</Button>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center p-3 sm:p-4 hover:bg-gray-50 rounded-lg transition-colors gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg w-fit">
                        <FileText size={24} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h3>
                          {doc.shared && <Badge variant="secondary" size="sm">Shared</Badge>}
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${statusConfig[doc.status].color}`}>
                            {statusConfig[doc.status].icon} {doc.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-500">
                          <span>{doc.type}</span>
                          <span>{doc.size}</span>
                          <span>Modified {doc.lastModified}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-wrap">
                        {/* Status Change */}
                        <select
                          value={doc.status}
                          onChange={e => handleStatusChange(doc.id, e.target.value as DocStatus)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option>Draft</option>
                          <option>In Review</option>
                          <option>Signed</option>
                        </select>
                        <button onClick={() => setPreviewDoc(doc)} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Preview">
                          <Eye size={16} className="text-gray-600" />
                        </button>
                        <button onClick={() => setSignDoc(doc)} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Sign">
                          <PenTool size={16} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="Download">
                          <Download size={16} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="Share">
                          <Share2 size={16} className="text-gray-600" />
                        </button>
                        <button onClick={() => handleDelete(doc.id)} className="p-2 hover:bg-red-50 rounded-lg transition" title="Delete">
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* Document Chamber Tab */}
      {activeTab === 'chamber' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <FileCheck size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800">Document Chamber</p>
              <p className="text-xs text-blue-600 mt-0.5">Upload, preview, sign and track status of all deal-related documents here.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map(doc => (
              <div key={doc.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[140px]">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.size}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${statusConfig[doc.status].color}`}>
                    {statusConfig[doc.status].icon} {doc.status}
                  </span>
                </div>

                {/* Status Progress */}
                <div className="flex items-center gap-1">
                  {(['Draft', 'In Review', 'Signed'] as DocStatus[]).map((s, i) => (
                    <React.Fragment key={s}>
                      <div className={`h-1.5 flex-1 rounded-full ${
                        doc.status === 'Draft' && i === 0 ? 'bg-gray-400' :
                        doc.status === 'In Review' && i <= 1 ? 'bg-yellow-400' :
                        doc.status === 'Signed' ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    </React.Fragment>
                  ))}
                </div>
                <p className="text-xs text-gray-400">Modified {doc.lastModified}</p>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="flex-1 flex items-center justify-center gap-1 border border-gray-200 text-gray-600 py-1.5 rounded-lg text-xs hover:bg-gray-50 transition"
                  >
                    <Eye size={13} /> Preview
                  </button>
                  <button
                    onClick={() => setSignDoc(doc)}
                    className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white py-1.5 rounded-lg text-xs hover:bg-blue-700 transition"
                  >
                    <PenTool size={13} /> Sign
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-5 w-full sm:max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Upload Document</h2>
              <button onClick={() => setShowUploadModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
            >
              <Upload size={32} className="text-gray-400 mx-auto mb-2" />
              {uploadFile ? (
                <p className="text-sm font-medium text-blue-600">{uploadFile.name}</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-700">Click to upload</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOCX, XLSX supported</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xlsx"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowUploadModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleUpload} disabled={!uploadFile} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm hover:bg-blue-700 transition font-medium disabled:opacity-50">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">{previewDoc.name}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[previewDoc.status].color}`}>
                  {previewDoc.status}
                </span>
              </div>
              <button onClick={() => setPreviewDoc(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {previewDoc.previewUrl ? (
                <iframe src={previewDoc.previewUrl} className="w-full h-96 rounded-lg border border-gray-200" title="Document Preview" />
              ) : (
                <div className="w-full h-64 bg-gray-50 rounded-xl flex flex-col items-center justify-center border border-gray-200">
                  <FileText size={48} className="text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500 font-medium">{previewDoc.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{previewDoc.type} · {previewDoc.size}</p>
                  <p className="text-xs text-gray-400 mt-3">Preview available for uploaded PDF files only</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-2">
              <button onClick={() => { setSignDoc(previewDoc); setPreviewDoc(null); }} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition font-medium flex items-center justify-center gap-1">
                <PenTool size={14} /> Sign Document
              </button>
              <button onClick={() => setPreviewDoc(null)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {signDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-5 w-full sm:max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Sign Document</h2>
              <button onClick={() => setSignDoc(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Signing: <span className="font-medium text-gray-900">{signDoc.name}</span>
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="#1d4ed8"
                canvasProps={{ className: 'w-full', height: 160 }}
              />
            </div>
            <p className="text-xs text-gray-400 text-center mt-1">Draw your signature above</p>

            {isSigned && (
              <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 py-2 rounded-lg mt-3">
                <CheckCircle size={16} /> Document signed successfully!
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button onClick={clearSignature} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition">
                Clear
              </button>
              <button onClick={handleSign} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm hover:bg-blue-700 transition font-medium">
                Confirm Sign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};