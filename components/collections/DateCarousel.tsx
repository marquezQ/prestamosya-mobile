import React, { useRef, useEffect } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { format, isSameDay, subDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface DateCarouselProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function DateCarousel({ selectedDate, onSelectDate }: DateCarouselProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  // Generate 11 days window (5 days before, today, 5 days after)
  const today = new Date();
  const daysWindow = Array.from({ length: 11 }, (_, i) => subDays(today, 5 - i));

  // Auto scroll to center selected date
  useEffect(() => {
    const selectedIndex = daysWindow.findIndex((d) => isSameDay(d, selectedDate));
    if (selectedIndex !== -1 && scrollViewRef.current) {
      const itemWidth = 72; // 64px card width + 8px margin
      const scrollX = Math.max(0, selectedIndex * itemWidth - 120);
      scrollViewRef.current.scrollTo({ x: scrollX, animated: true });
    }
  }, [selectedDate]);

  return (
    <View className="py-2.5">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="flex-row"
      >
        {daysWindow.map((dateItem) => {
          const isSelected = isSameDay(dateItem, selectedDate);
          const isToday = isSameDay(dateItem, today);

          // Day initial (L, M, M, J, V, S, D) and day number (18, 19, 20...)
          const dayLetter = format(dateItem, 'EEEEEE', { locale: es }).toUpperCase();
          const dayNum = format(dateItem, 'd', { locale: es });

          return (
            <Pressable
              key={dateItem.toISOString()}
              onPress={() => onSelectDate(dateItem)}
              className={`w-16 h-20 mr-2.5 rounded-2xl items-center justify-center border transition-all ${
                isSelected
                  ? 'bg-secondary border-secondary shadow-md'
                  : 'bg-card border-border active:bg-muted'
              }`}
            >
              <Text
                className={`text-sm font-bold uppercase tracking-wider mb-1 ${
                  isSelected ? 'text-white/90' : 'text-muted-foreground'
                }`}
              >
                {dayLetter}
              </Text>

              <View className="items-center justify-center">
                <Text
                  className={`text-xl font-extrabold ${
                    isSelected ? 'text-white' : 'text-foreground'
                  }`}
                >
                  {dayNum}
                </Text>

                {/* Today indicator dot */}
                {isToday && !isSelected && (
                  <View className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
