import { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export function useFFmpeg() {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [progress, setProgress] = useState(0);

  const load = async () => {
    if (loaded || isLoading) return true;
    
    setIsLoading(true);
    setError(null);
    try {
      if (!ffmpegRef.current) {
        ffmpegRef.current = new FFmpeg();
      }
      const ffmpeg = ffmpegRef.current;
      
      // Setup progress listener
      ffmpeg.on('progress', ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });

      ffmpeg.on('log', ({ message }) => {
        console.log('[FFmpeg log]', message);
      });

      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      
      setLoaded(true);
      return true;
    } catch (err: any) {
      console.error('Failed to load FFmpeg', err);
      setError('Audio conversion engine could not be loaded. Please refresh the page and try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const convertFile = async (
    file: File, 
    outputFormat: string, 
    options: { bitrate?: string } = {}
  ): Promise<{ url: string; filename: string }> => {
    // Ensure lazy load completes before continuing
    let isReady = loaded;
    if (!isReady) {
      isReady = await load();
    }
    
    if (!isReady || !ffmpegRef.current) {
      throw new Error('Converter engine failed to initialize.');
    }

    const ffmpeg = ffmpegRef.current;
    const inputName = `input_${Date.now()}.${file.name.split('.').pop()}`;
    const outputName = `output_${Date.now()}.${outputFormat}`;

    try {
      setProgress(0);
      
      // Write file to FFmpeg virtual file system
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // Build FFmpeg command arguments
      const args = ['-i', inputName];

      if (outputFormat === 'mp3') {
        args.push('-c:a', 'libmp3lame');
        if (options.bitrate) {
          args.push('-b:a', options.bitrate);
        }
      } else if (outputFormat === 'aac') {
        args.push('-c:a', 'aac');
        if (options.bitrate) {
          args.push('-b:a', options.bitrate);
        }
      } else if (outputFormat === 'flac') {
        args.push('-c:a', 'flac');
      } else if (outputFormat === 'wav') {
        args.push('-c:a', 'pcm_s16le');
      } else if (outputFormat === 'aiff') {
        args.push('-c:a', 'pcm_s16be');
      }

      args.push(outputName);

      // Run conversion
      await ffmpeg.exec(args);

      // Read result
      const data = await ffmpeg.readFile(outputName);
      
      // Cleanup virtual file system
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      // Create blob URL
      const blob = new Blob([data], { type: `audio/${outputFormat}` });
      const url = URL.createObjectURL(blob);

      // Generate clean filename
      const originalNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const finalFilename = `${originalNameWithoutExt}.${outputFormat}`;

      return { url, filename: finalFilename };
    } catch (err) {
      console.error('Conversion failed', err);
      throw new Error('Conversion failed. Please try another file.');
    }
  };

  return { loaded, isLoading, error, progress, convertFile, load };
}
