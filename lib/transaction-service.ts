import { supabase } from './supabase'
import type { Transaction } from './supabase'
import { accountService } from './account-service'

export const transactionService = {
  async createTransaction(
    accountId: string,
    userId: string,
    type: Transaction['type'],
    amount: number,
    toAccountId?: string
  ) {
    const account = await accountService.getAccount(accountId)
    
    if (type === 'WITHDRAWAL' || type === 'TRANSFER') {
      if (account.balance < amount) {
        throw new Error('Insufficient funds')
      }
    }

    // Start a Supabase transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          account_id: accountId,
          user_id: userId,
          type,
          amount,
          status: 'COMPLETED'
        }
      ])
      .select()
      .single()

    if (transactionError) throw transactionError

    // Update account balance
    let newBalance: number
    switch (type) {
      case 'DEPOSIT':
        newBalance = account.balance + amount
        break
      case 'WITHDRAWAL':
        newBalance = account.balance - amount
        break
      case 'TRANSFER':
        if (!toAccountId) throw new Error('Destination account is required for transfers')
        
        // Update source account
        newBalance = account.balance - amount
        await accountService.updateBalance(accountId, newBalance)
        
        // Update destination account
        const toAccount = await accountService.getAccount(toAccountId)
        await accountService.updateBalance(toAccountId, toAccount.balance + amount)
        break
      default:
        throw new Error('Invalid transaction type')
    }

    if (type !== 'TRANSFER') {
      await accountService.updateBalance(accountId, newBalance!)
    }

    return transaction as Transaction
  },

  async getAccountTransactions(accountId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('account_id', accountId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Transaction[]
  }
} 