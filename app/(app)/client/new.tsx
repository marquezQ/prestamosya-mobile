import React from 'react';
import { View, Pressable, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { KeyboardAwareScrollView } from '@/components/ui/KeyboardAwareScrollView';
import { ArrowLeft } from 'lucide-react-native';
import { ClientForm } from '@/components/clients/ClientForm';

export default function NewClientScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Custom Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-border bg-background">
        <Pressable 
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center -ml-2 rounded-full active:bg-muted"
        >
          <ArrowLeft size={24} className="text-foreground" />
        </Pressable>
        <Text className="font-bold text-lg text-foreground ml-2">
          Nuevo Cliente
        </Text>
      </View>

      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <ClientForm onSuccess={() => router.back()} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </View>
  );
}
