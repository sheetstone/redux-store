import { useState, useEffect } from 'react';

let globalState = {};
let listeners = [];
let actions = {};

// Create customer hooker
export const useStore = (shouldListener = true) => {
    const setState = useState(globalState)[1];

    const dispatch = (actionIdentifier, payload) => {
        const newState = actions[actionIdentifier](globalState, payload);
        globalState = {
            ...globalState,
            ...newState
        }

        for (const listener of listeners){
            listener(globalState);
        }
    }

    useEffect(()=>{
        if (shouldListener){
            listeners.push(setState);
        }

        return () => {
            if(shouldListener){
                listeners = listeners.filter(li => li !== setState);
            }
        }
    },[setState, shouldListener])

    return [globalState, dispatch]
}

export const initStore = (userActions, initState) => {
    if (initState) {
        globalState = {
            ...globalState,
            ...initState
        };
    }

    actions= {
        ...actions,
        ...userActions
    }
}