'use client'

import { getSupabaseClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function TestSupabase() {
  const [connectionStatus, setConnectionStatus] = useState('Testing...')

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = getSupabaseClient() // ✅ get fresh client
        // Simple test - just check if supabase client exists
        console.log('Supabase client:', supabase)
        setConnectionStatus('✅ Supabase client loaded successfully!')
      } catch (error: any) {
        setConnectionStatus('❌ Connection failed: ' + error.message)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <p className="text-lg">{connectionStatus}</p>
    </div>
  )
}
