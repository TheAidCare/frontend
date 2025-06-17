import { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import styles from './AudioRecorder.module.css';

const AudioRecorder = ({ onToggle, initialRecording = false, socket, currentConsultationId }) => {
  const [isRecording, setIsRecording] = useState(initialRecording);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // This useEffect hook handles the starting and stopping of the recording
  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      stopRecording();
    }
  }, [isRecording]);

  const handleTranscriptionResponse = async (transcript) => {
    if (!socket) {
      console.error('No socket connection available');
      return;
    }

    try {
      setIsProcessing(true);
      if (!currentConsultationId) {
        // Start a new consultation
        socket.emit("startConsultation", {
          transcript_text: transcript
        });
      } else {
        // Continue existing consultation
        socket.emit("message", {
          transcript_text: transcript
        });
      }
    } catch (error) {
      console.error('Error sending transcription to WebSocket:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm' // This will be converted to mp3/wav before sending
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Convert the recorded chunks to a blob
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Convert to mp3 format
        const audioFile = new File([audioBlob], 'recording.mp3', { type: 'audio/mpeg' });
        
        // Create form data
        const formData = new FormData();
        formData.append('audio_file', audioFile);

        try {
          setIsProcessing(true);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENGINE_URL}/transcribe/audio/`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Transcription failed');
          }

          const data = await response.json();
          // console.log('Transcription response:', data);
          
          // Handle the transcription response
          if (data.transcript) {
            await handleTranscriptionResponse(data.transcript);
          }
        } catch (error) {
          console.error('Error during transcription:', error);
        } finally {
          setIsProcessing(false);
        }

        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleToggle = () => {
    const newIsRecording = !isRecording;
    setIsRecording(newIsRecording);
    onToggle && onToggle(newIsRecording);
  };

  return (
    <div className={styles.recorderContainer}>
      <button
        onClick={handleToggle}
        className={`${styles.recordButton} ${isRecording ? styles.recording : ''}`}
        title={isRecording ? "Stop Recording" : "Start Recording"}
        disabled={isProcessing}
      >
        {isRecording ? <FaStop /> : <FaMicrophone />}
      </button>
      {isRecording && (
        <div className={styles.recordingIndicator}>
          Recording...
        </div>
      )}
      {isProcessing && (
        <div className={styles.recordingIndicator}>
          Processing audio...
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;