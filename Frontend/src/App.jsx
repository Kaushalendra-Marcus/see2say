import React, { useRef, useState } from "react";
import "./App.css";
import Homepage from "./homepage";

const App = () => {
  const [summary, setSummary] = useState("");
  const [audio, setAudio] = useState(null);
  const [videosrc, setVideoSrc] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const videoref = useRef(null);
  const stopRef = useRef(false);

  const startRecording = async () => {
    try {
      setIsRecording(true);
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
        setIsRecording(false);
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
      setIsRecording(false);
    }
  };

  // Stop loop
  const stopRecording = () => {
    stopRef.current = true;
    setIsRecording(false);
    console.log("Recording stopped manually!");
  };

  const resetAll = () => {
    stopRecording();
    setSummary("");
    setAudio(null);
    setVideoSrc(null);
    if (videoref.current) {
      videoref.current.srcObject = null;
    }
  };

  return (
    <div className="app-container">
      <Homepage 
        isRecording={isRecording}
        summary={summary}
        audio={audio}
        videosrc={videosrc}
        videoref={videoref}
        onStartRecording={() => {
          stopRef.current = false;
          startRecording();
        }}
        onStopRecording={stopRecording}
        onReset={resetAll}
      />
    </div>
  );
};

export default App;