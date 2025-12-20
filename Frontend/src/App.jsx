import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import Homepage from "./homepage";

const App = () => {
  const [summary, setSummary] = useState("");
  const [audio, setAudio] = useState(null);
  const [videosrc, setVideoSrc] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoref = useRef(null);
  const stopRef = useRef(false);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recorderRef.current && recorderRef.current.state === "recording") {
        recorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setError(null);
      stopRef.current = false;

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "environment"
        },
        audio: true,
      });

      streamRef.current = stream;

      // Live preview
      if (videoref.current) {
        videoref.current.srcObject = stream;
      }

      // Create recorder with supported format
      let recorder;
      if (MediaRecorder.isTypeSupported('video/webm; codecs="vp9,opus"')) {
        recorder = new MediaRecorder(stream, {
          mimeType: 'video/webm; codecs="vp9,opus"'
        });
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        recorder = new MediaRecorder(stream, {
          mimeType: 'video/webm'
        });
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        recorder = new MediaRecorder(stream, {
          mimeType: 'video/mp4'
        });
      } else {
        recorder = new MediaRecorder(stream);
      }

      recorderRef.current = recorder;
      let chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        setIsRecording(false);
        
        if (chunks.length === 0) {
          setError("No video data recorded");
          return;
        }

        const blob = new Blob(chunks, { 
          type: chunks[0].type || 'video/webm' 
        });
        
        // Create preview URL
        const url = URL.createObjectURL(blob);
        setVideoSrc(url);

        // Create file for upload
        const file = new File([blob], `recording_${Date.now()}.webm`, { 
          type: blob.type 
        });

        // Send to backend
        await uploadVideo(file);

        // Restart recording if not stopped manually
        if (!stopRef.current) {
          setTimeout(() => {
            if (!stopRef.current) {
              startRecording();
            }
          }, 1000);
        }
      };

      // Start recording
      recorder.start();
      console.log("Recording started...");

      // Stop after 10 seconds
      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
          console.log("Recording stopped after 10 sec");
        }
      }, 10000);

    } catch (err) {
      console.error("Camera error:", err);
      setError(`Camera error: ${err.message}`);
      setIsRecording(false);
    }
  };

  const uploadVideo = async (file) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // For local development
      const BACKEND_URL = "http://localhost:7860";
      // For HuggingFace deployment:
      // const BACKEND_URL = "https://kaushalendra-marcus-beaconassist.hf.space";

      const response = await fetch(`${BACKEND_URL}/process-video`, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
        },
      });

      console.log("Response status:", response.status);
      
      // Check if response is OK
      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
        } catch (e) {
          errorText = "Could not read error response";
        }
        throw new Error(`Server error ${response.status}: ${errorText.substring(0, 100)}`);
      }

      // Check content type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Expected JSON but got:", contentType, text.substring(0, 200));
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();
      console.log("Server response:", data);

      if (data.success) {
        setSummary(data.final_summary);
        if (data.audio) {
          const audioSrc = `data:audio/mp3;base64,${data.audio}`;
          setAudio(audioSrc);
          
          // Auto-play audio
          setTimeout(() => {
            const audioElement = new Audio(audioSrc);
            audioElement.play().catch(e => console.log("Auto-play prevented:", e));
          }, 500);
        }
      } else {
        setError(data.error || "Failed to process video");
      }

    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const stopRecording = () => {
    stopRef.current = true;
    setIsRecording(false);
    
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    console.log("Recording stopped manually!");
  };

  const resetAll = () => {
    stopRecording();
    setSummary("");
    setAudio(null);
    setVideoSrc(null);
    setError(null);
    setLoading(false);
    
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
        error={error}
        loading={loading}
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
