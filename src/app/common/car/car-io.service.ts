import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Model} from "@tesla/common/car/model";
import {Option} from "@tesla/common/car/option";

@Injectable({
    providedIn: "root"
})
export class CarIoService {
    constructor(private http: HttpClient) {
    }

    public retrieveModels(): Observable<Model[]> {
        return this.http.get<Model[]>(`/models`);
    }

    public retrieveOption(modelCode: string): Observable<Option> {
        return this.http.get<Option>(`/options/${modelCode}`);
    }
}
