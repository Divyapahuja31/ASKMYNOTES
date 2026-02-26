import { create } from 'zustand';

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export type RegisterFieldErrors = Partial<Record<keyof RegisterFormData, string>>;

interface RegisterState {
    formData: RegisterFormData;
    errors: RegisterFieldErrors;
    isSubmitting: boolean;
    isGoogleSubmitting: boolean;
    serverError: string;
    successMessage: string;

    setFormData: (data: RegisterFormData | ((prev: RegisterFormData) => RegisterFormData)) => void;
    setErrors: (errors: RegisterFieldErrors | ((prev: RegisterFieldErrors) => RegisterFieldErrors)) => void;
    setIsSubmitting: (loading: boolean) => void;
    setIsGoogleSubmitting: (loading: boolean) => void;
    setServerError: (error: string) => void;
    setSuccessMessage: (message: string) => void;
    reset: () => void;
}

export const useRegisterStore = create<RegisterState>((set) => ({
    formData: { name: '', email: '', password: '', confirmPassword: '' },
    errors: {},
    isSubmitting: false,
    isGoogleSubmitting: false,
    serverError: '',
    successMessage: '',

    setFormData: (payload) =>
        set((state) => ({
            formData: typeof payload === 'function' ? payload(state.formData) : payload
        })),
    setErrors: (payload) =>
        set((state) => ({
            errors: typeof payload === 'function' ? payload(state.errors) : payload
        })),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    setIsGoogleSubmitting: (isGoogleSubmitting) => set({ isGoogleSubmitting }),
    setServerError: (serverError) => set({ serverError }),
    setSuccessMessage: (successMessage) => set({ successMessage }),
    reset: () => set({
        formData: { name: '', email: '', password: '', confirmPassword: '' },
        errors: {},
        isSubmitting: false,
        isGoogleSubmitting: false,
        serverError: '',
        successMessage: ''
    }),
}));
