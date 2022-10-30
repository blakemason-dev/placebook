import React, { useRef, useEffect } from 'react';

import './Map.css';

interface IMapProps {
    className?: string;
    style?: React.CSSProperties;

    center: google.maps.LatLng | google.maps.LatLngLiteral | null | undefined;
    zoom: number;
}

const Map = (props: IMapProps) => {
    const mapRef = useRef(null);

    const { center, zoom } = props;

    useEffect(() => {
        const map = new window.google.maps.Map(mapRef.current as unknown as HTMLElement, {
            center: center,
            zoom: zoom
        });
    
        new window.google.maps.Marker({position: center, map: map})
    }, [center, zoom]);


    return (
        <div ref={mapRef} className={`map ${props.className}`} style={props.style}>
        </div>
    )
}

export default Map;