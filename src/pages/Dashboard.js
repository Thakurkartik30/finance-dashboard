import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaWallet, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SummaryCard from '../components/SummaryCard';
import TransactionTable from '../components/TransactionTable';
import TopCategoriesChart from '../components/TopCategoriesChart';

const Dashboard = ({ transactions = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [topCategories, setTopCategories] = useState([]);
  
  // Get recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Calculate summary and categories when transactions change
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const income = transactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);

      const expenses = transactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0);

      setSummary({
        totalIncome: income,
        totalExpenses: expenses,
        balance: income - expenses,
      });

      // Calculate top categories
      const categoryMap = {};
      
      transactions
        .filter(tx => tx.type === 'expense')
        .forEach(tx => {
          if (!categoryMap[tx.category]) {
            categoryMap[tx.category] = 0;
          }
          categoryMap[tx.category] += tx.amount;
        });

      const categories = Object.entries(categoryMap)
        .map(([category, amount]) => ({
          category,
          amount: parseFloat(amount.toFixed(2)),
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      setTopCategories(categories);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Total Income" 
          amount={summary.totalIncome.toFixed(2)} 
          change={5.2} 
          icon={FaArrowUp} 
          trend="up" 
        />
        <SummaryCard 
          title="Total Expenses" 
          amount={summary.totalExpenses.toFixed(2)} 
          change={2.7} 
          icon={FaArrowDown} 
          trend="down" 
        />
        <SummaryCard 
          title="Current Balance" 
          amount={summary.balance.toFixed(2)} 
          change={3.8} 
          icon={FaWallet} 
          trend={summary.balance >= 0 ? 'up' : 'down'} 
        />
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-medium mb-4">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <TransactionTable transactions={recentTransactions} showCategory={true} />
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <TopCategoriesChart data={topCategories} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
