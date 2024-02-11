import {TestBed} from "@angular/core/testing";
import {Router, UrlTree} from "@angular/router";
import {isStep2ValidGuard} from './is-step2-valid.guard';
import {signal} from "@angular/core";
import {Route} from "@tesla/common/routing/route";
import {Step2Service} from "@tesla/common/step2/step2.service";
import SpyObj = jasmine.SpyObj;

describe('isStep2ValidGuard', () => {
    const executeGuard = () =>
        TestBed.runInInjectionContext(() => isStep2ValidGuard());
    let step2ServiceSpy: SpyObj<Step2Service>;
    let routerSpy: SpyObj<Router>;

    beforeEach(() => {
        step2ServiceSpy = jasmine.createSpyObj<Step2Service>(["getIsStepValid"]);
        routerSpy = jasmine.createSpyObj<Router>(["parseUrl"]);
        TestBed.configureTestingModule({
            providers: [
                {provide: Step2Service, useValue: step2ServiceSpy},
                {provide: Router, useValue: routerSpy},
            ]
        });
    });

    it('should return true when step 2 is valid', () => {
        step2ServiceSpy.getIsStepValid.and.returnValue(signal(true));
        expect(executeGuard()).toBeTrue();
    });

    it('should return step 2 url tree when step 2 is invalid', () => {
        const mockUrlTree = new UrlTree(undefined, undefined, "PageMock");
        step2ServiceSpy.getIsStepValid.and.returnValue(signal(false));
        routerSpy.parseUrl.and.returnValue(mockUrlTree)

        expect(executeGuard()).toBe(mockUrlTree);
        expect(routerSpy.parseUrl).toHaveBeenCalledWith(Route.Step1);
    });
});
