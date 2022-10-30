import React from 'react';
import { useParams } from 'react-router-dom';
import PlacesList from '../components/PlacesList';
import { Place } from '../../types/Place';

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

const UserPlaces = () => {
    const userId = useParams().userId;
    const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
    return (
      <PlacesList items={loadedPlaces} />
    )
}

export default UserPlaces