import {ChangeDetectionStrategy, Component, Signal, TrackByFunction} from "@angular/core";
import {NgForOf, NgIf} from "@angular/common";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Color, Model} from "@tesla/common/car/model";
import {Step1Service} from "@tesla/common/step1/step1.service";
import {ModelAndColorForm} from "@tesla/common/step1/model-and-color-form";
import {Step2Service} from "@tesla/common/step2/step2.service";

@Component({
    selector: "app-step1",
    standalone: true,
    //signals: true, not available yet :(
    imports: [
        ReactiveFormsModule,
        NgForOf,
        NgIf,
    ],
    templateUrl: "./step1.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Step1Component {
    public form: FormGroup<ModelAndColorForm>;
    protected colorOptions: Signal<Color[]>;
    protected modelOptions: Signal<Model[]>;
    protected trackByCode: TrackByFunction<Model | Color> = (_: number, option: Model | Color) => {
        return option.code;
    };

    constructor(private step1Service: Step1Service, private step2Service: Step2Service) {
        this.form = this.step1Service.getForm();
        this.modelOptions = this.step1Service.getModelOptions();
        this.colorOptions = this.step1Service.getColorOptions();
    }

    protected onModelChange(): void {
        this.step2Service.resetOptions();
    }
}
