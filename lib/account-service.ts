import { supabase } from './supabase'
import type { Account } from './supabase'

export const accountService = {
  async getUserAccounts(userId: string) {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data as Account[]
  },

  async getAccount(accountId: string) {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', accountId)
      .single()

    if (error) throw error
    return data as Account
  },

  async updateBalance(accountId: string, amount: number) {
    const { data, error } = await supabase
      .from('accounts')
      .update({ balance: amount })
      .eq('id', accountId)
      .select()
      .single()

    if (error) throw error
    return data as Account
  }
} 