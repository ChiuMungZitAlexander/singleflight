## singleflight

The `singleflight` class is a utility that ensures only one instance of a given asynchronous operation (identified by a unique key) is executed at a time. If multiple calls are made with the same key, they will share the same promise and receive the same result instead of triggering duplicate executions.

### How It Works

- The class maintains a **private map (`#flightsMap`)** that tracks ongoing asynchronous operations using unique string keys.
- The `do<T>(key: string, fn: () => Promise<T>)` method:
  - Checks if an operation with the given key is already running. If so, it returns the existing promise.
  - If not, it invokes the provided function (`fn`) and stores the resulting promise in the map.
  - Once the promise resolves or rejects, it is removed from the map to allow future executions.
- The `flightsCount()` method returns the current number of active asynchronous operations.

### Use Case

The `singleflight` class is useful for preventing redundant API calls, database queries, or expensive computations when multiple requests for the same operation occur simultaneously.

### Example Usage

```typescript
const singleFlight = new SingleFlight();

async function fetchData(id: string) {
  return singleFlight.do(id, async () => {
    console.log(`Fetching data for ${id}...`);
    return new Promise((resolve) =>
      setTimeout(() => resolve(`Data for ${id}`), 1000)
    );
  });
}

fetchData("user-123");
fetchData("user-123"); // This call will reuse the first request instead of making a new one.
```
