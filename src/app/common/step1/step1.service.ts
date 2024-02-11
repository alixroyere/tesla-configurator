import {computed, effect, Injectable, Signal} from "@angular/core";
import {CarIoService} from "@tesla/common/car/car-io.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {Observable, retry} from "rxjs";
import {Color, Model} from "@tesla/common/car/model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ModelAndColorForm} from "@tesla/common/step1/model-and-color-form";
import {ModelAndColor} from "@tesla/common/step1/model-and-color";

@Injectable({
    providedIn: "root"
})
export class Step1Service {
    private modelControl: FormControl<Model | null> = new FormControl(
        null, {validators: [Validators.required]}
    );
    private form: FormGroup<ModelAndColorForm> = new FormGroup({
            model: this.modelControl,
            color: new FormControl<Color | undefined>(
                undefined, {nonNullable: true, validators: [Validators.required]}
            ),
        }
    );
    private readonly formValues: Signal<{ model?: Model | null, color?: Color | undefined }>;
    private readonly modelOptions: Signal<Model[]>;
    private readonly selectedModel: Signal<Model | null>;
    private readonly colorOptions: Signal<Color[]>;
    private readonly isStep1Valid: Signal<boolean>;
    private readonly imageUrl: Signal<string>;

    constructor(private carService: CarIoService) {
        this.formValues = this.trackFormValueChanges();
        this.selectedModel = this.trackSelectedModel();
        this.modelOptions = this.generateModelOptions();
        this.colorOptions = this.generateColorOptions();
        this.isStep1Valid = this.generateIsStep1Valid();
        this.imageUrl = this.generateImageUrl();
        this.reselectFirstColorOptionWhenColorOptionsAreUpdated();
    }

    public getForm(): FormGroup<ModelAndColorForm> {
        return this.form;
    }


    public getModelOptions(): Signal<Model[]> {
        return this.modelOptions;
    }

    public getColorOptions(): Signal<Color[]> {
        return this.colorOptions;
    }

    public getImageUrl(): Signal<string> {
        return this.imageUrl;
    }

    public getIsStepValid(): Signal<boolean> {
        return this.isStep1Valid;
    }

    public getSelectedModel(): Model | null {
        return this.selectedModel();
    }

    public getModelAndColor(): ModelAndColor {
        return this.form.value;
    }

    private trackFormValueChanges(): Signal<{ model?: Model | null, color?: Color | undefined }> {
        return toSignal(
            this.form.valueChanges,
            {initialValue: {model: null, color: undefined}}
        );
    }

    private trackSelectedModel(): Signal<Model | null> {
        return toSignal(this.modelControl.valueChanges, {initialValue: null});
    }

    private generateModelOptions(): Signal<Model[]> {
        return toSignal(this.retrieveModels(), {initialValue: []});
    }

    private retrieveModels(): Observable<Model[]> {
        return this.carService.retrieveModels()
            .pipe(
                retry(10), // needed as the mock system is not directly available at app launch, nor on init of step1 component
            );
    }

    private generateColorOptions(): Signal<Color[]> {
        return computed(
            () => this.modelOptions().find(model => model.code == this.selectedModel()?.code)?.colors || []);
    }

    private generateIsStep1Valid(): Signal<boolean> {
        return computed(() => this.formValues() && this.form.valid);
    }

    private generateImageUrl(): Signal<string> {
        return computed(() =>
            `https://interstate21.com/tesla-app/images/${this.formValues().model?.code}/${this.formValues().color?.code}.jpg`);
    }

    private reselectFirstColorOptionWhenColorOptionsAreUpdated(): void {
        effect(() => this.form.controls.color.patchValue(
                this.colorOptions().at(0)),
            {allowSignalWrites: true}
        );
    }
}
