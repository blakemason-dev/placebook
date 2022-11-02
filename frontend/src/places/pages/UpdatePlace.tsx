import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { Place } from '../../types/Place';
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UIElements/Card';

import './PlaceForm.css';

const DUMMY_PLACES: Place[] = [
    {
        id: 'p1',
        title: 'death star',
        description: 'inter-galactic gargantuan battle station',
        imageURL: "https://static.wikia.nocookie.net/starwars/images/2/20/DeathStarII-BotF.jpg",
        address: 'in a galaxy far far away',
        location: { lat: -27.46573230218397, lng: 153.02928752096378},
        creator: 'u1'
    }, 
    {
        id: 'p2',
        title: 'mos eisley',
        description: 'rough town, good bar',
        imageURL: "https://static.wikia.nocookie.net/starwars/images/f/fd/Mos_Eisley.png",
        address: 'on the outer rim',
        location: { lat: -27.46573230218397, lng: 153.02928752096378},
        creator: 'u2'
    }, 
  ];
  

const UpdatePlace = () => {
    const [isLoading, setIsLoading] = useState(true);
    const placeId = useParams().placeId;

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

    const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

    useEffect(() => {
        setFormData(
            {
                title: {
                    value: identifiedPlace?.title || '',
                    isValid: true
                },
                description: {
                    value: identifiedPlace?.description || '',
                    isValid: true
                },
                address: {
                    value: '',
                    isValid: true,
                }
            },
            true
        );
        setIsLoading(false);
    }, [setFormData, identifiedPlace])


    

    const placeUpdateSubmitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formState.inputs);
    }

    if (!identifiedPlace) {
        return (
            <div className='center'>
                <Card>
                    <h2>Could not find place</h2>
                </Card>
            </div>
        )
    }
    if (isLoading) {
        return (
            <div className='center'>
                <h2>Loading...</h2>
            </div>
        )
    }

    return (
        <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
            <Input 
                id="title"
                element="input"
                type="text"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title"
                onInput={inputHandler}
                initialValue={formState.inputs.title.value}
                initialValid={formState.inputs.title.isValid}
            />
            <Input 
                id="description"
                element="textarea"
                label="Description"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid description (minimum 5 characters)"
                onInput={inputHandler}
                initialValue={formState.inputs.description.value}
                initialValid={formState.inputs.description.isValid}
            />
            <Button type="submit"disabled={!formState.isValid}>
                UPDATE PLACE
            </Button>
        </form>
    );
}

export default UpdatePlace;