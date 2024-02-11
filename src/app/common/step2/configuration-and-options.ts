import {Configuration} from "@tesla/common/car/option";

export interface ConfigurationAndOptions {
    config?: Configuration | null,
    towHitch?: boolean,
    yoke?: boolean
}
