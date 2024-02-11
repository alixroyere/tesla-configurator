import {TestBed} from "@angular/core/testing";
import {Step1Service} from "./step1.service";
import {CarIoService} from "@tesla/common/car/car-io.service";
import {Model} from "@tesla/common/car/model";
import {of} from "rxjs";
import SpyObj = jasmine.SpyObj;

describe("Step1Service", () => {
    let service: Step1Service;
    let carIoServiceSpy: SpyObj<CarIoService>;

    const models: Model[] =
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
        },
            {
                code: "X",
                description: "Model X",
                colors: [
                    {code: "white", description: "Pearl White Multi-Coat", price: 0},
                    {code: "black", description: "Solid Black", price: 0},
                    {code: "blue", description: "Deep Blue Metallic", price: 0},
                    {code: "grey", description: "Stealth Grey", price: 0},
                    {code: "red", description: "Ultra Red", price: 0}
                ]
            },]

    beforeEach(() => {
        carIoServiceSpy = jasmine.createSpyObj<CarIoService>(["retrieveModels"]);
        carIoServiceSpy.retrieveModels.and.returnValue(of(models));
        TestBed.runInInjectionContext(() => service = new Step1Service(carIoServiceSpy));
    });

    it("step1 should be invalid when model or color is not selected", () => {
        expect(service.getIsStepValid()()).toBeFalsy();
    });

    it("step1 should be valid when model and color are selected", () => {
        service.getForm().patchValue({model: models[0], color: models[0].colors[0]});
        expect(service.getIsStepValid()()).toBeTruthy();
    });

    it("should retrieve model and color form", () => {
        const result = service.getForm();
        expect(result.controls.model).toBeTruthy();
        expect(result.controls.color).toBeTruthy();
    });

    it("should retrieve models", () => {
        const result = service.getModelOptions()();
        expect(result).toEqual(models);
    });

    it("should retrieve image url matching selected model and color", () => {
        service.getForm().patchValue({model: models[0], color: models[0].colors[0]});
        const result = service.getImageUrl()();
        expect(result).toEqual(`https://interstate21.com/tesla-app/images/${models[0].code}/${models[0].colors[0].code}.jpg`);
    });

    it("should retrieve the selected model", () => {
        service.getForm().controls.model.patchValue(models[0]);
        const result = service.getSelectedModel();
        expect(result).toEqual(models[0]);
    });

    it("should retrieve the selected model a,d color", () => {
        service.getForm().patchValue({model: models[0], color: models[0].colors[0]});
        const result = service.getModelAndColor();
        expect(result).toEqual({model: models[0], color: models[0].colors[0]});
    });

    it("should select first color when a new model is selected", () => {
        const initialSelectedValues = service.getModelAndColor();
        expect(initialSelectedValues.color).toBeFalsy();

        service.getForm().controls.model.patchValue(models[0]);
        TestBed.flushEffects();

        const updatedValues = service.getModelAndColor();
        expect(updatedValues.color).toEqual(models[0].colors[0]);
    });
});
