import { create } from 'zustand';

interface ForgotPasswordState {
    email: string;
    isSubmitting: boolean;
    serverError: string;
    successMessage: string;

    setEmail: (email: string) => void;
    setIsSubmitting: (loading: boolean) => void;
    setServerError: (error: string) => void;
    setSuccessMessage: (message: string) => void;
    reset: () => void;
}

export const useForgotPasswordStore = create<ForgotPasswordState>((set) => ({
    email: '',
    isSubmitting: false,
    serverError: '',
    successMessage: '',

    setEmail: (email) => set({ email }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    setServerError: (serverError) => set({ serverError }),
    setSuccessMessage: (successMessage) => set({ successMessage }),
    reset: () => set({
        email: '',
        isSubmitting: false,
        serverError: '',
        successMessage: ''
    }),
}));
