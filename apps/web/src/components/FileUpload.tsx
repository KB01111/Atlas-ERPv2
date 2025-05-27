import React, { useRef, useState } from 'react';

interface UploadedDocument {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
}

interface FileUploadProps {
  onUploadSuccess?: (document: UploadedDocument) => void;
  onUploadError?: (error: string) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
}

export default function FileUpload({
  onUploadSuccess,
  onUploadError,
  acceptedTypes = ['*'],
  maxSize = 10,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      onUploadError?.(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    // Validate file type
    if (acceptedTypes.length > 0 && !acceptedTypes.includes('*')) {
      const fileType = file.type;
      const isValidType = acceptedTypes.some(
        type => type === fileType || fileType.startsWith(type.replace('*', ''))
      );

      if (!isValidType) {
        onUploadError?.(`File type not supported`);
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title || file.name);
      formData.append('description', description);
      formData.append('tags', tags);

      // Get auth token from localStorage
      const session = localStorage.getItem('supabase_session');
      const token = session ? JSON.parse(session).access_token : null;

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadProgress(100);
      onUploadSuccess?.(data.document);

      // Reset form
      setTitle('');
      setDescription('');
      setTags('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-card rounded-lg border'>
      <h3 className='text-lg font-semibold mb-4'>Upload Document</h3>

      {/* File metadata form */}
      <div className='space-y-4 mb-6'>
        <div>
          <label htmlFor='title' className='block text-sm font-medium mb-2'>
            Title (optional)
          </label>
          <input
            id='title'
            type='text'
            value={title}
            onChange={e => setTitle(e.target.value)}
            className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder='Document title'
          />
        </div>

        <div>
          <label htmlFor='description' className='block text-sm font-medium mb-2'>
            Description (optional)
          </label>
          <textarea
            id='description'
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder='Document description'
          />
        </div>

        <div>
          <label htmlFor='tags' className='block text-sm font-medium mb-2'>
            Tags (optional)
          </label>
          <input
            id='tags'
            type='text'
            value={tags}
            onChange={e => setTags(e.target.value)}
            className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder='tag1, tag2, tag3'
          />
        </div>
      </div>

      {/* Drag and drop area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type='file'
          onChange={handleFileSelect}
          className='hidden'
          accept={acceptedTypes.join(',')}
        />

        {isUploading ? (
          <div className='space-y-4'>
            <div className='text-lg font-medium'>Uploading...</div>
            <div className='w-full bg-secondary rounded-full h-2'>
              <div
                className='bg-primary h-2 rounded-full transition-all duration-300'
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className='text-sm text-muted-foreground'>{uploadProgress}%</div>
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='text-4xl'>📁</div>
            <div>
              <p className='text-lg font-medium'>Drop files here or click to browse</p>
              <p className='text-sm text-muted-foreground mt-2'>Maximum file size: {maxSize}MB</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className='bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors'
            >
              Choose File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
