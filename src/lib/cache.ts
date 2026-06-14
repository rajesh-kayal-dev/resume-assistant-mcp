import NodeCache from "@cacheable/node-cache";

// Default TTL is 1 hour since job descriptions don't change frequently within a day
export const cache = new NodeCache({ stdTTL: 3600 });
