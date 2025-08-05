import React, { useEffect, useState } from 'react';
import cl from './FileUploader.module.scss'

type FileUploaderType = {
    data?: {
        image?: string;
        placeholder?: string;
    },
    size?: {
        width?: number;
        height?: number
    },
    inputType: 'file' | 'image',
    required?: boolean;
    onChange: (file: File | null) => void;
}

const FileUploader: React.FC<FileUploaderType> = ({
    data = {},
    size = {},
    inputType,
    required = true,
    onChange
}) => {
    const {
        image = '',
        placeholder = 'Завантажити файл'
    } = data;

    const {
        width = 200,
        height = 200
    } = size;

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    function handleImageLoaded(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;
        
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }

        // console.log('imageFile:', file);
        
        return file;
    }

    useEffect(() => {
    // console.log('imagePreview ',imagePreview)
}, [ imagePreview]);
    return (
        <div
            style={{
                height: height,
                maxWidth: width,
            }}
            className={cl.container}
        >
            <input
                type="file"
                required={required}
                accept={inputType === 'image' ? 'image/*' : '*'}
                className={cl.uploader}
                style={{
                    backgroundImage: `url(${imagePreview || image})`,
                }}
                onChange={e => {
                    onChange(handleImageLoaded(e))
                }}
            />
        </div>
    );
};

export default FileUploader;