import React, { ChangeEvent, useReducer, useEffect } from 'react';

import { validate } from '../../util/validators';
import './Input.css';

interface IInputProps {
    element?: string;
    id: string;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    rows?: number;
    label?: string;
    errorText?: string;
    validators?: [{type: string}];
    initialValue?: string;
    initialValid?: boolean;
    onInput: (id: string, value: string, isValid: boolean) => void;
}

interface IInputState {
    value: string;
    isValid: boolean;
    isTouched: boolean;
}

interface IInputAction {
    type: string;
    val: string;
    validators?: [{type: string}] 
}

const inputReducer = (state: IInputState, action: IInputAction) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
        case 'TOUCH':
            return {
                ...state,
                isTouched: true
            }
        default:
            return state;
    }
}

const Input = (props: IInputProps) => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || '', 
        isValid: props.initialValid || false,
        isTouched: false
    });

    const { id, onInput } = props;
    const { value, isValid } = inputState;

    useEffect(() => {
        props.onInput(props.id, inputState.value, inputState.isValid)
    }, [id, value, isValid, onInput]);

    const changeHandler = (e: ChangeEvent) => {
        dispatch({
            type: 'CHANGE', 
            val: (e.target as HTMLInputElement).value, 
            validators: props.validators
        });
    }

    const touchHandler = () => {
        dispatch({
            type: 'TOUCH',
            val: ''
        });
    }

    const element = props.element === 'input' ? 
        <input 
            id={props.id} 
            type={props.type} 
            placeholder={props.placeholder} 
            onChange={changeHandler} 
            onBlur={touchHandler}
            value={inputState.value}
        /> : 
        <textarea 
            id={props.id} 
            rows={props.rows || 3} 
            onChange={changeHandler}  
            onBlur={touchHandler}
            value={inputState.value}
        />;

    return (
        <div className={
                `form-control 
                ${!inputState.isValid && 
                inputState.isTouched && 
                'form-control--invalid'}`
            }
        >
            <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>} 
        </div>

    )
}

export default Input;