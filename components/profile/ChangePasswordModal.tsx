import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChangePasswordForm } from "./ChangePasswordForm";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg w-full bg-card border border-border p-5 rounded-3xl">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-foreground font-bold text-xl">
            Cambiar Contraseña
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs font-medium">
            Ingresa tu contraseña actual y la nueva contraseña
          </DialogDescription>
        </DialogHeader>

        <ChangePasswordForm onSuccessCallback={onClose} />
      </DialogContent>
    </Dialog>
  );
}
