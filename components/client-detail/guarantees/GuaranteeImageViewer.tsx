import React from 'react';
import { Image, Pressable } from 'react-native';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface GuaranteeImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  description?: string;
}

export function GuaranteeImageViewer({
  isOpen,
  onClose,
  imageUrl,
  description,
}: GuaranteeImageViewerProps) {
  if (!isOpen || !imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full bg-card border border-border p-4 rounded-2xl">
        <DialogHeader className="mb-3">
          <DialogTitle className="text-foreground font-bold text-base">
            Foto de la garantía
          </DialogTitle>
          {description ? (
            <DialogDescription
              className="text-muted-foreground text-xs font-medium"
              numberOfLines={2}
            >
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        <Pressable onPress={onClose} className="active:opacity-80">
          <Image
            source={{ uri: imageUrl }}
            className="w-full aspect-[4/3] rounded-xl bg-muted"
            resizeMode="contain"
          />
        </Pressable>
      </DialogContent>
    </Dialog>
  );
}
