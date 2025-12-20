import React from 'react';

const Homepage = ({ 
  isRecording, 
  summary, 
  audio, 
  videosrc, 
  videoref, 
  error,
  loading,
  onStartRecording, 
  onStopRecording, 
  onReset 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header Section */}
      <header className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Beacon Assist
                </h1>
                <p className="text-gray-600 mt-1 text-lg">
                  Audio-visual assistant for the visually impaired
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-gray-700 font-medium">
                {isRecording ? 'Recording Session' : 'Ready'}
              </span>
            </div>
            <div className="hidden md:block text-sm text-gray-500">
              v1.0.0
            </div>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm">!</span>
              </div>
              <div>
                <h3 className="font-medium text-red-800">Error</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Camera & Controls */}
          <div className="lg:col-span-2 space-y-8">
            {/* Camera Preview Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Live Camera View</h2>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
                    <span className="text-sm font-medium text-gray-600">
                      {isRecording ? 'REC' : 'LIVE'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden aspect-video border-2 border-gray-800">
                  <video
                    ref={videoref}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    aria-label="Live camera feed"
                  />
                  
                  {/* Recording overlay */}
                  {isRecording && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute inset-0 bg-red-500/10"></div>
                      <div className="relative z-10 flex items-center gap-3 bg-black/80 backdrop-blur-sm px-6 py-3 rounded-full">
                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-white font-medium">Recording...</span>
                        <span className="text-red-300 text-sm">00:{10}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Camera off overlay */}
                  {!isRecording && !videoref.current?.srcObject && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-400 text-lg">Camera Preview</p>
                      <p className="text-gray-500 text-sm mt-2">Start session to begin</p>
                    </div>
                  )}
                </div>
                
                {/* Controls */}
                <div className="mt-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={onStartRecording}
                      disabled={isRecording || loading}
                      className={`py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                        isRecording 
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl active:scale-95'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </>
                      ) : isRecording ? (
                        <>
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                          <span>Recording in Progress</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Begin Session</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={onStopRecording}
                      disabled={!isRecording}
                      className="py-4 px-6 rounded-xl font-semibold text-lg bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 hover:shadow-lg active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                      <span>Stop Session</span>
                    </button>

                    <button
                      onClick={onReset}
                      className="py-4 px-6 rounded-xl font-semibold text-lg bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black hover:shadow-lg active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Clear All</span>
                    </button>
                  </div>
                  
                  {/* Info Card */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 text-xl">ℹ️</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900 text-lg mb-2">How to Use Beacon Assist</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                              <span className="text-blue-600 text-xs">1</span>
                            </div>
                            <span className="text-blue-800">Position your device camera towards the scene you want described</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                              <span className="text-blue-600 text-xs">2</span>
                            </div>
                            <span className="text-blue-800">Click "Begin Session" to start automatic 10-second recording</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                              <span className="text-blue-600 text-xs">3</span>
                            </div>
                            <span className="text-blue-800">Audio description will play automatically after processing</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recording Playback */}
            {videosrc && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                    <span className="text-purple-600">📹</span> Session Recording
                  </h2>
                </div>
                <div className="p-6">
                  <div className="rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
                    <video
                      src={videosrc}
                      controls
                      className="w-full"
                      aria-label="Playback of recorded session"
                    />
                  </div>
                  <p className="text-gray-500 text-sm mt-4">
                    Review your last recording. Video is stored locally in your browser.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-8">
            {/* Audio Output */}
            {audio && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                    <span className="text-green-600">🔊</span> Audio Description
                  </h2>
                </div>
                <div className="p-6">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <audio 
                      controls 
                      autoPlay 
                      src={audio} 
                      className="w-full [&::-webkit-media-controls-panel]:bg-gray-100 [&::-webkit-media-controls-panel]:rounded-lg"
                      aria-label="Audio description of the scene"
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Audio will auto-play. Use controls to replay.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Output */}
            {summary && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                    <span className="text-amber-600">📝</span> Scene Description
                  </h2>
                </div>
                <div className="p-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 min-h-[200px]">
                    <p className="text-gray-700 leading-relaxed text-lg" aria-live="polite">
                      {summary}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">AI Generated Description</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.ceil(summary.split(' ').length / 2)}s audio
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Status Panel */}
            {!summary && !audio && !loading && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">Ready to Assist</h3>
                <p className="text-gray-500 mb-6 max-w-sm">
                  Start a session to receive audio descriptions of your surroundings in Hinglish.
                </p>
                <div className="space-y-3 w-full max-w-xs">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">10-second automatic sessions</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Hinglish audio descriptions</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Continuous mode available</span>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-8 text-center">
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Processing Scene</h3>
                  <p className="text-gray-600 mb-6">Analyzing video frames and generating description...</p>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 animate-pulse w-3/4"></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Extracting frames</span>
                      <span>Generating audio</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <span className="text-gray-800 font-semibold">Beacon Assist</span>
            </div>
            <p className="text-gray-600 text-sm">
              Designed with accessibility as a priority. All processing happens locally on your device.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Privacy Policy
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Accessibility
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Help Center
            </button>
            <div className="text-sm text-gray-500">
              © 2026 Beacon Assist
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
