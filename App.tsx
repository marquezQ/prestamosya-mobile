import "./global.css";

import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PortalHost } from "@rn-primitives/portal";

// Import RNR components
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Initialize Query Client with a reasonable staleTime (e.g. 5 minutes)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="auto" />
        
        <ScrollView className="flex-1 px-4 py-6">
          <View className="gap-6 pb-12">
            
            {/* Header Section */}
            <View className="border-border border-b pb-4">
              <Text className="text-3xl font-extrabold tracking-tight text-primary">
                PrestamosYA
              </Text>
              <Text className="text-muted-foreground text-sm mt-1">
                Base setup con NativeWind v4 + React Native Reusables + React Query
              </Text>
            </View>

            {/* RNR Button Demos */}
            <View className="gap-2">
              <Text className="text-lg font-bold text-foreground">1. RNR Buttons</Text>
              <View className="flex-row flex-wrap gap-2">
                <Button variant="default">
                  <Text>Default</Text>
                </Button>
                
                <Button variant="secondary">
                  <Text>Secondary</Text>
                </Button>
                
                <Button variant="outline">
                  <Text>Outline</Text>
                </Button>
                
                <Button variant="destructive">
                  <Text>Destructive</Text>
                </Button>
              </View>
            </View>

            {/* RNR Dialog Demo */}
            <View className="gap-2">
              <Text className="text-lg font-bold text-foreground">2. RNR Dialog</Text>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Text>Abrir Modal de Prueba</Text>
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="w-[90%] max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Confirmación de Acción</DialogTitle>
                    <DialogDescription>
                      Este es un componente Dialog de React Native Reusables (RNR) estilizado con NativeWind.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4 gap-2">
                    <Button variant="outline" onPress={() => setDialogOpen(false)}>
                      <Text>Cancelar</Text>
                    </Button>
                    <Button variant="default" onPress={() => setDialogOpen(false)}>
                      <Text>Entendido</Text>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </View>

            {/* RNR Accordion Demo */}
            <View className="gap-2">
              <Text className="text-lg font-bold text-foreground">3. RNR Accordion</Text>
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <Text className="font-semibold">¿Qué es PrestamosYA?</Text>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Text className="text-muted-foreground text-sm">
                      Es una plataforma móvil robusta para la gestión y solicitud de microcréditos de manera ágil y segura.
                    </Text>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    <Text className="font-semibold">¿Qué tecnologías utiliza?</Text>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Text className="text-muted-foreground text-sm">
                      Está construida utilizando React Native + Expo SDK 54, TypeScript, Tailwind CSS (NativeWind v4), Zustand para estado local y TanStack React Query para manejo del servidor.
                    </Text>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </View>

          </View>
        </ScrollView>

        {/* PortalHost required for rendering Dialogs, Dropdowns, Popovers, etc. on Native */}
        <PortalHost />
      </SafeAreaView>
    </QueryClientProvider>
  );
}
