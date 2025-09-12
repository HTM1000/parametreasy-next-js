"use client"

import React from 'react'

interface HtmlNode {
  name: string
  type: string
  text?: string
  children?: HtmlNode[]
  attributes?: { [key: string]: string }
}

export function parseHtml(html: string): HtmlNode[] {
  // Simple HTML parser - create HTML element and traverse
  const div = document.createElement('div')
  div.innerHTML = html
  
  function nodeToHtmlNode(node: ChildNode): HtmlNode | null {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim()
      return text ? {
        name: '#text',
        type: 'text',
        text: text
      } : null
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element
      const htmlNode: HtmlNode = {
        name: element.tagName.toLowerCase(),
        type: 'element',
        children: [],
        attributes: {}
      }
      
      // Copy attributes
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i]
        htmlNode.attributes![attr.name] = attr.value
      }
      
      // Process children
      for (let i = 0; i < element.childNodes.length; i++) {
        const child = nodeToHtmlNode(element.childNodes[i])
        if (child) {
          htmlNode.children!.push(child)
        }
      }
      
      return htmlNode
    }
    return null
  }
  
  const result: HtmlNode[] = []
  for (let i = 0; i < div.childNodes.length; i++) {
    const node = nodeToHtmlNode(div.childNodes[i])
    if (node) {
      result.push(node)
    }
  }
  
  return result
}

export function convertHtmlToWpfStyle(html: string): React.ReactNode {
  if (!html.trim()) return null
  
  // If it's just text without HTML tags, wrap in paragraph
  if (!html.includes('<') || (html.includes('<') && !html.includes('</') && !html.includes('/>'))) {
    return (
      <div className="wpf-paragraph">
        {html}
      </div>
    )
  }
  
  const nodes = parseHtml(html)
  return nodes.map((node, index) => convertNodeToReact(node, index))
}

function convertNodeToReact(node: HtmlNode, key: number): React.ReactNode {
  if (node.type === 'text') {
    return <span key={key} className="wpf-text">{decodeHtmlEntities(node.text || '')}</span>
  }
  
  switch (node.name) {
    case 'p':
      return (
        <div key={key} className="wpf-paragraph">
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </div>
      )
    
    case 'h1':
      return (
        <div key={key} className="wpf-h1">
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </div>
      )
    
    case 'h2':
      return (
        <div key={key} className="wpf-h2">
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </div>
      )
    
    case 'h3':
      return (
        <div key={key} className="wpf-h3">
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </div>
      )
    
    case 'strong':
    case 'b':
      return (
        <span key={key} className="wpf-bold">
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </span>
      )
    
    case 'em':
    case 'i':
      return (
        <span key={key} className="wpf-italic">
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </span>
      )
    
    case 'u':
    case 'ins':
      return (
        <span key={key} className="wpf-underline">
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </span>
      )
    
    case 'del':
      return (
        <span key={key} className="wpf-strikethrough">
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </span>
      )
    
    case 'mark':
      return (
        <span key={key} className="wpf-highlight">
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </span>
      )
    
    case 'small':
      return (
        <span key={key} className="wpf-small">
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </span>
      )
    
    case 'sup':
      return (
        <span key={key} className="wpf-superscript">
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </span>
      )
    
    case 'sub':
      return (
        <span key={key} className="wpf-subscript">
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </span>
      )
    
    case 'code':
      return (
        <span key={key} className="wpf-code-inline">
          {decodeHtmlEntities(node.children?.map(c => c.text || '').join('') || '')}
        </span>
      )
    
    case 'kbd':
      return (
        <span key={key} className="wpf-keyboard">
          {decodeHtmlEntities(node.children?.map(c => c.text || '').join('') || '')}
        </span>
      )
    
    case 'var':
      return (
        <span key={key} className="wpf-variable">
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </span>
      )
    
    case 'samp':
      return (
        <span key={key} className="wpf-sample">
          {decodeHtmlEntities(node.children?.map(c => c.text || '').join('') || '')}
        </span>
      )
    
    case 'time':
      const datetime = node.attributes?.datetime
      return (
        <span key={key} className="wpf-time" title={datetime ? `Data/Hora: ${datetime}` : undefined}>
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </span>
      )
    
    case 'abbr':
      return (
        <span key={key} className="wpf-abbreviation" title={node.attributes?.title}>
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </span>
      )
    
    case 'q':
      return (
        <span key={key} className="wpf-quote">
          "{node.children?.map((child, i) => convertNodeToReact(child, i))}"
        </span>
      )
    
    case 'dfn':
      return (
        <span key={key} className="wpf-definition">
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </span>
      )
    
    case 'cite':
      return (
        <span key={key} className="wpf-citation">
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </span>
      )
    
    case 'address':
      return (
        <div key={key} className="wpf-address">
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </div>
      )
    
    case 'blockquote':
      return (
        <div key={key} className="wpf-blockquote">
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </div>
      )
    
    case 'pre':
      return (
        <div key={key} className="wpf-preformatted">
          {node.children?.map(child => child.text || '').join('').split('\n').map((line, i) => (
            <div key={i}>
              {line || ' '}
              {i < (node.children?.map(child => child.text || '').join('').split('\n').length || 0) - 1 && <br />}
            </div>
          ))}
        </div>
      )
    
    case 'ul':
      return (
        <div key={key} className="wpf-list-unordered">
          {node.children?.filter(child => child.name === 'li').map((child, i) => (
            <div key={i} className="wpf-list-item">
              <span className="wpf-list-marker">• </span>
              {child.children?.map((subchild, j) => convertNodeToReact(subchild, j))}
            </div>
          ))}
        </div>
      )
    
    case 'ol':
      return (
        <div key={key} className="wpf-list-ordered">
          {node.children?.filter(child => child.name === 'li').map((child, i) => (
            <div key={i} className="wpf-list-item">
              <span className="wpf-list-marker">{i + 1}. </span>
              {child.children?.map((subchild, j) => convertNodeToReact(subchild, j))}
            </div>
          ))}
        </div>
      )
    
    case 'details':
      const summary = node.children?.find(child => child.name === 'summary')
      const content = node.children?.filter(child => child.name !== 'summary')
      return (
        <div key={key} className="wpf-details">
          <div className="wpf-summary">
            ▶ {summary ? summary.children?.map((child, i) => convertNodeToReact(child, i)) : 'Details'}
          </div>
          {content?.map((child, i) => convertNodeToReact(child, i))}
        </div>
      )
    
    case 'figure':
      const figcaption = node.children?.find(child => child.name === 'figcaption')
      return (
        <div key={key} className="wpf-figure">
          🖼️ {figcaption ? figcaption.children?.map((child, i) => convertNodeToReact(child, i)) : '[Figura]'}
        </div>
      )
    
    case 'progress':
      const value = parseFloat(node.attributes?.value || '0')
      const max = parseFloat(node.attributes?.max || '100')
      const percentage = max > 0 ? Math.round((value / max) * 100) : 0
      const filled = Math.round((value / max) * 10)
      const empty = 10 - filled
      
      return (
        <div key={key} className="wpf-progress">
          [{'█'.repeat(filled)}{'░'.repeat(empty)}] {percentage}%
        </div>
      )
    
    case 'meter':
      const meterValue = parseFloat(node.attributes?.value || '0')
      const meterMin = parseFloat(node.attributes?.min || '0')
      const meterMax = parseFloat(node.attributes?.max || '1')
      const meterPercentage = meterMax > meterMin ? Math.round(((meterValue - meterMin) / (meterMax - meterMin)) * 100) : 0
      const meterFilled = Math.round(((meterValue - meterMin) / (meterMax - meterMin)) * 10)
      const meterEmpty = 10 - meterFilled
      
      return (
        <div key={key} className="wpf-meter">
          [{'█'.repeat(meterFilled)}{'░'.repeat(meterEmpty)}] {meterPercentage}%
        </div>
      )
    
    case 'br':
      return <div key={key} className="wpf-line-break"> </div>
    
    case 'hr':
      return <div key={key} className="wpf-horizontal-rule">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
    
    case 'span':
      const style = node.attributes?.style
      const className = node.attributes?.class
      let spanClass = 'wpf-span'
      
      if (className) {
        switch (className.toLowerCase()) {
          case 'highlight':
            spanClass += ' wpf-highlight'
            break
          case 'error':
            spanClass += ' wpf-error'
            break
          case 'success':
            spanClass += ' wpf-success'
            break
          case 'info':
            spanClass += ' wpf-info'
            break
          case 'muted':
            spanClass += ' wpf-muted'
            break
        }
      }
      
      return (
        <span key={key} className={spanClass} style={parseInlineStyle(style)}>
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </span>
      )
    
    default:
      return (
        <span key={key}>
          {node.children?.map((child, i) => convertNodeToReact(child, i))}
        </span>
      )
  }
}

function parseInlineStyle(style?: string): React.CSSProperties {
  if (!style) return {}
  
  const styles: React.CSSProperties = {}
  const rules = style.split(';')
  
  for (const rule of rules) {
    const [property, value] = rule.split(':').map(s => s.trim())
    if (property && value) {
      switch (property.toLowerCase()) {
        case 'color':
          styles.color = value
          break
        case 'background-color':
          styles.backgroundColor = value
          break
        case 'font-weight':
          if (value.toLowerCase() === 'bold' || value === '700') {
            styles.fontWeight = 'bold'
          } else if (value.toLowerCase() === 'bolder' || value === '800' || value === '900') {
            styles.fontWeight = '900'
          }
          break
        case 'font-style':
          if (value.toLowerCase() === 'italic') {
            styles.fontStyle = 'italic'
          }
          break
        case 'text-decoration':
          if (value.toLowerCase().includes('underline')) {
            styles.textDecoration = 'underline'
          }
          break
      }
    }
  }
  
  return styles
}

function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}