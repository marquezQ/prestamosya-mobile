import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

const TAGS = {
  month: {
    badge: 'bg-sky-500/10 border-sky-500/20',
    text: 'text-sky-700 dark:text-sky-300',
    label: 'Del mes',
  },
  now: {
    badge: 'bg-violet-500/10 border-violet-500/20',
    text: 'text-violet-700 dark:text-violet-300',
    label: 'Hoy',
  },
} as const;

interface SectionTagProps {
  kind: keyof typeof TAGS;
}

export function SectionTag({ kind }: SectionTagProps) {
  const tag = TAGS[kind];
  return (
    <View className={`px-2.5 py-0.5 rounded-full border ${tag.badge}`}>
      <Text className={`text-xs font-bold ${tag.text}`}>{tag.label}</Text>
    </View>
  );
}