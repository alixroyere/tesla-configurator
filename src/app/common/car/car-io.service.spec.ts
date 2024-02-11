import {TestBed} from "@angular/core/testing";
import {CarIoService} from "./car-io.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Model} from "@tesla/common/car/model";
import {Option} from "@tesla/common/car/option";

describe("CarIoService", () => {
    let service: CarIoService;
    let httpTestingController: HttpTestingController;
    const expectedModels: Model[] =
        [{
            code: "S",
            description: "Model S",
            colors: [
                {code: "white", description: "Pearl White Multi-Coat", price: 0},
                {code: "black", description: "Solid Black", price: 0},
                {code: "blue", description: "Deep Blue Metallic", price: 0},
                {code: "grey", description: "Stealth Grey", price: 0},
                {code: "red", description: "Ultra Red", price: 0}
            ]
        },]
    const expectedOption: Option = {
        configs: [
            {id: 1, description: "Dual Motor All-Wheel Drive", range: 405, speed: 149, price: 74990},
            {id: 2, description: "Plaid - Tri Motor All-Wheel Drive", range: 396, speed: 200, price: 89990},
        ],
        towHitch: false,
        yoke: true
    };

    beforeEach(() => {
        TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
        service = TestBed.inject(CarIoService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it("should retrieve all models", () => {
        service.retrieveModels().subscribe(
            models => expect(models).toEqual(expectedModels)
        )
        const req = httpTestingController.expectOne("/models");
        expect(req.request.method).toEqual("GET");
        req.flush(expectedModels);
        httpTestingController.verify();
    });

    it("should retrieve options for a model", () => {
        service.retrieveOption("S").subscribe(
            option => expect(option).toEqual(expectedOption)
        )
        const req = httpTestingController.expectOne("/options/S");
        expect(req.request.method).toEqual("GET");
        req.flush(expectedOption);
        httpTestingController.verify();
    });
});
