import React, { useState, useContext } from "react";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import Button from '../../shared/components/FormElements/Button';
import { useForm } from "../../shared/hooks/form-hook";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";

import './Auth.css';
import { AuthContext } from "../../shared/context/auth-context";

const Auth = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);

    const auth = useContext(AuthContext);

    const [formState, inputHandler, setFormData] = useForm({
            // name: {
            //     value: '',
            //     isValid: false,
            // },
            // email: {
            //     value: '',
            //     isValid: false,
            // },
            // password: {
            //     value: '',
            //     isValid: false,
            // }
        },
        false
    );

    const authSubmitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formState.inputs);
        auth.login();
    }

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData({
                email: formState.inputs.email,
                password: formState.inputs.password,
            },
            formState.inputs.email.isValid && formState.inputs.password.isValid);
            console.log(formState.inputs);
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                }
            }, false);
        }
        setIsLoginMode(!isLoginMode);
    }

    return (
        <Card className="authentication">
            <h2>Login Required</h2>
            <br />
            <form onSubmit={authSubmitHandler}>
                {!isLoginMode && (
                    <Input 
                        element='input'
                        id='name'
                        type='text'
                        label='Your Name'
                        validators={[VALIDATOR_REQUIRE()]}
                        onInput={inputHandler}
                        errorText={'Please enter a name'}
                    />
                )}
                <Input 
                    id='email'
                    element='input' 
                    type='text' 
                    label='Email' 
                    validators={[VALIDATOR_EMAIL()]} 
                    errorText='Please enter a valid email'
                    onInput={inputHandler}
                />
                <Input 
                    id='password'
                    element='input' 
                    label='Password' 
                    validators={[VALIDATOR_MINLENGTH(6)]} 
                    errorText='Please enter a valid password (at least 6 characters)'
                    onInput={inputHandler}
                />
                <Button type='submit' disabled={!formState.isValid}>
                    {isLoginMode ? "LOGIN" : 'SIGNUP'}
                </Button>
            </form>
            <Button inverse onClick={switchModeHandler}>{`SWITCH TO ${isLoginMode ? "SIGNUP" : "LOGIN"}`}</Button>
        </Card>
    )
}

export default Auth;