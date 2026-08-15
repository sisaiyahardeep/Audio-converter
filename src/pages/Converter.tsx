import React, { useState, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { getConversionPair } from '../data/formats';
import { useFFmpeg } from '../hooks/useFFmpeg';
import { 
  ArrowRight, 
  UploadCloud, 
  FileAudio, 
  Settings, 
  Download, 
  RotateCcw, 
  AlertCircle, 
  X,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Converter() {
  const { pairId } = useParams<{ pairId: string }>();
  const pair = getConversionPair(pairId || '');
  
  const { loaded, isLoading, error: ffmpegError, progress, convertFile } = useFFmpeg();

  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedData, setConvertedData] = useState<{ url: string; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Advanced Settings
  const [showSettings, setShowSettings] = useState(false);
  const [bitrate, setBitrate] = useState('192k');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      
      // Basic size validation (e.g., max 100MB to prevent memory issues)
      if (selectedFile.size > 100 * 1024 * 1024) {
        setError('File is too large. Maximum size is 100MB.');
        return;
      }
      
      setFile(selectedFile);
      setConvertedData(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.flac', '.wav', '.aiff', '.aac']
    },
    maxFiles: 1,
    multiple: false
  } as any);

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setError(null);
    setConvertedData(null);
  };

  const handleConvert = async () => {
    if (!file || !pair || !loaded) return;

    setIsConverting(true);
    setError(null);
    setConvertedData(null);

    try {
      const result = await convertFile(file, pair.to, { bitrate });
      setConvertedData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during conversion.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setConvertedData(null);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!pair) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Converter Not Found</h2>
        <p className="text-gray-600 mb-6">The requested audio converter does not exist.</p>
        <Link to="/" className="text-indigo-600 hover:underline">Return Home</Link>
      </div>
    );
  }

  const showBitrateSettings = pair.to === 'mp3' || pair.to === 'aac';

  return (
    <>
      <Helmet>
        <title>{pair.title} Converter | AudioConvert</title>
        <meta name="description" content={pair.description + ". Fast, free, and secure online audio conversion."} />
      </Helmet>

      <div className="container mx-auto px-4 py-12 md:py-20 sm:px-6 lg:px-8 max-w-3xl">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center gap-4 mb-4 rounded-full bg-white px-6 py-2 shadow-sm border border-gray-100">
            <span className="text-lg font-bold text-gray-900 uppercase">{pair.from}</span>
            <ArrowRight className="h-5 w-5 text-gray-400" />
            <span className="text-lg font-bold text-indigo-600 uppercase">{pair.to}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {pair.title} Converter
          </h1>
          <p className="mt-4 text-gray-600">
            {pair.description} directly in your browser. No registration required.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
          
          {(ffmpegError || error) && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-100 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{ffmpegError || error}</p>
            </div>
          )}

          {!file && !convertedData && (
            <div 
              {...getRootProps()} 
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
                isDragActive 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm mb-6">
                <UploadCloud className={`h-10 w-10 ${isDragActive ? 'text-indigo-600' : 'text-gray-400'}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isDragActive ? 'Drop your audio file here' : 'Drag & Drop your audio file'}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                or click to browse from your device
              </p>
              <button 
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
              >
                Choose File
              </button>
            </div>
          )}

          {file && !convertedData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    <FileAudio className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                {!isConverting && (
                  <button 
                    onClick={handleRemoveFile}
                    className="shrink-0 p-2 text-gray-400 hover:text-red-600 transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {showBitrateSettings && !isConverting && (
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex w-full items-center justify-between bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-500" />
                      Advanced Settings
                    </div>
                    {showSettings ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  <AnimatePresence>
                    {showSettings && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-gray-200 bg-white"
                      >
                        <div className="p-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Audio Bitrate
                          </label>
                          <select 
                            value={bitrate}
                            onChange={(e) => setBitrate(e.target.value)}
                            className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            <option value="128k">128 kbps (Standard Quality)</option>
                            <option value="192k">192 kbps (High Quality)</option>
                            <option value="256k">256 kbps (Very High Quality)</option>
                            <option value="320k">320 kbps (Maximum Quality)</option>
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {isConverting ? (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-6 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600 mb-4" />
                  <p className="text-sm font-medium text-gray-900 mb-2">Converting your audio...</p>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                      style={{ width: `${Math.max(5, progress)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">{progress}% complete</p>
                </div>
              ) : (
                <button
                  onClick={handleConvert}
                  disabled={!loaded || isLoading}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {!loaded || isLoading ? 'Loading converter engine...' : `Convert to ${pair.to.toUpperCase()}`}
                </button>
              )}
            </div>
          )}

          {convertedData && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center py-6"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                <FileAudio className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Conversion Complete!</h3>
              <p className="text-sm text-gray-500">Your audio file is ready to download.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <a
                  href={convertedData.url}
                  download={convertedData.filename}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  <Download className="h-5 w-5" />
                  Download {pair.to.toUpperCase()}
                </a>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 transition-colors"
                >
                  <RotateCcw className="h-5 w-5" />
                  Convert Another File
                </button>
              </div>
            </motion.div>
          )}

        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Your files are processed locally in your browser whenever possible. We do not intentionally upload your audio files to our server.
        </p>
      </div>
    </>
  );
}
