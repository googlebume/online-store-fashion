export interface FormType {
    type: 'register' | 'login' | 'verify';
}
export interface FormPropsType {
    setSwitchForm: React.Dispatch<React.SetStateAction<FormType>>;
}