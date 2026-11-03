import React from 'react';
import { Image, Pressable, View } from 'react-native';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface ClientPhotoViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  clientName: string;
  idNumber?: string;
}

export function ClientPhotoViewer({
  isOpen,
  onClose,
  imageUrl,
  clientName,
  idNumber,
}: ClientPhotoViewerProps) {
  if (!isOpen || !imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full bg-card border border-border p-4 rounded-3xl">
        <DialogHeader className="mb-3">
          <DialogTitle className="text-foreground font-bold text-lg">
            {clientName}
          </DialogTitle>
          {idNumber ? (
            <DialogDescription className="text-muted-foreground text-sm font-medium">
              CI: {idNumber}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        <Pressable onPress={onClose} className="active:opacity-90">
          <View className="w-full aspect-square rounded-2xl overflow-hidden bg-muted items-center justify-center border border-border/50">
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </Pressable>
      </DialogContent>
    </Dialog>
  );
}

