import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { Place } from '../../types/Place';
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UIElements/Card';

import './PlaceForm.css';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';

const UpdatePlace = () => {
    const auth = useContext(AuthContext);
    const placeId = useParams().placeId;
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState<any>(undefined);
    const navigate = useNavigate();

    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
            address: {
                value: '',
                isValid: false,
            }
        },
        true
    );

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/places/${placeId}`,
                );
                setLoadedPlace(responseData.place);
                setFormData(
                    {
                        title: {
                            value: responseData.place.title,
                            isValid: true
                        },
                        description: {
                            value: responseData.place.description,
                            isValid: true
                        },
                        address: {
                            value: '',
                            isValid: true,
                        }
                    },
                    true
                );
            } catch (err) {}
        }
        fetchPlace();
    }, [sendRequest, placeId, setFormData])

    const placeUpdateSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await sendRequest(
                `http://localhost:5000/api/places/${placeId}`,
                'PATCH',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                }),
                { 'Content-Type': 'application/json'}
            );
            navigate(`/${auth.userId}/places`);
        } catch (err) {}
    }

    if (isLoading) {
        return (
            <div className='center'>
                <LoadingSpinner />
            </div>
        )
    }


    if (!isLoading && !loadedPlace) {
        return (
            <div className='center'>
                <Card>
                    <h2>Could not find place</h2>
                </Card>
            </div>
        )
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace && <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
                <Input 
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title"
                    onInput={inputHandler}
                    initialValue={loadedPlace.title}
                    initialValid={true}
                />
                <Input 
                    id="description"
                    element="textarea"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (minimum 5 characters)"
                    onInput={inputHandler}
                    initialValue={loadedPlace.description}
                    initialValid={true}
                />
                <Button type="submit"disabled={!formState.isValid}>
                    UPDATE PLACE
                </Button>
            </form> }
        </>
    );
}

export default UpdatePlace;