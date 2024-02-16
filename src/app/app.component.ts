import {ChangeDetectionStrategy, Component, Signal} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {StepNavigatorComponent} from "@tesla/common/routing/step-navigator/step-navigator.component";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {Step1Service} from "@tesla/common/step1/step1.service";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [StepNavigatorComponent, RouterOutlet, NgIf, NgOptimizedImage],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <app-step-navigator></app-step-navigator>
        <router-outlet></router-outlet>
        <img *ngIf="isStep1Valid()" [ngSrc]="imageUrl()" alt="picture of a car" width="684" height="400">
    `,
})
export class AppComponent {
    protected isStep1Valid: Signal<boolean>;
    protected imageUrl: Signal<string>;

    constructor(private step1Service: Step1Service) {
        this.isStep1Valid = this.step1Service.getIsStepValid();
        this.imageUrl = this.step1Service.getImageUrl();
    }
}
