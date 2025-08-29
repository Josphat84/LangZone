// app/components/PaymentsZoomButtons.tsx
'use client';
import { motion } from 'framer-motion';
import { FaPaypal } from 'react-icons/fa';
import { SiWise, SiZoom } from 'react-icons/si';
import { useState } from 'react';

interface PaymentZoomButtonsProps {
  zoomMeetingId: string;
  zoomPassword: string;
}

export default function PaymentZoomButtons({
  zoomMeetingId,
  zoomPassword,
}: PaymentZoomButtonsProps) {
  const [showZoomOptions, setShowZoomOptions] = useState(false);

  // Safety check and clean meeting ID
  const safeMeetingId = zoomMeetingId || '';
  const safePassword = zoomPassword || '';
  const cleanMeetingId = safeMeetingId.replace(/[^0-9]/g, '');
  const encodedPassword = encodeURIComponent(safePassword);

  // Check if we have valid meeting data
  const hasValidMeeting = cleanMeetingId.length >= 9 && safePassword.length > 0;

  // Multiple Zoom opening strategies - prioritizing app opening
  const zoomStrategies = {
    // Strategy 1: Force Zoom app open (most direct)
    forceApp: () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Try multiple mobile app protocols
        if (hasValidMeeting) {
          // Try to join specific meeting
          const protocols = [
            `zoomus://zoom.us/join?confno=${cleanMeetingId}&pwd=${encodedPassword}`,
            `zoommtg://zoom.us/join?confno=${cleanMeetingId}&pwd=${encodedPassword}`,
            `zoom://zoom.us/join?confno=${cleanMeetingId}&pwd=${encodedPassword}`
          ];
          
          protocols.forEach((protocol, index) => {
            setTimeout(() => {
              window.location.href = protocol;
            }, index * 100);
          });
        } else {
          // Just open the app
          const protocols = [
            `zoomus://zoom.us/`,
            `zoommtg://zoom.us/`,
            `zoom://`
          ];
          
          protocols.forEach((protocol, index) => {
            setTimeout(() => {
              window.location.href = protocol;
            }, index * 100);
          });
        }
      } else {
        // Desktop - try desktop app protocol
        if (hasValidMeeting) {
          window.location.href = `zoommtg://zoom.us/join?confno=${cleanMeetingId}&pwd=${encodedPassword}`;
        } else {
          window.location.href = `zoommtg://zoom.us/`;
        }
      }
    },

    // Strategy 2: Create invisible iframe trick (works on some browsers)
    iframeApp: () => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      
      if (hasValidMeeting) {
        iframe.src = `zoomus://zoom.us/join?confno=${cleanMeetingId}&pwd=${encodedPassword}`;
      } else {
        iframe.src = `zoomus://zoom.us/`;
      }
      
      document.body.appendChild(iframe);
      setTimeout(() => document.body.removeChild(iframe), 1000);
    },

    // Strategy 3: Intent-based opening for Android
    androidIntent: () => {
      const isAndroid = /Android/i.test(navigator.userAgent);
      if (isAndroid) {
        if (hasValidMeeting) {
          window.location.href = `intent://zoom.us/join?confno=${cleanMeetingId}&pwd=${encodedPassword}#Intent;scheme=zoomus;package=us.zoom.videomeetings;end`;
        } else {
          window.location.href = `intent://zoom.us/#Intent;scheme=zoomus;package=us.zoom.videomeetings;end`;
        }
      }
    },

    // Strategy 4: Universal link with app preference
    universalLink: () => {
      if (hasValidMeeting) {
        window.location.href = `https://zoom.us/j/${cleanMeetingId}?pwd=${encodedPassword}&prefer=app`;
      } else {
        window.location.href = `https://zoom.us/?prefer=app`;
      }
    },

    // Strategy 5: Web client (fallback only)
    webClient: () => {
      if (hasValidMeeting) {
        window.open(`https://zoom.us/wc/join/${cleanMeetingId}?pwd=${encodedPassword}`, '_blank');
      } else {
        window.open(`https://zoom.us/`, '_blank');
      }
    },

    // Strategy 6: Direct to app stores
    appStore: () => {
      const userAgent = navigator.userAgent;
      if (/iPad|iPhone|iPod/.test(userAgent)) {
        window.open('https://apps.apple.com/app/zoom-cloud-meetings/id546505307', '_blank');
      } else if (/Android/i.test(userAgent)) {
        window.open('https://play.google.com/store/apps/details?id=us.zoom.videomeetings', '_blank');
      } else {
        // Desktop - try desktop app
        zoomStrategies.forceApp();
      }
    }
  };

  // Main Zoom click handler - prioritize app opening
  const handleZoomClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    try {
      if (isMobile) {
        // Mobile: Try multiple strategies aggressively
        zoomStrategies.forceApp();
        
        // Also try iframe method as backup
        setTimeout(() => {
          zoomStrategies.iframeApp();
        }, 500);
        
        // Try Android intent if on Android
        if (isAndroid) {
          setTimeout(() => {
            zoomStrategies.androidIntent();
          }, 1000);
        }
        
        // Show options if nothing worked
        setTimeout(() => {
          setShowZoomOptions(true);
        }, 2500);
      } else {
        // Desktop: Try desktop app protocol first
        zoomStrategies.forceApp();
        
        // Show options quickly for desktop
        setTimeout(() => {
          setShowZoomOptions(true);
        }, 1500);
      }
    } catch (error) {
      console.log('All app opening strategies failed:', error);
      setShowZoomOptions(true);
    }
  };

  // Copy meeting details to clipboard
  const copyMeetingDetails = async () => {
    if (!hasValidMeeting) {
      alert('No valid meeting details to copy');
      return;
    }

    const meetingDetails = `
Zoom Meeting Details:
Meeting ID: ${cleanMeetingId}
Password: ${safePassword}
Join URL: https://zoom.us/j/${cleanMeetingId}?pwd=${encodedPassword}
    `.trim();

    try {
      await navigator.clipboard.writeText(meetingDetails);
      alert('Meeting details copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = meetingDetails;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Meeting details copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-6 items-center justify-center py-8"
    >
      {/* Payment Buttons Row */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* PayPal */}
        <motion.a
          whileHover={{ scale: 1.08 }}
          href="https://www.paypal.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg 
                     bg-white/10 backdrop-blur-xl border border-white/20
                     text-white text-lg font-semibold neon-glow transition"
        >
          <FaPaypal size={28} className="text-blue-500" />
          Pay with PayPal
        </motion.a>

        {/* Wise */}
        <motion.a
          whileHover={{ scale: 1.08 }}
          href="https://wise.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg 
                     bg-white/10 backdrop-blur-xl border border-white/20
                     text-white text-lg font-semibold neon-glow-green transition"
        >
          <SiWise size={28} className="text-green-500" />
          Pay with Wise
        </motion.a>
      </div>

      {/* Zoom Section */}
      <div className="flex flex-col items-center gap-4">
        {/* Main Zoom Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          onClick={handleZoomClick}
          className="flex items-center gap-3 px-8 py-5 rounded-2xl shadow-lg 
                     bg-gradient-to-r from-blue-600 to-purple-600 
                     text-white text-xl font-bold transition-all duration-300
                     hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl"
        >
          <SiZoom size={32} className="text-white" />
          {hasValidMeeting ? 'Join Zoom Meeting' : 'Open Zoom App'}
        </motion.button>

        {/* Meeting Info */}
        {hasValidMeeting ? (
          <div className="text-center text-white/80 text-sm">
            <p>Meeting ID: <span className="font-mono font-bold text-white">{cleanMeetingId}</span></p>
            <p>Password: <span className="font-mono font-bold text-white">{safePassword}</span></p>
          </div>
        ) : (
          <div className="text-center text-white/70 text-sm">
            <p>📱 Click to open Zoom app</p>
            <p className="text-xs text-white/50 mt-1">
              No meeting details provided - will open Zoom main screen
            </p>
          </div>
        )}

        {/* Alternative Options - Show when needed */}
        {showZoomOptions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-col gap-3 w-full max-w-md"
          >
            <p className="text-white/90 text-sm text-center mb-2">
              Having trouble? Try these alternatives:
            </p>

            {/* Alternative Zoom Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => zoomStrategies.forceApp()}
                className="px-4 py-3 bg-blue-600/80 hover:bg-blue-600 rounded-lg text-white text-sm transition"
              >
                📱 Force Open App
              </button>

              <button
                onClick={() => zoomStrategies.androidIntent()}
                className="px-4 py-3 bg-green-600/80 hover:bg-green-600 rounded-lg text-white text-sm transition"
              >
                🤖 Android Intent
              </button>

              <button
                onClick={() => zoomStrategies.iframeApp()}
                className="px-4 py-3 bg-purple-600/80 hover:bg-purple-600 rounded-lg text-white text-sm transition"
              >
                🖼️ Iframe Method
              </button>

              <button
                onClick={() => zoomStrategies.appStore()}
                className="px-4 py-3 bg-gray-600/80 hover:bg-gray-600 rounded-lg text-white text-sm transition"
              >
                📥 Get Zoom App
              </button>
              
              <button
                onClick={() => zoomStrategies.universalLink()}
                className="px-4 py-3 bg-yellow-600/80 hover:bg-yellow-600 rounded-lg text-white text-sm transition"
              >
                🔗 Universal Link
              </button>

              <button
                onClick={() => zoomStrategies.webClient()}
                className="px-4 py-3 bg-red-600/80 hover:bg-red-600 rounded-lg text-white text-sm transition"
              >
                💻 Web Only (Last Resort)
              </button>
            </div>

            {hasValidMeeting && (
              <button
                onClick={copyMeetingDetails}
                className="px-4 py-3 bg-yellow-600/80 hover:bg-yellow-600 rounded-lg text-white text-sm transition mt-2"
              >
                📋 Copy Meeting Details
              </button>
            )}

            <button
              onClick={() => setShowZoomOptions(false)}
              className="text-white/60 hover:text-white text-xs mt-2 transition"
            >
              Hide options
            </button>
          </motion.div>
        )}

        {/* Manual Instructions */}
        {hasValidMeeting && (
          <details className="text-white/70 text-xs max-w-md">
            <summary className="cursor-pointer hover:text-white transition">
              Manual join instructions
            </summary>
            <div className="mt-2 p-3 bg-black/20 rounded-lg">
              <p><strong>If the buttons don't work:</strong></p>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Open your Zoom app manually</li>
                <li>Tap "Join Meeting"</li>
                <li>Enter Meeting ID: <span className="font-mono">{cleanMeetingId}</span></li>
                <li>Enter Password: <span className="font-mono">{safePassword}</span></li>
                <li>Tap "Join"</li>
              </ol>
            </div>
          </details>
        )}
      </div>
    </motion.div>
  );
}