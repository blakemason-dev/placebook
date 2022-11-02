import { useCallback, useReducer } from "react";

interface iInputState {
    [key: string]: {
        value: string;
        isValid: boolean;
    }
}

interface iFormState {
    inputs: iInputState;
    isValid: boolean;
}

interface iFormAction {
    type: string;
    value: string;
    inputId: string;
    isValid: boolean;

    inputs: iInputState;
    formIsValid: boolean;
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
    case 'SET_DATA':
        return {
            inputs: action.inputs,
            isValid: action.formIsValid,
        }
      default:
        return state;
    }
}

export const useForm = (initialInputs: iInputState, initialFormValidity: boolean) => {
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity
    });

    const inputHandler = useCallback((id: string, value: string, isValid: boolean) => {
        dispatch({
            type: 'INPUT_CHANGE', 
            value: value, 
            isValid: isValid, 
            inputId: id,

            // these are not actually used in reducer function, for typescript only
            inputs: formState.inputs,
            formIsValid: formState.isValid,
        });
    },  []);

    const setFormData = useCallback((inputData: iInputState, formValidity: boolean) => {
        dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            formIsValid: formValidity,

            // these are not actually used in reducer function, for typescript only
            value: '',
            isValid: false,
            inputId: '',
        })
    }, []);

    type Tuple = [
        iFormState, 
        (id: string, value: string, isValid: boolean) => void,
        (inputData: iInputState, formValidity: boolean) => void
    ];
    const returnTuple: Tuple = [formState, inputHandler, setFormData];

    return returnTuple;
};

