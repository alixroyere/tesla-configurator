import {ComponentFixture, TestBed} from "@angular/core/testing";

import {Step1Component} from "./step1.component";
import {Step1Service} from "@tesla/common/step1/step1.service";
import {Step2Service} from "@tesla/common/step2/step2.service";
import {Color, Model} from "@tesla/common/car/model";
import {signal} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelAndColorForm} from "@tesla/common/step1/model-and-color-form";
import SpyObj = jasmine.SpyObj;

describe("Step1Component", () => {
    let component: Step1Component;
    let fixture: ComponentFixture<Step1Component>;
    let step1ServiceSpy: SpyObj<Step1Service> = jasmine.createSpyObj<Step1Service>(
        ["getModelOptions", "getColorOptions", "getForm"]
    );
    let step2ServiceSpy: SpyObj<Step2Service> = jasmine.createSpyObj<Step2Service>(["resetOptions"]);
    const models: Model[] = [{
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
    const colors: Color[] = [
        ...models[0].colors
    ];

    const modelSelectId = "modelSelect";
    const colorSelectId = "colorSelect";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Step1Component],
            providers: [{provide: Step1Service, useValue: step1ServiceSpy}, {
                provide: Step2Service,
                useValue: step2ServiceSpy
            }]
        })
            .compileComponents();
        step1ServiceSpy.getForm.and.returnValue(getForm());
        step1ServiceSpy.getModelOptions.and.returnValue(signal(models));
        step1ServiceSpy.getColorOptions.and.returnValue(signal(colors));
        fixture = TestBed.createComponent(Step1Component);
        component = fixture.componentInstance;
    });

    it("should init model options with description and model value", () => {
        fixture.detectChanges();
        const modelSelect: HTMLSelectElement = fixture.nativeElement.querySelector(`#${modelSelectId}`);

        expect(modelSelect.options).toHaveSize(models.length + 1);
        expect(modelSelect.options.item(0)!.text).toContain("Choose...");
        expect(modelSelect.options.item(1)!.text).toContain(models[0].description);
        expect(modelSelect.selectedIndex).toBe(0);
        modelSelect.value = modelSelect.options.item(1)!.value;
        modelSelect.dispatchEvent(new Event("change"));
        fixture.detectChanges();
        expect(component.form.value.model).toEqual(models[0]);
    });

    it("should not display color selector when no model option is selected", () => {
        fixture.detectChanges();
        const colorSelect = fixture.nativeElement.querySelector(`#${colorSelectId}`);
        expect(colorSelect).toBeFalsy();
    });

    it("should display color selector when a model option is selected", () => {
        component.form.controls.model.patchValue(models[0]);
        fixture.detectChanges();

        const colorSelect = fixture.nativeElement.querySelector(`#${colorSelectId}`);
        expect(colorSelect).toBeTruthy();
    });

    it("should init color options with description and color value", () => {
        component.form.controls.model.patchValue(models[0]);
        fixture.detectChanges();

        const colorSelect: HTMLSelectElement = fixture.nativeElement.querySelector(`#${colorSelectId}`);
        expect(colorSelect.options).toHaveSize(colors.length);
        expect(colorSelect.options.item(0)!.text).toContain(colors[0].description);
        colorSelect.value = colorSelect.options.item(0)!.value;
        colorSelect.dispatchEvent(new Event("change"));
        fixture.detectChanges();
        expect(component.form.value.color).toEqual(colors[0]);
    });

    it("should not display car image when model or color is not selected", () => {
        fixture.detectChanges();

        const image = fixture.nativeElement.querySelector("img");
        expect(image).toBeFalsy();
    });

    describe("when validating step 1, leaving to an other step and coming back", () => {
        beforeEach(async () => {
            step1ServiceSpy.getForm.and.returnValue(getFormWithInitialData());
            step1ServiceSpy.getModelOptions.and.returnValue(signal(models));
            step1ServiceSpy.getColorOptions.and.returnValue(signal(colors));
            fixture = TestBed.createComponent(Step1Component);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it("should reselect previous model and color", () => {
            const modelSelect: HTMLSelectElement = fixture.nativeElement.querySelector(`#${modelSelectId}`);
            const colorSelect: HTMLSelectElement = fixture.nativeElement.querySelector(`#${colorSelectId}`);

            expect(modelSelect.selectedIndex).toBe(1);
            expect(colorSelect.selectedIndex).toBe(0);
        });

        it("should reset step2 options when selected model is updated in step 1", () => {
            const modelSelect: HTMLSelectElement = fixture.nativeElement.querySelector(`#${modelSelectId}`);

            modelSelect.value = modelSelect.options.item(1)!.value;
            modelSelect.dispatchEvent(new Event("change"));

            expect(step2ServiceSpy.resetOptions).toHaveBeenCalled();
        });
    });

    function getForm(): FormGroup<ModelAndColorForm> {
        return new FormGroup({
                model: new FormControl<Model | null>(
                    null, {validators: [Validators.required]}
                ),
                color: new FormControl<Color | undefined>(
                    undefined, {nonNullable: true, validators: [Validators.required]}
                ),
            }
        );
    }

    function getFormWithInitialData(): FormGroup<ModelAndColorForm> {
        const form = getForm();
        form.patchValue({model: models[0], color: colors[0]});
        return form;
    }
});
