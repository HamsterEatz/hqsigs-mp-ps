import React from 'react';
import ParadeState from '../../components/ParadeState';
import { compareParadeStateApi, paradeStateApi } from '../../apis';

export async function getServerSideProps({ query }) {
    try {
        const state = await paradeStateApi(false);
        const diffArr = await compareParadeStateApi(false, state);
        return {
            props: {
                data: { diffArr, ...state }
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
        <ParadeState isFirstParade={false} data={data} error={error} />
    );
}
