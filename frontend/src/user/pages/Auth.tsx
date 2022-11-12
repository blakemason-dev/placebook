import React, { useState, useContext } from "react";

import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { useForm } from "../../shared/hooks/form-hook";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";

import './Auth.css';
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler, setFormData] = useForm({}, false);

    const authSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/login', 
                    'POST', 
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }), 
                    {
                        'Content-Type': 'application/json'
                    }
                ); 
                auth.login(responseData.user.id);
            } catch (err) {
                
            }
            
        } else {
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/signup',
                    'POST',
                    JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(responseData.user.id);
            } catch (err) {

            }
        }
    }

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData({
                email: formState.inputs.email,
                password: formState.inputs.password,
            },
            formState.inputs.email.isValid && formState.inputs.password.isValid);
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
        <>
            <ErrorModal 
                error={error} 
                onClear={clearError}
            />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay/>}
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
        </>
    )
}

export default Auth;