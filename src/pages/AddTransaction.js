import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm';

const AddTransaction = ({ onAddTransaction }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (transaction) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Call the parent's onAddTransaction function to add the new transaction
      await onAddTransaction(transaction);
      // Navigate back to the dashboard after successful submission
      navigate('/');
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Failed to add transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Transaction</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>
      </div>
      
      <div className="card">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <TransactionForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default AddTransaction;
