export class SingleFlight {
  #flightsMap: Map<string, Promise<unknown>> = new Map();

  async do<T>(key: string, fn: () => Promise<T>): Promise<T> {
    if (this.#flightsMap.has(key)) {
      return this.#flightsMap.get(key) as Promise<T>;
    }

    const promise = fn().finally(() => {
      this.#flightsMap.delete(key);
    });

    return promise;
  }
}
