import {Injectable, Signal} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Configuration, Option} from "@tesla/common/car/option";
import {ConfigurationAndOptionsForm} from "@tesla/common/step2/configuration-and-options-form";
import {map, Observable, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {Step1Service} from "@tesla/common/step1/step1.service";
import {CarIoService} from "@tesla/common/car/car-io.service";
import {ConfigurationAndOptions} from "@tesla/common/step2/configuration-and-options";

@Injectable({
    providedIn: "root"
})
export class Step2Service {
    private form: FormGroup<ConfigurationAndOptionsForm> = new FormGroup({
        config: new FormControl<Configuration | null>(null, {
            validators: Validators.required
        }),
        towHitch: new FormControl<boolean>({value:false, disabled:true}, {nonNullable: true}),
        yoke: new FormControl<boolean>({value:false, disabled: true}, {nonNullable: true})
    })

    private validationChanges: Observable<boolean> = this.form.statusChanges.pipe(map(status => status == "VALID"));
    private validationSignal: Signal<boolean> = toSignal(this.validationChanges, {initialValue: false});

    constructor(private carService: CarIoService, private step1Service: Step1Service) {
    }

    public getForm(): FormGroup<ConfigurationAndOptionsForm> {
        return this.form;
    }

    public retrieveOptionAndUpdateAssociatedTowAndYokeAvailabilityInForm(): Signal<Option | undefined> {
        return toSignal(
            this.carService.retrieveOption(this.step1Service.getSelectedModel()?.code!).pipe(
                tap(option => {
                    this.enableTowIfAvailableForTheOption(option);
                    this.enableYokeIfAvailableForTheOption(option);
                })
            )
        );
    }

    public getIsStepValid(): Signal<boolean> {
        return this.validationSignal;
    }

    public resetOptions(): void {
        this.form.reset();
    }

    public getSelectedConfigurationAndOptions(): ConfigurationAndOptions {
        return this.form.value;
    }

    private enableTowIfAvailableForTheOption(option: Option) {
        if (option.towHitch) {
            this.form.controls.towHitch.enable()
        } else {
            this.form.controls.towHitch.disable()
        }
    }
    private enableYokeIfAvailableForTheOption(option: Option) {
        if (option.yoke) {
            this.form.controls.yoke.enable()
        } else {
            this.form.controls.yoke.disable()
        }
    }
}
