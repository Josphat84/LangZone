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

    const encodedPwd = encodeURIComponent(zoomPassword);
    const zoomAppLink = `zoommtg://zoom.us/join?confno=${zoomMeetingId}&pwd=${encodedPwd}`;
    const zoomWebFallback = `https://zoom.us/j/${zoomMeetingId}?pwd=${encodedPwd}`;

    // Try opening Zoom app
    window.location.href = zoomAppLink;

    // Fallback to browser if app fails
    setTimeout(() => window.open(zoomWebFallback, '_blank'), 500);
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

      {/* Zoom */}
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
    </motion.div>
  );
}
