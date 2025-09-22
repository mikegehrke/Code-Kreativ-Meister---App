import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fallback for when Supabase is not properly configured
const SUPABASE_CONFIGURED = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = SUPABASE_CONFIGURED 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isSupabaseConfigured = () => SUPABASE_CONFIGURED

// Auth helpers (only available when Supabase is configured)
export const auth = SUPABASE_CONFIGURED ? supabase?.auth : null

// Database types
export interface Profile {
  id: string
  handle: string
  name: string
  bio?: string
  avatar?: string
  verified: boolean
  tier: 'free' | 'premium' | 'vip'
  followers_count: number
  following_count: number
  coins: number
  created_at: string
  updated_at: string
}

export interface Video {
  id: string
  title: string
  description?: string
  video_url: string
  thumbnail: string
  creator_id: string
  creator?: Profile
  venue_id?: string
  venue?: Venue
  stats: {
    views: number
    likes: number
    comments: number
  }
  tags: string[]
  is_premium: boolean
  is_live: boolean
  created_at: string
}

export interface Venue {
  id: string
  name: string
  address: string
  price: number
  currency: string
  is_open: boolean
  category: string
  rating: number
  creator_id: string
  created_at: string
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export interface Like {
  id: string
  user_id: string
  video_id: string
  created_at: string
}

export interface Comment {
  id: string
  user_id: string
  video_id: string
  content: string
  created_at: string
  user?: Profile
}

export interface Room {
  id: string
  name: string
  description?: string
  creator_id: string
  creator?: Profile
  is_private: boolean
  member_count: number
  max_members: number
  created_at: string
}

export interface Message {
  id: string
  content: string
  user_id: string
  user?: Profile
  room_id?: string
  recipient_id?: string
  created_at: string
}