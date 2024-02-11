import {Routes} from '@angular/router';
import {Step3Component} from "@tesla/step3/step3.component";
import {Route} from "@tesla/common/routing/route";
import {isStep1ValidGuard} from "@tesla/common/step1/is-step1-valid.guard";
import {Step1Component} from "@tesla/step1/step1.component";
import {Step2Component} from "@tesla/step2/step2.component";
import {isStep2ValidGuard} from "@tesla/common/step2/is-step2-valid.guard";

export const routes: Routes = [
    {path: Route.Step1, component: Step1Component},
    {path: Route.Step2, component: Step2Component, canActivate: [isStep1ValidGuard]},
    {path: Route.Step3, component: Step3Component, canActivate: [isStep2ValidGuard]},
    {path: "", redirectTo: Route.Step1, pathMatch: "full"},
    {path: "**", redirectTo: Route.Step1}
];

