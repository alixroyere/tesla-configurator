import {ComponentFixture, TestBed} from '@angular/core/testing';
import {StepNavigatorComponent} from './step-navigator.component';
import {Step1Service} from "@tesla/common/step1/step1.service";
import {Step2Service} from "@tesla/common/step2/step2.service";
import {signal, WritableSignal} from "@angular/core";
import {RouterTestingModule} from "@angular/router/testing";
import SpyObj = jasmine.SpyObj;

describe('StepNavigatorComponent', () => {
    let component: StepNavigatorComponent;
    let fixture: ComponentFixture<StepNavigatorComponent>;
    let step1ServiceSpy: SpyObj<Step1Service> = jasmine.createSpyObj<Step1Service>(["getIsStepValid"]);
    let step2ServiceSpy: SpyObj<Step2Service> = jasmine.createSpyObj<Step2Service>(["getIsStepValid"]);
    let isStep1Valid: WritableSignal<boolean>;
    let isStep2Valid: WritableSignal<boolean>;
    const step3ButtonSelector = "#step3";
    const step2ButtonSelector = "#step2";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StepNavigatorComponent, RouterTestingModule],
            providers: [{
                provide: Step1Service,
                useValue: step1ServiceSpy
            }, {
                provide: Step2Service,
                useValue: step2ServiceSpy
            }]
        })
            .compileComponents();
        isStep1Valid = signal(false);
        isStep2Valid = signal(false);
        step1ServiceSpy.getIsStepValid.and.returnValue(isStep1Valid);
        step2ServiceSpy.getIsStepValid.and.returnValue(isStep2Valid);
        fixture = TestBed.createComponent(StepNavigatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('step 1 button should always be clickable', () => {
        const button: HTMLButtonElement = fixture.nativeElement.querySelector("#step1");
        expect(button.disabled).toBeFalsy();
    });

    it('step 2 button should be disabled when step 1 is invalid', () => {
        isStep1Valid.set(false);
        fixture.detectChanges();
        const button: HTMLButtonElement = fixture.nativeElement.querySelector(step2ButtonSelector);
        expect(button.disabled).toBeTruthy();
    });

    it('step 2 button should be enabled when step 1 is valid', () => {
        isStep1Valid.set(true);
        fixture.detectChanges();
        const button: HTMLButtonElement = fixture.nativeElement.querySelector(step2ButtonSelector);
        expect(button.disabled).toBeFalsy();
    });

    it('step 3 button should be disabled when step 2 is invalid', () => {
        isStep2Valid.set(false);
        fixture.detectChanges();
        const button: HTMLButtonElement = fixture.nativeElement.querySelector(step3ButtonSelector);
        expect(button.disabled).toBeTruthy();
    });

    it('step 3 button should be enabled when step 2 is valid', () => {
        isStep2Valid.set(true);
        fixture.detectChanges();
        const button: HTMLButtonElement = fixture.nativeElement.querySelector(step3ButtonSelector);
        expect(button.disabled).toBeFalsy();
    });
});

