import {ComponentFixture, TestBed} from "@angular/core/testing";
import {Step3Component} from "./step3.component";
import {Step2Service} from "@tesla/common/step2/step2.service";
import {Step1Service} from "@tesla/common/step1/step1.service";
import {ConfigurationAndOptions} from "@tesla/common/step2/configuration-and-options";
import {ModelAndColor} from "@tesla/common/step1/model-and-color";
import {Model} from "@tesla/common/car/model";
import SpyObj = jasmine.SpyObj;

describe("Step3Component", () => {
    let fixture: ComponentFixture<Step3Component>;
    let step1ServiceSpy: SpyObj<Step1Service> = jasmine.createSpyObj<Step1Service>(["getModelAndColor"]);
    let step2ServiceSpy: SpyObj<Step2Service> = jasmine.createSpyObj<Step2Service>(["getSelectedConfigurationAndOptions"]);
    const model: Model = {
        code: "S",
        description: "Model S",
        colors: [
            {code: "white", description: "Pearl White Multi-Coat", price: 200},
        ]
    }
    const modelAndColor: ModelAndColor = {model: model, color: model.colors[0]}
    const configAndOption: ConfigurationAndOptions = {
        config: {id: 1, description: "Dual Motor All-Wheel Drive", range: 405, speed: 149, price: 74990},
        towHitch: false,
        yoke: false
    };
    const towHitchSummarySelector = "#towHitchSummary";
    const yokeSummarySelector = "#yokeSummary";
    const totalCostSummarySelector = "#totalCostSummary";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Step3Component],
            providers: [{
                provide: Step1Service,
                useValue: step1ServiceSpy
            }, {
                provide: Step2Service,
                useValue: step2ServiceSpy
            }]
        })
            .compileComponents();
        step1ServiceSpy.getModelAndColor.and.returnValue(modelAndColor);
    });

    describe("", () => {
        beforeEach(async () => {
            step2ServiceSpy.getSelectedConfigurationAndOptions.and.returnValue(configAndOption);
            fixture = TestBed.createComponent(Step3Component);
            fixture.detectChanges();
        });

        it("should display selected model description", () => {
            const title: HTMLTitleElement = fixture.nativeElement.querySelector("h2");
            expect(title.textContent).toContain("Your Model S");
        });

        it("should display selected config description and price", () => {
            const configSummary: HTMLTableRowElement = fixture.nativeElement.querySelector("#configSummary");
            expect(configSummary.cells.item(0)!.textContent).toContain("Dual Motor All-Wheel Drive");
            expect(configSummary.cells.item(1)!.textContent).toContain("$74,990.00");
        });

        it("should display selected config details", () => {
            const configDetails: HTMLTableRowElement = fixture.nativeElement.querySelector("#configDetails");
            expect(configDetails.cells.item(0)!.textContent).toContain("Range: 405 miles - Max speed: 149");
        });

        it("should display selected color description and price", () => {
            const colorSummary: HTMLTableRowElement = fixture.nativeElement.querySelector("#colorSummary");
            expect(colorSummary.cells.item(0)!.textContent).toContain("Pearl White Multi-Coat");
            expect(colorSummary.cells.item(1)!.textContent).toContain("$200.00");
        });

        it("should display total price", () => {
            const totalPriceSummary: HTMLTableRowElement = fixture.nativeElement.querySelector(totalCostSummarySelector);
            expect(totalPriceSummary.cells.item(0)!.textContent).toContain("TOTAL COST");
            expect(totalPriceSummary.cells.item(1)!.textContent).toContain("$75,190.00");
        });

        it("when no tow hitch is selected, should not display tow hitch summary", () => {
            const towHitchSummary: HTMLTableRowElement = fixture.nativeElement.querySelector(towHitchSummarySelector);
            expect(towHitchSummary).toBeFalsy();
        });

        it("when no yoke is selected, should not display tow hitch summary", () => {
            const yokeSummary: HTMLTableRowElement = fixture.nativeElement.querySelector(yokeSummarySelector);
            expect(yokeSummary).toBeFalsy();
        });
    });

    describe("when tow hitch option is selected", () => {
        beforeEach(async () => {
            step2ServiceSpy.getSelectedConfigurationAndOptions.and.returnValue({...configAndOption, towHitch: true});
            fixture = TestBed.createComponent(Step3Component);
            fixture.detectChanges();
        });

        it("should display tow hitch description and price", () => {
            const towHitchSummary: HTMLTableRowElement = fixture.nativeElement.querySelector(towHitchSummarySelector);
            expect(towHitchSummary).toBeTruthy();
            expect(towHitchSummary.cells.item(0)!.textContent).toContain("Tow Hitch Package");
            expect(towHitchSummary.cells.item(1)!.textContent).toContain("$1,000.00");
        });

        it("should display total price including tow hitch option price", () => {
            const totalPriceSummary: HTMLTableRowElement = fixture.nativeElement.querySelector(totalCostSummarySelector);
            expect(totalPriceSummary.cells.item(1)!.textContent).toContain("$76,190.00");
        });
    })

    describe("when yoke option is selected", () => {
        beforeEach(async () => {
            step2ServiceSpy.getSelectedConfigurationAndOptions.and.returnValue({...configAndOption, yoke: true});
            fixture = TestBed.createComponent(Step3Component);
            fixture.detectChanges();
        });

        it("should display yoke description and price", () => {
            const towHitchSummary: HTMLTableRowElement = fixture.nativeElement.querySelector(yokeSummarySelector);
            expect(towHitchSummary).toBeTruthy();
            expect(towHitchSummary.cells.item(0)!.textContent).toContain("Yoke Package");
            expect(towHitchSummary.cells.item(1)!.textContent).toContain("$1,000.00");
        });

        it("should display total price including yoke option price", () => {
            const totalPriceSummary: HTMLTableRowElement = fixture.nativeElement.querySelector(totalCostSummarySelector);
            expect(totalPriceSummary.cells.item(1)!.textContent).toContain("$76,190.00");
        });
    });
});
