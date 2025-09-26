import React, { useRef, useState } from "react";
import "./App.css";

const App = () => {
  const [summary, setSummary] = useState("");
  const [audio, setAudio] = useState(null);
  const [videosrc, setVideoSrc] = useState(null);
  const videoref = useRef(null);
  const stopRef = useRef(false);

  const startRecording = async () => {
    try {
      // 1. Camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // live preview
      if (videoref.current) {
        videoref.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);

      recorder.onstop = async () => {
        // 2. Create video file
        const blob = new Blob(chunks, { type: "video/mp4" });
        const url = URL.createObjectURL(blob);
        setVideoSrc(url);

        const file = new File([blob], "recording.mp4", { type: "video/mp4" });

        // 3. Send to backend
        const form = new FormData();
        form.append("file", file);

        try {
          const res = await fetch("http://127.0.0.1:8000/process-video", {
            method: "POST",
            body: form,
          });

          const data = await res.json();
          console.log("Server Response:", data);

          setSummary(data.final_summary);

          if (data.audio) {
            const audioSrc = `data:audio/mp3;base64,${data.audio}`;
            setAudio(audioSrc);
          }
        } catch (error) {
          console.error("Upload error:", error);
        }

        // agar stop button nahi dabaya hai to fir se recording start kar
        if (!stopRef.current) {
          setTimeout(() => {
            startRecording();
          }, 2000); // 1 sec gap ke baad fir se start
        }
      };

      // 4. Start recording
      recorder.start();
      console.log("Recording started...");

      // 5. Stop after 10 seconds
      setTimeout(() => {
        recorder.stop();
        console.log("Recording stopped after 10 sec");
      }, 10000);
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  // Stop loop
  const stopRecording = () => {
    stopRef.current = true;
    console.log("Recording stopped manually!");
  };

  return (
    <div className="bg-blue-600 w-full h-full min-h-screen p-6 flex items-center justify-center flex-col">
      <h1 className="text-red-600 text-4xl">Blind Assist Prototype</h1>
      <div className="flex flex-col gap-6 mt-6">
        {/* Start Recording */}
        <button
          onClick={() => {
            stopRef.current = false;
            startRecording();
          }}
          className="bg-green-600 rounded-2xl p-3 cursor-pointer hover:bg-blue-800 text-white"
        >
          Start Recording (Loop)
        </button>

        {/* Stop Recording */}
        <button
          onClick={stopRecording}
          className="bg-red-600 rounded-2xl p-3 cursor-pointer hover:bg-red-800 text-white"
        >
          Stop Recording
        </button>

        {/* Live Preview */}
        <h2 className="text-white font-bold">Live Preview:</h2>
        <video
          ref={videoref}
          autoPlay
          muted
          className="mt-2 w-96 rounded-xl shadow-2xl border-2 border-white"
        />

        {/* Recorded Video Play */}
        {videosrc && (
          <div>
            <h2 className="text-white font-bold mt-4">Last Recorded:</h2>
            <video
              src={videosrc}
              controls
              autoPlay
              className="mt-2 w-96 rounded-xl shadow-2xl"
            />
          </div>
        )}

        {/* Show Summary */}
        {summary && (
          <div className="mt-4 p-4 border rounded bg-gray-100">
            <h2 className="text-lg font-bold">Final Summary:</h2>
            <p>{summary}</p>
          </div>
        )}

        {/* Play Audio */}
        {audio && (
          <div className="mt-4">
            <h2 className="text-lg font-bold text-white">Audio Output:</h2>
            <audio controls autoPlay src={audio} muted={false}></audio>
          </div>
        )}

        {summary && (
          <div>
            <h2 className="text-lg text-red-700 font-bold">Summary Text is :::::::::</h2>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
