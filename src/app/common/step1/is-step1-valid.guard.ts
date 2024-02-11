import {Router, UrlTree} from "@angular/router";
import {Step1Service} from "@tesla/common/step1/step1.service";
import {inject} from "@angular/core";
import {Route} from "@tesla/common/routing/route";

export const isStep1ValidGuard: () => true | UrlTree = (): true | UrlTree => {
    return inject(Step1Service).getIsStepValid()() ? true : inject(Router).parseUrl(Route.Step1);
};
