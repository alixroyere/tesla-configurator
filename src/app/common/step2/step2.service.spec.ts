import {TestBed} from "@angular/core/testing";

import {Step2Service} from "./step2.service";
import {CarIoService} from "@tesla/common/car/car-io.service";
import {Step1Service} from "@tesla/common/step1/step1.service";
import {Model} from "@tesla/common/car/model";
import {of} from "rxjs";
import {Option} from "@tesla/common/car/option";
import {ConfigurationAndOptions} from "@tesla/common/step2/configuration-and-options";
import SpyObj = jasmine.SpyObj;

describe("Step2Service", () => {
    let service: Step2Service;
    let carIoServiceSpy: SpyObj<CarIoService>;
    let step1ServiceSpy: SpyObj<Step1Service>;
    const model: Model =
        {
            code: "S",
            description: "Model S",
            colors: [
                {code: "white", description: "Pearl White Multi-Coat", price: 0},
                {code: "black", description: "Solid Black", price: 0},
                {code: "blue", description: "Deep Blue Metallic", price: 0},
                {code: "grey", description: "Stealth Grey", price: 0},
                {code: "red", description: "Ultra Red", price: 0}
            ]
        };
    const option: Option = {
        configs: [
            {id: 1, description: "Dual Motor All-Wheel Drive", range: 405, speed: 149, price: 74990},
            {id: 2, description: "Plaid - Tri Motor All-Wheel Drive", range: 396, speed: 200, price: 89990},
        ],
        towHitch: true,
        yoke: true
    };

    beforeEach(() => {
        carIoServiceSpy = jasmine.createSpyObj<CarIoService>(["retrieveOption"]);
        step1ServiceSpy = jasmine.createSpyObj<Step1Service>(["getSelectedModel"]);
        carIoServiceSpy.retrieveOption.and.returnValue(of(option));
        step1ServiceSpy.getSelectedModel.and.returnValue(model);
        TestBed.configureTestingModule({
            providers: [{provide: CarIoService, useValue: carIoServiceSpy}, {provide: Step1Service, useValue: step1ServiceSpy}]
        });
        service = TestBed.inject(Step2Service);
    });

    it('form should be invalid when no config is selected', () => {
        const form = service.getForm();
        expect(form.valid).toBeFalsy();
    });

    it('form should be valid when a config is selected', () => {
        const form = service.getForm();
        form.patchValue({config: option.configs[0]});
        expect(form.valid).toBeTruthy();
    });

    it('form should contain all options', () => {
        const form = service.getForm();
        expect(form.controls.config).toBeTruthy();
        expect(form.controls.towHitch).toBeTruthy();
        expect(form.controls.yoke).toBeTruthy();
    });

    it('should retrieve options matching the selected model', () => {
        const result = TestBed.runInInjectionContext(() => service.retrieveOptionAndUpdateAssociatedTowAndYokeAvailabilityInForm());
        expect(carIoServiceSpy.retrieveOption).toHaveBeenCalledWith("S");
        expect(result()).toEqual(option);
    });

    it('should activate yoke in form when yoke option is available for the model', () => {
        carIoServiceSpy.retrieveOption.and.returnValue(of({...option, yoke: true}));
        TestBed.runInInjectionContext(() => service.retrieveOptionAndUpdateAssociatedTowAndYokeAvailabilityInForm());
        expect(service.getForm().controls.yoke.enabled).toBeTrue();
    });

    it('should not activate yoke in form when yoke option is not available for the model', () => {
        carIoServiceSpy.retrieveOption.and.returnValue(of({...option, yoke: false}));
        TestBed.runInInjectionContext(() => service.retrieveOptionAndUpdateAssociatedTowAndYokeAvailabilityInForm());
        expect(service.getForm().controls.yoke.enabled).toBeFalsy();
    });

    it('should activate tow in form when tow option is available for the model', () => {
        carIoServiceSpy.retrieveOption.and.returnValue(of({...option, towHitch: true}));
        TestBed.runInInjectionContext(() => service.retrieveOptionAndUpdateAssociatedTowAndYokeAvailabilityInForm());
        expect(service.getForm().controls.towHitch.enabled).toBeTrue();
    });

    it('should not activate tow in form when tow option is not available for the model', () => {
        carIoServiceSpy.retrieveOption.and.returnValue(of({...option, towHitch: false}));
        TestBed.runInInjectionContext(() => service.retrieveOptionAndUpdateAssociatedTowAndYokeAvailabilityInForm());
        expect(service.getForm().controls.towHitch.enabled).toBeFalsy();
    });

    it('should retrieve step validity', () => {
        const isStepValid = service.getIsStepValid();
        expect(isStepValid()).toBeFalsy();
        service.getForm().patchValue({config: option.configs[0]});
        expect(isStepValid()).toBeTruthy();
    });

    it('should reset form', () => {
        service.getForm().patchValue({config: option.configs[0], towHitch: true, yoke: true});
        service.getForm().controls.yoke.enable();
        service.getForm().controls.towHitch.enable();
        service.resetOptions();
        expect(service.getForm().value).toEqual({config: null, towHitch: false, yoke: false});
    });

    it('should get selected configuration and options', () => {
        const selectedConfigurationAndOptions: ConfigurationAndOptions = {config: option.configs[0], towHitch: true, yoke: true}
        service.getForm().patchValue(selectedConfigurationAndOptions);
        service.getForm().controls.yoke.enable();
        service.getForm().controls.towHitch.enable();
        expect(service.getSelectedConfigurationAndOptions()).toEqual(selectedConfigurationAndOptions);
    });
});
