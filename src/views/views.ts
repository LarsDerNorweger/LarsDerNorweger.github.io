export type views = 'search' | 'main' | 'edit' | 'stats' | 'details'

export type showCallBack = (view:views, replaceState:boolean)=>void