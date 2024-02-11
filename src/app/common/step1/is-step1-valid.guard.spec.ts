import {TestBed} from "@angular/core/testing";
import {Router, UrlTree} from "@angular/router";

import {isStep1ValidGuard} from "./is-step1-valid.guard";
import {Step1Service} from "@tesla/common/step1/step1.service";
import {signal} from "@angular/core";
import {Route} from "@tesla/common/routing/route";
import SpyObj = jasmine.SpyObj;

describe("isStep1ValidGuard", () => {
    const executeGuard = () =>
        TestBed.runInInjectionContext(() => isStep1ValidGuard());
    let step1ServiceSpy: SpyObj<Step1Service>;
    let routerSpy: SpyObj<Router>;

    beforeEach(() => {
        step1ServiceSpy = jasmine.createSpyObj<Step1Service>(["getIsStepValid"]);
        routerSpy = jasmine.createSpyObj<Router>(["parseUrl"]);
        TestBed.configureTestingModule({
            providers: [
                {provide: Step1Service, useValue: step1ServiceSpy},
                {provide: Router, useValue: routerSpy},
            ]
        });
    });

    it('should return true when step 1 is valid', () => {
        step1ServiceSpy.getIsStepValid.and.returnValue(signal(true));
        expect(executeGuard()).toBeTrue();
    });

    it('should return step 1 url tree when step 1 is invalid', () => {
        const mockUrlTree = new UrlTree(undefined, undefined, "PageMock");
        step1ServiceSpy.getIsStepValid.and.returnValue(signal(false));
        routerSpy.parseUrl.and.returnValue(mockUrlTree)

        expect(executeGuard()).toBe(mockUrlTree);
        expect(routerSpy.parseUrl).toHaveBeenCalledWith(Route.Step1);
    });
});
