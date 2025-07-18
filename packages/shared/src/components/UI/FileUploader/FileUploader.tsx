import React from 'react';
import cl from './FileUploader.module.scss'

const FileUploader = () => {
    return (
        <div>
            <input 
                type="file" 
                className={cl.uploader}
            />
        </div>
    );
};

export default FileUploader;