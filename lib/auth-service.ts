import { supabase } from './supabase'

export const authService = {
  async register(email: string, password: string, name?: string) {
    const { data: auth, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'USER'
        }
      }
    })

    if (signUpError) throw signUpError

    // Create initial account for user
    const { error: accountError } = await supabase
      .from('accounts')
      .insert([
        {
          user_id: auth.user?.id,
          balance: 0,
          currency: 'USD'
        }
      ])

    if (accountError) throw accountError

    return auth
  },

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }
} 