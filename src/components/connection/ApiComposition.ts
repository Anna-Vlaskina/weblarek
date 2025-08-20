import { IApi } from '../../types/index'
import { ApiPostMethods } from '../../types/index'

export class ApiComposition implements IApi {
    private instanceApi: IApi;

    constructor(instanceApi: IApi) {
        this.instanceApi = instanceApi;
    }

    get<T extends object>(uri: string): Promise<T> {
        return this.instanceApi.get<T>(uri);
    }

    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T> {
        return this.instanceApi.post<T>(uri, data, method);
    }
}