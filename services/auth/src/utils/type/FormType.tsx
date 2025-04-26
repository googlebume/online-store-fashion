export interface FormType {
    type: 'register' | 'login';
}
export interface FormPropsType {
    setSwitchForm: React.Dispatch<React.SetStateAction<FormType>>;
}