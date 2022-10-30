import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
    const USERS = [
        {
            id: 'u1',
            name: 'darth vader',
            image: 'https://lumiere-a.akamaihd.net/v1/images/darth-vader-main_4560aff7.jpeg?region=0%2C67%2C1280%2C720&width=600',
            places: 3
        }
    ]

    return (
        <UsersList items={USERS} />
    )
}

export default Users;