export const AUDIO_FORMATS = ['mp3', 'flac', 'wav', 'aiff', 'aac'] as const;

export type AudioFormat = (typeof AUDIO_FORMATS)[number];

export interface ConversionPair {
  id: string;
  from: AudioFormat;
  to: AudioFormat;
  title: string;
  description: string;
  url: string;
}

export const CONVERSION_PAIRS: ConversionPair[] = [];

AUDIO_FORMATS.forEach((from) => {
  AUDIO_FORMATS.forEach((to) => {
    if (from !== to) {
      CONVERSION_PAIRS.push({
        id: `${from}-to-${to}`,
        from,
        to,
        title: `${from.toUpperCase()} to ${to.toUpperCase()}`,
        description: `Convert ${from.toUpperCase()} audio to ${to.toUpperCase()}`,
        url: `/${from}-to-${to}`,
      });
    }
  });
});

export const getConversionPair = (id: string) => {
  return CONVERSION_PAIRS.find((p) => p.id === id);
};
