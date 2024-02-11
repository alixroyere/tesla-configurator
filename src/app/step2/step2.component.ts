import {ChangeDetectionStrategy, Component, Signal, TrackByFunction} from "@angular/core";
import {Configuration, Option} from "@tesla/common/car/option";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Step2Service} from "@tesla/common/step2/step2.service";
import {ConfigurationAndOptionsForm} from "@tesla/common/step2/configuration-and-options-form";

@Component({
    selector: "app-step2",
    standalone: true,
    imports: [
        NgForOf,
        ReactiveFormsModule,
        NgIf,
        CurrencyPipe,
    ],
    templateUrl: "./step2.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Step2Component {
    protected options: Signal<Option | undefined>;
    public form: FormGroup<ConfigurationAndOptionsForm>;

    protected trackById: TrackByFunction<Configuration> = (_: number, option: Configuration) => {
        return option.id;
    };
    protected compareConfigFn = (conf1: Configuration, conf2: Configuration): boolean => {
        return conf1 && conf2 ? conf1.id === conf2.id : conf1 == conf2;
    };

    constructor(step2Service: Step2Service) {
        this.options = step2Service.retrieveOptionAndUpdateAssociatedTowAndYokeAvailabilityInForm();
        this.form = step2Service.getForm();
    }
}
