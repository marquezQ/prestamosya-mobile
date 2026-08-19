import React from 'react';
import { View } from 'react-native';
import { cn } from '@/lib/utils';

interface LoanProgressBarProps {
  paid: number;
  total: number;
  className?: string;
}

export function LoanProgressBar({ paid, total, className }: LoanProgressBarProps) {
  const validTotal = total > 0 ? total : 1;
  const percentage = Math.min(Math.max((paid / validTotal) * 100, 0), 100);

  return (
    <View className={cn('h-3 w-full bg-secondary/15 rounded-full overflow-hidden', className)}>
      <View
        className="h-full bg-secondary rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </View>
  );
}
