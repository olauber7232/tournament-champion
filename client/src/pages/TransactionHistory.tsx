import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, Upload, Gift, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@shared/schema";

interface TransactionHistoryProps {
  onBack: () => void;
}

export default function TransactionHistory({ onBack }: TransactionHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'referral' | 'tournament'>('all');

  const { data: transactionsData, isLoading } = useQuery<{ transactions: Transaction[] }>({
    queryKey: ['/api/transactions', localStorage.getItem('userId')],
  });

  const transactions = transactionsData?.transactions || [];

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Download className="w-4 h-4 text-green-500" />;
      case 'withdrawal':
        return <Upload className="w-4 h-4 text-red-500" />;
      case 'referral':
        return <Gift className="w-4 h-4 text-blue-500" />;
      case 'tournament':
        return <TrendingDown className="w-4 h-4 text-orange-500" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'referral':
        return 'text-green-500';
      case 'withdrawal':
      case 'tournament':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors] || colors.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Transaction History</h1>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'deposit', label: 'Deposits' },
          { key: 'withdrawal', label: 'Withdrawals' },
          { key: 'referral', label: 'Referrals' },
          { key: 'tournament', label: 'Tournaments' },
        ].map((item) => (
          <Button
            key={item.key}
            variant={filter === item.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(item.key as any)}
            className={filter === item.key ? 'gradient-gaming' : ''}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {/* Transaction Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-850 border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-sm text-muted-foreground">Total Received</div>
                <div className="text-lg font-semibold text-green-500">
                  {formatCurrency(
                    transactions
                      .filter(t => ['deposit', 'referral'].includes(t.type) && t.status === 'completed')
                      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-850 border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
                <div className="text-lg font-semibold text-red-500">
                  {formatCurrency(
                    transactions
                      .filter(t => ['withdrawal', 'tournament'].includes(t.type) && t.status === 'completed')
                      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <Card className="bg-gray-850 border-border">
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                {filter === 'all' ? 'No transactions found' : `No ${filter} transactions found`}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="bg-gray-850 border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <div className="font-medium">
                        {transaction.type === 'deposit' && 'Money Added'}
                        {transaction.type === 'withdrawal' && 'Money Withdrawn'}
                        {transaction.type === 'referral' && 'Referral Bonus'}
                        {transaction.type === 'tournament' && 'Tournament Entry'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                      </div>
                      {transaction.description && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {transaction.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                      {['deposit', 'referral'].includes(transaction.type) ? '+' : '-'}
                      {formatCurrency(parseFloat(transaction.amount))}
                    </div>
                    <div className="mt-1">
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}