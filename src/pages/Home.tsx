import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { CONVERSION_PAIRS } from '../data/formats';
import { ArrowRight, Music, UploadCloud } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

function getFormatColor(format: string) {
  switch (format) {
    case 'mp3': return 'bg-blue-50 text-blue-600';
    case 'flac': return 'bg-emerald-50 text-emerald-600';
    case 'wav': return 'bg-purple-50 text-purple-600';
    case 'aiff': return 'bg-orange-50 text-orange-600';
    case 'aac': return 'bg-pink-50 text-pink-600';
    default: return 'bg-slate-100 text-slate-500';
  }
}

function getFormatDescription(from: string, to: string) {
  if (to === 'flac') return 'Lossless Quality';
  if (to === 'wav') return 'Universal Audio / Raw PCM';
  if (to === 'mp3') return 'Compressed Audio / Legacy';
  if (to === 'aac') return 'High Efficiency';
  if (to === 'aiff') return 'Standard Meta / Studio';
  return `Convert ${from.toUpperCase()} to ${to.toUpperCase()}`;
}

export function Home() {
  return (
    <>
      <Helmet>
        <title>Free Online Audio Converter | AudioConvert</title>
        <meta name="description" content="Convert MP3, FLAC, WAV, AIFF and AAC files quickly and easily directly in your browser. Fast, secure, and free online audio conversion." />
      </Helmet>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-full">
        {/* Left Pane: Hero & Upload */}
        <section className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-center bg-white relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
          
          <div className="relative z-10 max-w-md mx-auto lg:ml-auto lg:mr-8 xl:mr-12">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider mb-4">WASM-Powered Tool</span>
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-4">
              Free Online <br/>
              <span className="text-indigo-600">Audio Converter</span>
            </h1>
            <p className="text-slate-500 mb-8 text-lg">
              Convert MP3, FLAC, WAV, AIFF and AAC files securely and quickly right in your browser.
            </p>

            <Link
              to="/mp3-to-wav"
              className="block border-2 border-dashed border-slate-200 rounded-2xl p-8 bg-slate-50 text-center hover:border-indigo-400 transition-colors cursor-pointer group"
            >
              <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="text-slate-900 font-semibold mb-1">Choose Audio File</p>
              <p className="text-slate-400 text-xs">Drag & drop or browse your files</p>
              <button className="mt-6 bg-indigo-600 text-white w-full py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                Upload Now
              </button>
            </Link>

            <div className="flex items-center gap-2 mt-6 text-xs text-slate-400">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.597 9.29-6.518 11.771a1.307 1.307 0 01-1.482 0C6.097 16.29 3.5 11.947 3.5 7.001c0-.681.057-1.35.166-2.002zm7.5 1.614a.75.75 0 01.404.07l.027.015 0 0 .004.003.017.01.061.035c.162.092.398.245.666.438.54.39 1.15.9 1.518 1.443a.75.75 0 01-1.25.833c-.246-.369-.745-.773-1.196-1.098a13.33 13.33 0 00-.482-.332l-.046-.03-.015-.009-.004-.002h-.002a.75.75 0 01-.15-1.284z" clipRule="evenodd"></path></svg>
              Your files are processed locally. Private & secure.
            </div>
          </div>
        </section>

        {/* Right Pane: Tools Grid & FAQ */}
        <section className="lg:col-span-7 bg-slate-100 p-6 md:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900" id="converters">Choose Your Converter</h2>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500 tracking-wider">20 TOOLS</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 content-start">
            {CONVERSION_PAIRS.map((pair, index) => (
              <motion.div
                key={pair.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.015 }}
              >
                <Link
                  to={pair.url}
                  className="block bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group h-full flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center font-bold text-[10px]",
                      getFormatColor(pair.from)
                    )}>
                      {pair.from.toUpperCase()}
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" strokeWidth={3} />
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center font-bold text-[10px]",
                      getFormatColor(pair.to)
                    )}>
                      {pair.to.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    {pair.from.toUpperCase()} to {pair.to.toUpperCase()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                    {getFormatDescription(pair.from, pair.to)}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-4 shadow-sm">
            <div className="p-2 bg-indigo-100 rounded-lg shrink-0">
              <Music className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-xs text-indigo-900 font-medium">
              Select any tool to open the advanced converter. More formats coming soon!
            </p>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200" id="faq">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Are my files uploaded to a server?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  No. We use modern WebAssembly technology (FFmpeg) to convert your files directly in your web browser. Your files never leave your device.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Is this service free to use?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Yes, AudioConvert is completely free to use with no hidden fees or premium tiers.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
