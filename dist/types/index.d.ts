export declare class SingleFlight {
    #private;
    do<T>(key: string, fn: () => Promise<T>): Promise<T>;
    flightsCount(): number;
}
