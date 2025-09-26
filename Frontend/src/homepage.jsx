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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
          Blind Assist Prototype
        </h1>
        <p className="text-blue-200 text-lg">
          AI-powered assistance for the visually impaired
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column - Controls and Preview */}
        <div className="space-y-8">
          {/* Control Panel */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Controls</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onStartRecording}
                disabled={isRecording}
                className={`px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                  isRecording 
                    ? 'bg-green-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                }`}
              >
                {isRecording ? '🔴 Recording...' : '🎬 Start Recording'}
              </button>

              <button
                onClick={onStopRecording}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
              >
                ⏹️ Stop Recording
              </button>

              <button
                onClick={onReset}
                className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
              >
                🔄 Reset
              </button>
            </div>

            {/* Recording Status */}
            <div className="mt-6 text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${
                isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
              }`}>
                <span className={`w-3 h-3 rounded-full mr-2 ${
                  isRecording ? 'bg-white' : 'bg-gray-300'
                }`}></span>
                <span className="text-white font-medium">
                  {isRecording ? 'Live Recording' : 'Ready to Record'}
                </span>
              </div>
            </div>
          </div>

          {/* Video Preview Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Live Preview</h2>
            <div className="relative">
              <video
                ref={videoref}
                autoPlay
                muted
                className="w-full h-64 object-cover rounded-2xl shadow-lg border-2 border-white/30"
              />
              {isRecording && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  REC
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-8">
          {/* Recorded Video Playback */}
          {videosrc && (
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">Last Recording</h2>
              <video
                src={videosrc}
                controls
                className="w-full rounded-2xl shadow-lg border-2 border-white/30"
              />
            </div>
          )}

          {/* Audio Output */}
          {audio && (
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">Audio Output</h2>
              <div className="bg-black/20 rounded-2xl p-6">
                <audio controls autoPlay src={audio} muted={false} className="w-full"></audio>
              </div>
            </div>
          )}

          {/* Summary Output */}
          {summary && (
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">AI Summary</h2>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="text-white/90 leading-relaxed text-lg">{summary}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12">
        <p className="text-blue-200/70">
          Designed for accessibility and ease of use
        </p>
      </div>
    </div>
  );
};

export default Homepage;