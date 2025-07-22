import React, { useState } from 'react';
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
    inputType: 'file' | 'image'
}

const FileUploader: React.FC<FileUploaderType> = ({
    data = {},
    size = {},
    inputType,
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
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

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
                accept={inputType === 'image' ? 'image/*' : '*'}
                className={cl.uploader}
                style={{
                    backgroundImage: `url(${imagePreview || image})`,
                }}
                onChange={ inputType === 'image' && handleImageLoaded}
            />
        </div>
    );
};

export default FileUploader;