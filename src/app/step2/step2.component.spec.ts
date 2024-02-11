import {ComponentFixture, TestBed} from "@angular/core/testing";
import {Step2Component} from "./step2.component";
import {Step2Service} from "@tesla/common/step2/step2.service";
import {signal} from "@angular/core";
import {Configuration, Option} from "@tesla/common/car/option";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ConfigurationAndOptionsForm} from "@tesla/common/step2/configuration-and-options-form";
import SpyObj = jasmine.SpyObj;

describe("Step2Component", () => {
    let component: Step2Component;
    let fixture: ComponentFixture<Step2Component>;

    let step2ServiceSpy: SpyObj<Step2Service> = jasmine.createSpyObj<Step2Service>(["retrieveOptionAndUpdateAssociatedTowAndYokeAvailabilityInForm", "getForm"]);
    const option: Option = {
        configs: [
            {id: 1, description: "Dual Motor All-Wheel Drive", range: 405, speed: 149, price: 74990},
            {id: 2, description: "Plaid - Tri Motor All-Wheel Drive", range: 396, speed: 200, price: 89990},
        ],
        towHitch: true,
        yoke: true
    };

    const configInformationQuerySelector = "#configInformation";
    const configSelectQuerySelector = "#configSelect";
    const towInputQuerySelector = "#includeTow"
    const yokeInputQuerySelector = "#includeYoke"

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Step2Component],
            providers: [{
                provide: Step2Service,
                useValue: step2ServiceSpy
            }]
        })
            .compileComponents();
        step2ServiceSpy.retrieveOptionAndUpdateAssociatedTowAndYokeAvailabilityInForm.and.returnValue(signal(option));
    });

    describe("when creating the page", () => {
        beforeEach(async () => {
            step2ServiceSpy.getForm.and.returnValue(getFormWithYokeButNoTowAvailable());
            fixture = TestBed.createComponent(Step2Component);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it("should init config options with description and config value", () => {
            const configSelect: HTMLSelectElement = fixture.nativeElement.querySelector(configSelectQuerySelector);

            expect(configSelect.options).toHaveSize(option.configs.length + 1);
            expect(configSelect.options.item(0)!.text).toContain("Choose...");
            expect(configSelect.options.item(1)!.text).toContain(option.configs[0].description);
            expect(configSelect.selectedIndex).toBe(0);
            configSelect.value = configSelect.options.item(1)!.value;
            configSelect.dispatchEvent(new Event("change"));
            fixture.detectChanges();
            expect(component.form.value.config).toEqual(option.configs[0]);
        });
    });

    describe("when model has yoke but no tow hitch available option", () => {
        beforeEach(async () => {
            step2ServiceSpy.getForm.and.returnValue(getFormWithYokeButNoTowAvailable());
            fixture = TestBed.createComponent(Step2Component);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it("should hide config information when no config is selected", () => {
            const configInformation = fixture.nativeElement.querySelector(configInformationQuerySelector);
            expect(configInformation).toBeFalsy();
        });

        it("should display config information when a config is selected", () => {
            const configSelect: HTMLSelectElement = fixture.nativeElement.querySelector(configSelectQuerySelector);

            configSelect.value = configSelect.options.item(1)!.value;
            configSelect.dispatchEvent(new Event("change"));
            fixture.detectChanges();

            const configInformation = fixture.nativeElement.querySelector(configInformationQuerySelector);
            expect(configInformation).toBeTruthy();
        });

        it("should display unchecked yoke choice when yoke option is available on the model", () => {
            const yokeChoice: HTMLInputElement = fixture.nativeElement.querySelector(yokeInputQuerySelector);
            expect(yokeChoice).toBeTruthy();
            expect(yokeChoice.checked).toBeFalsy();
        });

        it("should hide tow choice when tow option is not available on the model", () => {
            const towChoice: HTMLInputElement = fixture.nativeElement.querySelector(towInputQuerySelector);
            expect(towChoice).toBeFalsy();
        });
    });

    describe("when model has tow hitch but no yoke available option", () => {
        beforeEach(async () => {
            step2ServiceSpy.getForm.and.returnValue(getFormWithTowButNoYokeAvailable());
            fixture = TestBed.createComponent(Step2Component);
            component = fixture.componentInstance;
            fixture.detectChanges(); // update form status
            fixture.detectChanges(); // update input display
        });

        it("should hide yoke choice when yoke option is not available on the model", () => {
            const yokeChoice: HTMLInputElement = fixture.nativeElement.querySelector(yokeInputQuerySelector);
            expect(yokeChoice).toBeFalsy();
        });

        it("should display unchecked tow choice when tow option is available on the model", () => {
            const towChoice: HTMLInputElement = fixture.nativeElement.querySelector(towInputQuerySelector);
            expect(towChoice).toBeTruthy();
            expect(towChoice.checked).toBeFalsy();
        });
    });

    describe("when leaving and coming back to step 2", () => {
        beforeEach(async () => {
            step2ServiceSpy.getForm.and.returnValue(getFormWithInitialData());
            fixture = TestBed.createComponent(Step2Component);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it("should display previously selected choices", () => {
            const configSelect: HTMLSelectElement = fixture.nativeElement.querySelector(configSelectQuerySelector);
            const yokeChoice: HTMLInputElement = fixture.nativeElement.querySelector(yokeInputQuerySelector);

            expect(configSelect.selectedIndex).toBe(2);
            expect(yokeChoice).toBeTruthy();
            expect(yokeChoice.checked).toBeTrue();
        });
    });

    function getFormWithTowButNoYokeAvailable(): FormGroup<ConfigurationAndOptionsForm> {
        return new FormGroup({
            config: new FormControl<Configuration | null>(null, {
                validators: Validators.required
            }),
            towHitch: new FormControl<boolean>(false, {nonNullable: true}),
            yoke: new FormControl<boolean>({value: false, disabled: true}, {nonNullable: true})
        })
    }

    function getFormWithYokeButNoTowAvailable(): FormGroup<ConfigurationAndOptionsForm> {
        const form = getFormWithTowButNoYokeAvailable();
        form.controls.towHitch.disable();
        form.controls.yoke.enable();
        return form;
    }

    function getFormWithInitialData(): FormGroup<ConfigurationAndOptionsForm> {
        const form = getFormWithTowButNoYokeAvailable();
        form.controls.towHitch.enable();
        form.controls.yoke.enable();
        form.patchValue({config: option.configs.at(1)!, towHitch: false, yoke: true})
        return form;
    }
});
