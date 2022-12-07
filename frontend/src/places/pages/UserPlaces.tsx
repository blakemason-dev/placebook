import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PlacesList from '../components/PlacesList';
import { Place } from '../../types/Place';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';

const UserPlaces = () => {
    const userId = useParams().userId;
    // const auth = useContext(AuthContext);
    // const userId = auth.userId;
    const [loadedPlaces, setLoadedPlaces] = useState<Place[]>([]);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    useEffect(() => {
        const fetchUserPlaces = async () => {
            try {
                const responseData = await sendRequest(
                    `${import.meta.env.VITE_BACKEND_URL}/places/user/${userId}`,
                );
                setLoadedPlaces(responseData.places);
            } catch (err) {}
        }
        fetchUserPlaces();

    }, [sendRequest, userId]);

    const placeDeletedHandler = (deletedPlaceId: string) => {
        setLoadedPlaces(prevPlaces => 
            prevPlaces.filter(place => place.id !== deletedPlaceId));
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <div className='center'><LoadingSpinner /></div>}
            {!isLoading && loadedPlaces && <PlacesList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />}
        </>
    )
}

export default UserPlaces