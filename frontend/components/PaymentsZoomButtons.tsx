// app/components/PaymentsZoomButtons.tsx
'use client';
import { motion } from 'framer-motion';
import { FaPaypal } from 'react-icons/fa';
import { SiWise, SiZoom } from 'react-icons/si';

interface PaymentZoomButtonsProps {
  zoomMeetingId: string;
  zoomPassword: string;
}

export default function PaymentZoomButtons({
  zoomMeetingId,
  zoomPassword,
}: PaymentZoomButtonsProps) {
  const handleZoomClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Clean the meeting ID (remove any spaces, dashes, etc.)
    const cleanMeetingId = zoomMeetingId.replace(/\s|-/g, '');
    const encodedPwd = encodeURIComponent(zoomPassword);
    
    // Detect if user is on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // For mobile devices, use the mobile-specific deep link
      const zoomMobileLink = `zoomus://zoom.us/join?confno=${cleanMeetingId}&pwd=${encodedPwd}`;
      
      // Try to open the Zoom app
      window.location.href = zoomMobileLink;
      
      // Fallback to app store if Zoom app isn't installed
      setTimeout(() => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const appStoreUrl = isIOS 
          ? 'https://apps.apple.com/app/zoom-cloud-meetings/id546505307'
          : 'https://play.google.com/store/apps/details?id=us.zoom.videomeetings';
        
        // If the app didn't open, redirect to app store
        const confirmInstall = confirm('Zoom app not found. Would you like to install it?');
        if (confirmInstall) {
          window.open(appStoreUrl, '_blank');
        }
      }, 2000);
      
    } else {
      // For desktop, use the standard web link
      const zoomWebLink = `https://zoom.us/j/${cleanMeetingId}?pwd=${encodedPwd}`;
      window.open(zoomWebLink, '_blank');
    }
  };

  // Alternative method: Direct app store links
  const handleZoomAlternative = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    if (isIOS) {
      window.open('https://apps.apple.com/app/zoom-cloud-meetings/id546505307', '_blank');
    } else if (isAndroid) {
      window.open('https://play.google.com/store/apps/details?id=us.zoom.videomeetings', '_blank');
    } else {
      // Desktop - direct to web client
      const cleanMeetingId = zoomMeetingId.replace(/\s|-/g, '');
      const encodedPwd = encodeURIComponent(zoomPassword);
      const zoomWebLink = `https://zoom.us/j/${cleanMeetingId}?pwd=${encodedPwd}`;
      window.open(zoomWebLink, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row gap-6 items-center justify-center py-8"
    >
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

      {/* Zoom - Primary Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        onClick={handleZoomClick}
        className="flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg 
                   bg-white/10 backdrop-blur-xl border border-white/20
                   text-white text-lg font-semibold neon-glow-purple transition"
      >
        <SiZoom size={28} className="text-purple-500" />
        Start Zoom Lesson
      </motion.button>

      {/* Zoom - Alternative Button (if primary fails) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={handleZoomAlternative}
        className="flex items-center gap-2 px-4 py-2 rounded-lg
                   bg-gray-600/50 backdrop-blur border border-gray-400/30
                   text-gray-200 text-sm font-medium transition opacity-75 hover:opacity-100"
      >
        <SiZoom size={20} className="text-blue-400" />
        Open in Zoom App
      </motion.button>
    </motion.div>
  );
}