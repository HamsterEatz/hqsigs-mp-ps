import React from 'react';
import ParadeState from '../../components/ParadeState';
import paradeStateApi from '../../apis/paradeStateApi';

export async function getServerSideProps({ query }) {
    return {
        props: {
            data: await paradeStateApi(false)
        },
    };
}

export default function FirstParade({ data, error }) {
    return (
        <ParadeState isFirstParade={false} data={data} error={error} />
    );
}
