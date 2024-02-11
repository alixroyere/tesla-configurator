import {Router, UrlTree} from "@angular/router";
import {inject} from "@angular/core";
import {Route} from "@tesla/common/routing/route";
import {Step2Service} from "@tesla/common/step2/step2.service";

export const isStep2ValidGuard: () => true | UrlTree = (): true | UrlTree => {
    return inject(Step2Service).getIsStepValid()() ? true : inject(Router).parseUrl(Route.Step1);
};
