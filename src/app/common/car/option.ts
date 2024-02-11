export interface Option {
    configs: Configuration[],
    towHitch: boolean,
    yoke: boolean
}

export interface Configuration {
    id: number,
    description: string,
    range: number,
    speed: number,
    price: number
}
