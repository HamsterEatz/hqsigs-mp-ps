import React from 'react';
import ParadeState from '../../components/ParadeState';
import { compareParadeStateApi, lockDataApi, paradeStateApi } from '../../apis';

export async function getServerSideProps({ query }) {
    try {
        const state = await paradeStateApi(true);
        const diffArr = await compareParadeStateApi(true, state) || [];
        return {
            props: {
                data: { diffArr, ...state, isLocked: await lockDataApi(true) }
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
