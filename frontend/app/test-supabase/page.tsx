'use client'

import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function TestSupabase() {
  const [connectionStatus, setConnectionStatus] = useState('Testing...')

  useEffect(() => {
    async function testConnection() {
      try {
        // Simple test - just check if supabase client exists
        console.log('Supabase client:', supabase)
        setConnectionStatus('✅ Supabase client loaded successfully!')
      } catch (error) {
        setConnectionStatus('❌ Connection failed: ' + error.message)
      }
    }

    testConnection()
  }, [])

  return (
    <div>
      <h1>Supabase Connection Test</h1>
      <p>{connectionStatus}</p>
    </div>
  )
}