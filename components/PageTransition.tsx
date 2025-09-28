'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import LoadingSpinner from './LoadingSpinner'

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)
  const pathname = usePathname()
  const previousPathname = useRef(pathname)

  useEffect(() => {
    // Only trigger transition if pathname actually changed
    if (previousPathname.current !== pathname) {
      setIsExiting(true)
      
      // Brief exit animation
      const exitTimer = setTimeout(() => {
        setIsLoading(true)
        setDisplayChildren(children)
        setIsExiting(false)
        
        // Brief loading state for smooth transition
        const loadingTimer = setTimeout(() => {
          setIsLoading(false)
        }, 150)
        
        return () => clearTimeout(loadingTimer)
      }, 100)
      
      previousPathname.current = pathname
      return () => clearTimeout(exitTimer)
    }
  }, [pathname, children])

  return (
    <div className="page-container relative">
      {/* Exit overlay */}
      {isExiting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity duration-200" />
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="page-enter">
            <LoadingSpinner size="lg" text="Đang chuyển trang..." />
          </div>
        </div>
      )}
      
      <div className={`transition-all duration-300 ease-out ${
        isExiting ? 'opacity-0 scale-98' : 
        isLoading ? 'opacity-0 scale-95' : 
        'opacity-100 scale-100'
      }`}>
        {displayChildren}
      </div>
    </div>
  )
}
