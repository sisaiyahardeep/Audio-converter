import { useState, useEffect, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export function useFFmpeg() {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ffmpegRef = useRef(new FFmpeg());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only load if not already loaded and not currently loading
    if (!loaded && !isLoading) {
      load();
    }
  }, []);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ffmpeg = ffmpegRef.current;
      
      // Setup progress listener
      ffmpeg.on('progress', ({ progress }) => {
        // Progress goes from 0 to 1
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
    } catch (err: any) {
      console.error('Failed to load FFmpeg', err);
      setError('Failed to initialize audio converter engine. Your browser might not support required features.');
    } finally {
      setIsLoading(false);
    }
  };

  const convertFile = async (
    file: File, 
    outputFormat: string, 
    options: { bitrate?: string } = {}
  ): Promise<{ url: string; filename: string }> => {
    if (!loaded) {
      throw new Error('Converter not initialized');
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

  return { loaded, isLoading, error, progress, convertFile };
}
