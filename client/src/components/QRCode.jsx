import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function QRCode({ text, size = 200, level = 'H', fgColor = '#000000', bgColor = '#FFFFFF' }) {
  if (!text) return null
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="p-2 bg-white rounded-lg inline-block">
        <QRCodeSVG
          value={text}
          size={size}
          level={level}
          fgColor={fgColor}
          bgColor={bgColor}
        />
      </div>
      <div className="text-slate-400 text-sm text-center max-w-xs">
        Scan this QR code to complete your payment
      </div>
    </div>
  )
}
