import {FormControl} from "@angular/forms";
import {Configuration} from "@tesla/common/car/option";

export interface ConfigurationAndOptionsForm {
    config: FormControl<Configuration | null>,
    towHitch: FormControl<boolean>,
    yoke: FormControl<boolean>
}
