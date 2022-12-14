import React, { useState, useContext, useEffect } from 'react';

import './PlaceItem.css';
import Card from '../../shared/components/UIElements/Card';
import { Coordinate } from '../../types/Place';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

interface IProps {
    key: string;
    id: string; 
    image: string;
    title: string;
    description: string;
    address: string;
    creatorId: string;
    coordinates: Coordinate;
    onDelete: (deletedPlaceId: string) => void;
}

const PlaceItem = (props: IProps) => {
    const auth = useContext(AuthContext);
    const [showMap, setShowMap] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const openMapHandler = () => setShowMap(true);

    const closeMapHandler = () => setShowMap(false);

    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    }

    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    }

    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false);
        try {
            const responseData = await sendRequest(
                `${import.meta.env.VITE_BACKEND_URL}/places/${props.id}`,
                'DELETE',
                null,
                {
                    Authorization: 'Bearer ' + auth.token,
                }
            );
            props.onDelete(props.id);
        } catch (err) {}
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <Modal 
                show={showMap} 
                onCancel={closeMapHandler} 
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className='map-container'>
                    <Map center={props.coordinates} zoom={16}/>
                </div>
            </Modal>
            <Modal 
                show={showConfirmModal}
                onCancel={cancelDeleteHandler}
                header="Are you sure?" 
                footerClass="place-item__modal-action"
                footer={
                    <>
                        <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
                        <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
                    </>
                }>
                <p>Do you want to proceed and delete this place? Please
                    note that this can not be undone.
                </p>
            </Modal>
            <li className='place-item'>
                <Card className='place-item__content'>
                    {isLoading && <LoadingSpinner asOverlay/>}
                    <div className='place-item__image'>
                        <img src={`${import.meta.env.VITE_ASSET_URL}/${props.image}`} alt={props.title} />
                    </div>
                    <div className='place-item__info'>
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className='place-item__actions'>
                        <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                        {auth.userId === props.creatorId && (
                            <Button to={`/places/${props.id}`}>EDIT</Button>
                        )}
                        {auth.userId === props.creatorId && (
                            <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>
                        )}
                    </div>
                </Card>
            </li>
        </>
    )
}

export default PlaceItem