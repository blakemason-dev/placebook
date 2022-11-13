import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';

import './ImageUpload.css';

interface iProps {
    id: string;
    center: string;
    errorText: string;
    onInput: (id: string, pickedFile: any, fileIsValid: boolean) => void;
}

export const ImageUpload = (props: iProps) => {
    const [file, setFile] = useState<any>();
    const [previewUrl, setPreviewUrl] = useState<any>();
    const [isValid, setIsValid] = useState(false);

    const filePickerRef = useRef<any>();

    useEffect(() => {
        if (!file) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        }
        fileReader.readAsDataURL(file);
    }, [file])

    const pickedHandler = (e: any) => {
        let pickedFile;
        let fileIsValid = isValid;
        const fileList = e.target.files as FileList;

        if (fileList && fileList.length === 1) {
            pickedFile = fileList[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false;
        }
        
        props.onInput(props.id, pickedFile, fileIsValid);
    }

    const pickImageHandler = () => {
        filePickerRef.current.click();
    };

    return (
        <div className='form-control'>
            <input 
                id={props.id} 
                ref={filePickerRef}
                style={{display: "none"}} 
                type="file" 
                accept=".jpg,.png,.jpeg"
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className='image-upload__preview'>
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                    {!previewUrl && <p>Please pick an image</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    )
}