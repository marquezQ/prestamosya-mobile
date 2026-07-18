# PrestamosYA Mobile — Agent Instructions

> **CRITICAL RULE**: Expo HAS CHANGED. Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any routing or core Expo code.

This file serves as the main pivot for AI agents working on this React Native (Expo) project. 

## 🏗️ Core Architecture Overview

This project is a React Native mobile application for managing micro-loans. It uses a modern, opinionated stack heavily inspired by web best practices, adapted for native development.

- **Framework**: Expo SDK 54 (React Native 0.81.5)
- **Routing**: Expo Router (File-based routing)
- **Styling**: NativeWind v4 (Tailwind CSS for React Native)
- **UI Components**: React Native Reusables (shadcn/ui equivalent)
- **Data Fetching**: TanStack React Query + Axios
- **Client State**: Zustand
- **Forms**: React Hook Form + Zod

## 📖 Detailed Context Directives

To maintain consistency and prevent breaking the architecture, **you MUST read the specific context file** before working on a related feature. All context files are located in the `.agents/` directory:

1. **Stack & Setup**: See `.agents/STACK.md` for exact dependency versions and configuration file explanations.
2. **Routing & Navigation**: See `.agents/ROUTING.md` for how the `app/` directory is structured, how to use `_layout.tsx`, and how we handle Safe Areas edge-to-edge.
3. **UI, Components & Styling**: See `.agents/UI_AND_STYLES.md` for rules on using `className` vs `style`, how to use the RNR components in `components/ui/`, and how the CSS variables theme works.
4. **Data Fetching & State**: See `.agents/DATA_AND_STATE.md` for Axios interceptors, React Query usage rules, and Zustand store structures.
5. **Forms & Validation**: See `.agents/FORMS.md` for the standard way to implement forms using Zod schemas and hookform resolvers.

---
*Note to Agents: Do not deviate from these established patterns without explicit user permission. Always prioritize `className` (Tailwind) over inline `style`, use specific hooks for Safe Areas, and do not mix client state (Zustand) with server state (React Query).*
