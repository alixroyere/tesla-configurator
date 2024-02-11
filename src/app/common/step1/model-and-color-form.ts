import {FormControl} from "@angular/forms";
import {Color, Model} from "@tesla/common/car/model";

export interface ModelAndColorForm {
    model: FormControl<Model | null>,
    color: FormControl<Color | undefined>,
}
