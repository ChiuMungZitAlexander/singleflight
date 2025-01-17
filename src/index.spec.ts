import { SingleFlight } from ".";

describe("SingleFlight", () => {
  let singleFlight: SingleFlight;

  beforeEach(() => {
    singleFlight = new SingleFlight();
  });

  it("should execute the function only once for the same key", async () => {
    const mockFn = jest.fn().mockResolvedValue("result");

    const promise1 = singleFlight.do("key1", mockFn);
    const promise2 = singleFlight.do("key1", mockFn);

    expect(mockFn).toHaveBeenCalledTimes(1);

    const result1 = await promise1;
    const result2 = await promise2;

    expect(result1).toBe("result");
    expect(result2).toBe("result");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should execute the function again for a different key", async () => {
    const mockFn1 = jest.fn().mockResolvedValue("result1");
    const mockFn2 = jest.fn().mockResolvedValue("result2");

    const result1 = await singleFlight.do("key1", mockFn1);
    const result2 = await singleFlight.do("key2", mockFn2);

    expect(result1).toBe("result1");
    expect(result2).toBe("result2");
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });

  it("should remove the key from flightsMap after promise resolution", async () => {
    const mockFn = jest.fn().mockResolvedValue("result");

    await singleFlight.do("key1", mockFn);

    // Check internal map after the promise resolves
    expect(singleFlight.flightsCount()).toBe(0); // Accessing private members is typically not advised, but can be done for testing.
  });

  it("should handle rejected promises correctly", async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error("failure"));

    await expect(singleFlight.do("key1", mockFn)).rejects.toThrow("failure");

    // Ensure the key is removed after rejection
    expect(singleFlight.flightsCount()).toBe(0);
  });
});
