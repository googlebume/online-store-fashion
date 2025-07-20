import React from 'react';
import cl from './FileUploader.module.scss'

type FileUploaderType = {
    data?: {
        image?: string;
        placeholder?: string;
    },
    size?: {
        width?: number;
        height?: number
    }
}

const FileUploader: React.FC<FileUploaderType> = ({
    data = {},
    size = {}
}) => {
    const {
        image = '',
        placeholder = 'Завантажити файл'
    } = data;

    const {
        width = 200,
        height = 200
    } = size;

    return (
        <div
            style={{
                height: height,
                maxWidth: width,
            }}
            className={cl.wapper}
        >
            <input
                type="file"
                className={cl.uploader}
                style={{
                    backgroundImage: `url(${data?.image})`,
                }}
                // value={placeholder}
                // placeholder={placeholder}
            />
        </div>
    );
};

export default FileUploader;