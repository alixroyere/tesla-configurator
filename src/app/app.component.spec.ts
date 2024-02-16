import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {Component, signal, WritableSignal} from "@angular/core";
import {StepNavigatorComponent} from "@tesla/common/routing/step-navigator/step-navigator.component";
import {Step1Service} from "@tesla/common/step1/step1.service";
import SpyObj = jasmine.SpyObj;

describe('AppComponent', () => {

    @Component({standalone: true, selector: 'app-step-navigator', template: ''})
    class StepNavigatorStubComponent {
    }

    const url = "https://www.myimageurl.com/";
    let step1ServiceSpy: SpyObj<Step1Service> = jasmine.createSpyObj<Step1Service>(
        ["getIsStepValid", "getImageUrl"]
    );
    let isStep1Valid: WritableSignal<boolean>;
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AppComponent,
            ],
            providers: [{provide: Step1Service, useValue: step1ServiceSpy}]
        }).overrideComponent(AppComponent, {
            remove: {
                imports: [StepNavigatorComponent],
            },
            add: {
                imports: [StepNavigatorStubComponent],
            },
        })
            .compileComponents();
        isStep1Valid = signal(false);
        step1ServiceSpy.getIsStepValid.and.returnValue(isStep1Valid);
        step1ServiceSpy.getImageUrl.and.returnValue(signal(url));
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it("should hide car image when step 1 is invalid", () => {
        isStep1Valid.set(false);
        fixture.detectChanges();
        const image = fixture.nativeElement.querySelector("img");
        expect(image).toBeFalsy();
    });

    it("should display car image when step 1 is valid", () => {
        isStep1Valid.set(true);
        fixture.detectChanges();
        const image = fixture.nativeElement.querySelector("img");
        expect(image).toBeTruthy();
        expect(image.src).toEqual(url);
    });
});
