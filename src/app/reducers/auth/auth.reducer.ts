import { createReducer, on } from '@ngrx/store';
import * as states from './auth.actions';


export const inicial = null

const _authReducer = createReducer(
    inicial, 
    on(states.login, (state, { user }) => user),
    on(states.logout, state => inicial)
)


export function authReducer(state, action){
    return _authReducer(state, action)
}

