import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BusinessConfigForm } from "./BusinessConfigForm";

interface BusinessConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BusinessConfigModal({ isOpen, onClose }: BusinessConfigModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg w-full bg-card border border-border p-5 rounded-3xl">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-foreground font-bold text-xl">
            Editar Configuración
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs font-medium">
            Modifica los parámetros del negocio y mora
          </DialogDescription>
        </DialogHeader>

        <BusinessConfigForm onSuccessCallback={onClose} />
      </DialogContent>
    </Dialog>
  );
}
