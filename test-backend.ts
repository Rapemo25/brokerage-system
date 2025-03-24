import { authService } from './lib/auth-service'
import { accountService } from './lib/account-service'
import { transactionService } from './lib/transaction-service'
import { supabase } from './lib/supabase'

async function testBackend() {
  try {
    console.log('🏦 Starting backend tests...\n')

    // 1. Register a new user
    console.log('1️⃣ Testing user registration...')
    const auth = await authService.register(
      'test@example.com',
      'password123',
      'Test User'
    )
    console.log('✅ User registered successfully:', auth.user?.id)
    console.log('📧 Verify your email if required by Supabase\n')

    // 2. Login
    console.log('2️⃣ Testing login...')
    const loginData = await authService.login('test@example.com', 'password123')
    console.log('✅ Login successful\n')

    // 3. Get current user
    console.log('3️⃣ Getting current user...')
    const user = await authService.getCurrentUser()
    console.log('✅ Current user:', user?.id, '\n')

    // 4. Get user accounts
    console.log('4️⃣ Getting user accounts...')
    const accounts = await accountService.getUserAccounts(user!.id)
    console.log('✅ Found accounts:', accounts.length)
    const account = accounts[0]
    console.log('📊 Initial balance:', account.balance, '\n')

    // 5. Test deposit
    console.log('5️⃣ Testing deposit...')
    await transactionService.createTransaction(
      account.id,
      user!.id,
      'DEPOSIT',
      1000
    )
    const accountAfterDeposit = await accountService.getAccount(account.id)
    console.log('✅ Deposit successful. New balance:', accountAfterDeposit.balance, '\n')

    // 6. Test withdrawal
    console.log('6️⃣ Testing withdrawal...')
    await transactionService.createTransaction(
      account.id,
      user!.id,
      'WITHDRAWAL',
      500
    )
    const accountAfterWithdrawal = await accountService.getAccount(account.id)
    console.log('✅ Withdrawal successful. New balance:', accountAfterWithdrawal.balance, '\n')

    // 7. Create second account for transfer test
    console.log('7️⃣ Creating second account for transfer test...')
    const { data: secondAccount } = await supabase
      .from('accounts')
      .insert([
        {
          user_id: user!.id,
          balance: 0,
          currency: 'USD'
        }
      ])
      .select()
      .single()
    console.log('✅ Second account created\n')

    // 8. Test transfer
    console.log('8️⃣ Testing transfer...')
    await transactionService.createTransaction(
      account.id,
      user!.id,
      'TRANSFER',
      200,
      secondAccount.id
    )
    const [accountAfterTransfer, secondAccountAfterTransfer] = await Promise.all([
      accountService.getAccount(account.id),
      accountService.getAccount(secondAccount.id)
    ])
    console.log('✅ Transfer successful')
    console.log('📊 Source account balance:', accountAfterTransfer.balance)
    console.log('📊 Destination account balance:', secondAccountAfterTransfer.balance, '\n')

    // 9. Get transaction history
    console.log('9️⃣ Getting transaction history...')
    const transactions = await transactionService.getAccountTransactions(account.id)
    console.log('✅ Found transactions:', transactions.length)
    console.log('📜 Transaction history:', transactions.map(t => ({
      type: t.type,
      amount: t.amount,
      status: t.status
    })), '\n')

    // 10. Logout
    console.log('🔟 Testing logout...')
    await authService.logout()
    console.log('✅ Logout successful\n')

    console.log('🎉 All tests completed successfully!')

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the tests
testBackend() 