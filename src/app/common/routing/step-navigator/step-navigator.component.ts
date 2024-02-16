import {ChangeDetectionStrategy, Component, computed, Signal} from '@angular/core';
import {Route} from "@tesla/common/routing/route";
import {RouterLink} from "@angular/router";
import {Step1Service} from "@tesla/common/step1/step1.service";
import {Step2Service} from "@tesla/common/step2/step2.service";

@Component({
    selector: 'app-step-navigator',
    standalone: true,
    imports: [
        RouterLink
    ],
    templateUrl: './step-navigator.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepNavigatorComponent {

    protected readonly Route = Route;
    protected readonly shouldDisableStep2: Signal<boolean>;
    protected readonly shouldDisableStep3: Signal<boolean>;

    constructor(step1Service: Step1Service, step2Service: Step2Service) {
        this.shouldDisableStep2 = computed(() => !step1Service.getIsStepValid()());
        this.shouldDisableStep3 = computed(() => !step2Service.getIsStepValid()());
    }
}
