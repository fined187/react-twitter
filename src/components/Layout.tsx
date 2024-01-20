import React from 'react'
import MenuList from './Menu'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="layout">
        {children}
        <MenuList />
      </div>
    </>
  )
}
