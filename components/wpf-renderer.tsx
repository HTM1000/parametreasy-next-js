"use client"

import React from 'react'
import { convertHtmlToWpfStyle } from '@/lib/html-renderer'

interface WpfRendererProps {
  html: string
  className?: string
}

export default function WpfRenderer({ html, className = '' }: WpfRendererProps) {
  const renderedContent = convertHtmlToWpfStyle(html)
  
  if (!renderedContent) {
    return (
      <div className={`wpf-container ${className}`}>
        <div className="text-center text-gray-500 italic py-8">
          <span className="text-lg">🖥️</span>
          <p className="mt-2">Nenhum conteúdo para exibir</p>
          <p className="text-sm">Digite algo no editor para ver o preview WPF aqui</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`wpf-container ${className}`}>
      {renderedContent}
    </div>
  )
}