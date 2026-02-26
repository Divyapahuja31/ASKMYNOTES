import { create } from 'zustand';

export interface LoginFormData {
    email: string;
    password: string;
}

export type LoginFieldErrors = Partial<Record<keyof LoginFormData, string>>;

interface LoginState {
    formData: LoginFormData;
    errors: LoginFieldErrors;
    isSubmitting: boolean;
    isGoogleSubmitting: boolean;
    serverError: string;

    setFormData: (data: LoginFormData | ((prev: LoginFormData) => LoginFormData)) => void;
    setErrors: (errors: LoginFieldErrors | ((prev: LoginFieldErrors) => LoginFieldErrors)) => void;
    setIsSubmitting: (loading: boolean) => void;
    setIsGoogleSubmitting: (loading: boolean) => void;
    setServerError: (error: string) => void;
    reset: () => void;
}

export const useLoginStore = create<LoginState>((set) => ({
    formData: { email: '', password: '' },
    errors: {},
    isSubmitting: false,
    isGoogleSubmitting: false,
    serverError: '',

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
    reset: () => set({
        formData: { email: '', password: '' },
        errors: {},
        isSubmitting: false,
        isGoogleSubmitting: false,
        serverError: ''
    }),
}));
