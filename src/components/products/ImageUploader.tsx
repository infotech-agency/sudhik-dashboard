import { useRef, useState } from 'react';
import { Upload, X, ImagePlus } from 'lucide-react';

export function ImageUploader({
  existingImages = [],
  onFilesChange,
  max = 5,
}: {
  existingImages?: string[];
  onFilesChange: (files: File[]) => void;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  const remaining = max - existingImages.length - files.length;

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const arr = Array.from(newFiles)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, remaining);
    setFiles((prev) => [...prev, ...arr]);
    setPreviews((prev) => [...prev, ...arr.map((f) => URL.createObjectURL(f))]);
    onFilesChange([...files, ...arr]);
  };

  const removeNew = (idx: number) => {
    URL.revokeObjectURL(previews[idx]);
    const nextFiles = files.filter((_, i) => i !== idx);
    const nextPreviews = previews.filter((_, i) => i !== idx);
    setFiles(nextFiles);
    setPreviews(nextPreviews);
    onFilesChange(nextFiles);
  };

  return (
    <div>
      <label className="label-field">Product Images (max {max})</label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-colors ${
          dragging ? 'border-gold-500 bg-gold-50' : 'border-maroon-200 bg-cream-50 hover:bg-cream-100'
        }`}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon-50 text-maroon-600">
          <Upload className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-maroon-700">
          Drag & drop or <span className="text-gold-600">browse</span>
        </p>
        <p className="text-xs text-maroon-400">PNG, JPG up to {max} images</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {(existingImages.length > 0 || previews.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-3">
          {existingImages.map((url, i) => (
            <div key={`ex-${i}`} className="relative h-20 w-20 overflow-hidden rounded-lg border border-maroon-100">
              <img src={url} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
          {previews.map((src, i) => (
            <div key={`new-${i}`} className="relative h-20 w-20 overflow-hidden rounded-lg border border-maroon-100">
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeNew(i);
                }}
                className="absolute right-1 top-1 rounded-full bg-maroon-900/70 p-0.5 text-white hover:bg-maroon-900"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {remaining > 0 && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-maroon-200 text-maroon-300 hover:border-maroon-400 hover:text-maroon-500"
            >
              <ImagePlus className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
