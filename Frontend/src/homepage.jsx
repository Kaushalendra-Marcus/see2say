import React from 'react';

const Homepage = ({ 
  isRecording, 
  summary, 
  audio, 
  videosrc, 
  videoref, 
  onStartRecording, 
  onStopRecording, 
  onReset 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header Section */}
      <header className="max-w-6xl mx-auto mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1">
              Beacon Assist
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Audio-visual assistant for the visually impaired
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-green-600 animate-pulse' : 'bg-gray-300'}`} />
            <span className="text-sm text-gray-600">
              {isRecording ? 'Active' : 'Standby'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Left Column - Camera & Controls */}
          <div className="space-y-6">
            {/* Camera Preview */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h2 className="font-medium text-gray-800">Camera View</h2>
              </div>
              <div className="p-4">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={videoref}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                    aria-label="Live camera feed"
                  />
                  {isRecording && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                      <span className="text-xs font-medium text-gray-700 bg-white/90 px-2 py-1 rounded">
                        Recording
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Recording Controls */}
                <div className="mt-6 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={onStartRecording}
                      disabled={isRecording}
                      className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                        isRecording 
                          ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                          : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                      }`}
                      aria-label={isRecording ? 'Currently recording' : 'Start recording'}
                    >
                      <span className="w-2 h-2 bg-current rounded-full" />
                      {isRecording ? 'Recording in Progress' : 'Begin Session'}
                    </button>

                    <button
                      onClick={onStopRecording}
                      disabled={!isRecording}
                      className="flex-1 py-3 px-4 rounded-md font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
                      aria-label="Stop recording"
                    >
                      Stop Session
                    </button>
                  </div>
                  
                  <button
                    onClick={onReset}
                    className="w-full py-2.5 px-4 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md border border-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <span className="text-blue-600">ℹ️</span> How to Use
              </h3>
              <ul className="text-sm text-blue-800 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  Position camera toward scene you want described
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  Sessions automatically process after 10 seconds
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  Audio description will play automatically
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Audio Output */}
            {audio && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <h2 className="font-medium text-gray-800 flex items-center gap-2">
                    <span className="text-green-600">🔊</span> Audio Description
                  </h2>
                </div>
                <div className="p-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <audio 
                      controls 
                      autoPlay 
                      src={audio} 
                      className="w-full"
                      aria-label="Audio description of the scene"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    Audio will play automatically. Use controls to replay.
                  </p>
                </div>
              </div>
            )}

            {/* Summary Output */}
            {summary && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <h2 className="font-medium text-gray-800 flex items-center gap-2">
                    <span className="text-green-600">📝</span> Scene Description
                  </h2>
                </div>
                <div className="p-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed" aria-live="polite">
                      {summary}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    Description generated
                  </div>
                </div>
              </div>
            )}

            {/* Recording Playback */}
            {videosrc && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <h2 className="font-medium text-gray-800">Session Recording</h2>
                </div>
                <div className="p-4">
                  <video
                    src={videosrc}
                    controls
                    className="w-full rounded-lg bg-gray-100"
                    aria-label="Playback of recorded session"
                  />
                  <p className="text-sm text-gray-500 mt-3">
                    Review your last recording. Video is stored locally.
                  </p>
                </div>
              </div>
            )}

            {/* Status Panel */}
            {!summary && !audio && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-gray-400 mb-3">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-700 mb-1">Ready to Assist</h3>
                <p className="text-sm text-gray-500">
                  Start a session to receive audio descriptions of your surroundings.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-12 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-gray-500">
            Designed with accessibility as a priority. Fully local processing.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <button className="hover:text-gray-700 transition-colors">Privacy</button>
            <button className="hover:text-gray-700 transition-colors">Settings</button>
            <button className="hover:text-gray-700 transition-colors">Help</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
