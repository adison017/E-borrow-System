import { useState } from 'react';
import {
  DocumentIcon,
  PhotoIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const DocumentViewer = ({ documents = [], title = "เอกสารแนบ" }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  if (!documents || documents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <DocumentIcon className="h-5 w-5 text-blue-600" />
            {title}
          </h3>
        </div>
        <div className="p-8 text-center">
          <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">ไม่มีเอกสารแนบ</p>
        </div>
      </div>
    );
  }

  const getFileIcon = (filename, mimeType) => {
    const extension = filename.split('.').pop()?.toLowerCase();

    if (mimeType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return <PhotoIcon className="h-6 w-6 text-green-600" />;
    } else if (mimeType === 'application/pdf' || extension === 'pdf') {
      return <DocumentTextIcon className="h-6 w-6 text-red-600" />;
    } else if (['doc', 'docx'].includes(extension)) {
      return <DocumentTextIcon className="h-6 w-6 text-blue-600" />;
    } else if (['xls', 'xlsx'].includes(extension)) {
      return <DocumentTextIcon className="h-6 w-6 text-green-700" />;
    } else if (['ppt', 'pptx'].includes(extension)) {
      return <DocumentTextIcon className="h-6 w-6 text-orange-600" />;
    } else if (['txt', 'rtf', 'md'].includes(extension)) {
      return <DocumentTextIcon className="h-6 w-6 text-gray-600" />;
    } else {
      return <DocumentIcon className="h-6 w-6 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleViewDocument = (doc) => {
    setSelectedDocument(doc);
    setShowViewer(true);
  };

  const handleDownloadDocument = (doc) => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000/${doc.file_path}`;
    link.download = doc.original_name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isPdfFile = (doc) => {
    const extension = doc.original_name.split('.').pop()?.toLowerCase();
    return extension === 'pdf' || doc.mime_type === 'application/pdf';
  };

  const canPreviewFile = (doc) => {
    return isPdfFile(doc);
  };

  const renderFilePreview = (doc) => {
    if (isPdfFile(doc)) {
      return (
        <div className="w-full h-full">
          <iframe
            src={`http://localhost:5000/${doc.file_path}`}
            className="w-full h-full min-h-[600px] border-0 rounded-lg"
            title={doc.original_name}
          />
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <DocumentIcon className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">ไม่สามารถแสดงตัวอย่างไฟล์นี้ได้</p>
          <button
            onClick={() => handleDownloadDocument(doc)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            ดาวน์โหลดไฟล์
          </button>
        </div>
      );
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <DocumentIcon className="h-5 w-5 text-blue-600" />
            {title}
            <span className="text-sm font-normal text-gray-500">
              ({documents.length} ไฟล์)
            </span>
          </h3>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(doc.original_name, doc.mime_type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.original_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(doc.file_size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {canPreviewFile(doc) && (
                    <button
                      onClick={() => handleViewDocument(doc)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="ดูไฟล์"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDownloadDocument(doc)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="ดาวน์โหลด"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {showViewer && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl max-h-[95vh] w-full overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {selectedDocument.original_name}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadDocument(selectedDocument)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="ดาวน์โหลด"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowViewer(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-auto max-h-[calc(95vh-120px)]">
              {renderFilePreview(selectedDocument)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentViewer;