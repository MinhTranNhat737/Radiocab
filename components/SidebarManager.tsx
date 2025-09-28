'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface SidebarContextType {
  leftCollapsed: boolean
  rightCollapsed: boolean
  setLeftCollapsed: (collapsed: boolean) => void
  setRightCollapsed: (collapsed: boolean) => void
  toggleSidebars: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)

  const toggleSidebars = () => {
    const newState = !leftCollapsed
    setLeftCollapsed(newState)
    setRightCollapsed(newState)
  }

  // Ensure both sidebars always have the same state
  const setLeftCollapsedSync = (collapsed: boolean) => {
    setLeftCollapsed(collapsed)
    setRightCollapsed(collapsed)
  }

  const setRightCollapsedSync = (collapsed: boolean) => {
    setLeftCollapsed(collapsed)
    setRightCollapsed(collapsed)
  }

  return (
    <SidebarContext.Provider value={{
      leftCollapsed,
      rightCollapsed,
      setLeftCollapsed: setLeftCollapsedSync,
      setRightCollapsed: setRightCollapsedSync,
      toggleSidebars
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
