/**
 * This file might be used by your IDE (i.e. IntelliJ Idea) for code completion.
 */
declare module e2e_mocks {
    export interface Future {
    }
    export interface MockApi {
        reset():Future;
        response(value?:any):Future;
        triggered(value?:bool):Future;
    }
}
declare function mockApi():e2e_mocks.MockApi;
declare function mockApi(item:String):e2e_mocks.MockApi;
