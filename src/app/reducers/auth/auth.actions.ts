import { createAction, props } from '@ngrx/store';

export const login = createAction('login',
    props<{ user: Object }>()
    );
export const logout = createAction('logout'); 


