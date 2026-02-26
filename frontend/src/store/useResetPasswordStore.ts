import { create } from 'zustand';

interface ResetPasswordState {
    password: string;
    confirmPassword: string;
    isSubmitting: boolean;
    serverError: string;
    successMessage: string;

    setPassword: (password: string) => void;
    setConfirmPassword: (confirmPassword: string) => void;
    setIsSubmitting: (loading: boolean) => void;
    setServerError: (error: string) => void;
    setSuccessMessage: (message: string) => void;
    reset: () => void;
}

export const useResetPasswordStore = create<ResetPasswordState>((set) => ({
    password: '',
    confirmPassword: '',
    isSubmitting: false,
    serverError: '',
    successMessage: '',

    setPassword: (password) => set({ password }),
    setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    setServerError: (serverError) => set({ serverError }),
    setSuccessMessage: (successMessage) => set({ successMessage }),
    reset: () => set({
        password: '',
        confirmPassword: '',
        isSubmitting: false,
        serverError: '',
        successMessage: ''
    }),
}));
