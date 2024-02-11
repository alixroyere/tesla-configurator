import {ChangeDetectionStrategy, Component} from "@angular/core";
import {Step2Service} from "@tesla/common/step2/step2.service";
import {ConfigurationAndOptions} from "@tesla/common/step2/configuration-and-options";
import {ModelAndColor} from "@tesla/common/step1/model-and-color";
import {Step1Service} from "@tesla/common/step1/step1.service";
import {CurrencyPipe, NgIf} from "@angular/common";

@Component({
    selector: "app-step3",
    standalone: true,
    imports: [
        CurrencyPipe,
        NgIf
    ],
    templateUrl: "./step3.component.html",
    styleUrl: "./step3.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Step3Component {
    protected configurationAndOptions: ConfigurationAndOptions;
    protected modelAndColor: ModelAndColor;
    protected totalPrice: number;

    constructor(step1Service: Step1Service, step2Service: Step2Service) {
        this.modelAndColor = step1Service.getModelAndColor();
        this.configurationAndOptions = step2Service.getSelectedConfigurationAndOptions()
        this.totalPrice = this.calculateTotal();
    }

    private calculateTotal(): number {
        let total = this.modelAndColor.color!.price + this.configurationAndOptions.config!.price;
        if (this.configurationAndOptions.yoke) {
            total = total + 1000;
        }
        if (this.configurationAndOptions.towHitch) {
            total = total + 1000;
        }
        return total;
    }
}
