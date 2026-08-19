'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(email: string, password: string, name: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()

  await supabase.auth.signOut()
  redirect('/auth/login')
}

export async function getSession() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session
}

export async function getUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export async function updateProfile(name?: string, password?: string) {
  const supabase = await createClient()

  const updates: any = {}

  if (name) {
    updates.data = { name }
  }

  if (password) {
    updates.password = password
  }

  if (Object.keys(updates).length === 0) {
    throw new Error('업데이트할 정보가 없습니다.')
  }

  const { error } = await supabase.auth.updateUser(updates)

  if (error) {
    throw new Error(error.message)
  }

  return { success: true }
}
