import React from 'react';
import ParadeState from '../../components/ParadeState';
import { paradeStateApi } from '../../apis';

export async function getServerSideProps({ query }) {
    try {
        return {
            props: {
                data: await paradeStateApi(true)
            },
        };
    } catch (e) {
        return {
            props: {
                error: e.message
            }
        }
    }
}

export default function FirstParade({ data, error }) {
    return (
        <ParadeState isFirstParade={true} data={data} error={error} />
    );
}
