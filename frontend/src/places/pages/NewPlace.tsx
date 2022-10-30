import React, { useCallback, useReducer } from 'react';
import Button from '../../shared/components/FormElements/Button';

import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import './NewPlace.css';

interface iFormState {
  inputs: {
    title: {
      value: string;
      isValid: boolean;
    },
    description: {
      value: string;
      isValid: boolean;
    },
  },
  isValid: boolean;
}

interface iFormAction {
  type: string;
  value: string;
  inputId: string;
  isValid: boolean;
}

const initialState = {
  inputs: {
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    },
  },
  isValid: false
}

const formReducer = (state: iFormState, action: iFormAction) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      type ObjectKey = keyof typeof state.inputs;
      for (const inputId in state.inputs) {
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId as ObjectKey].isValid;
        }
      }

      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid }
        },
        isValid: formIsValid
      }
    default:
      return state;
  }
}

const NewPlace = () => {
  const [formState, dispatch] = useReducer(formReducer, initialState)

  const inputHandler = useCallback((id: string, value: string, isValid: boolean) => {
    dispatch({
      type: 'INPUT_CHANGE', 
      value: value, 
      isValid: isValid, 
      inputId: id
    });
  },  []);

  const placeSubmitHolder = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formState.inputs); // send this to the backend this is ddd
  }

  return (
    <form className='place-form' onSubmit={placeSubmitHolder}>
      <Input 
        id='title'
        element='input' 
        type='text' 
        label='Title' 
        validators={[VALIDATOR_REQUIRE()]} 
        errorText='Please enter a valid title'
        onInput={inputHandler}
      />
      <Input 
        id='description'
        element='textarea' 
        label='Description' 
        validators={[VALIDATOR_MINLENGTH(5)]} 
        errorText='Please enter a valid description (at least 5 characters)'
        onInput={inputHandler}
      />
      <Input 
        id='address'
        element='input' 
        label='Address' 
        validators={[VALIDATOR_REQUIRE()]} 
        errorText='Please enter a valid address'
        onInput={inputHandler}
      />
      <Button type='submit' disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
  )
}

export default NewPlace;