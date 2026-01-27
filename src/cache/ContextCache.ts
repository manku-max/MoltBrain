/**
 * Context Cache
 * 
 * Caches generated context to avoid redundant processing.
 */

import { QueryCache, type QueryCacheOptions } from './QueryCache.js';

export interface ContextCacheEntry {
  context: string;
  tokenCount: number;
  observations: number[];
  generatedAt: number;
}

export interface ContextCacheOptions extends QueryCacheOptions {
  maxTokens?: number;
}

export class ContextCache {
  private cache: QueryCache<ContextCacheEntry>;
  private options: ContextCacheOptions;

  constructor(options: ContextCacheOptions = {}) {
    this.options = {
      maxSize: 50,
      ttlMs: 10 * 60 * 1000, // 10 minutes
      maxTokens: 100000,
      ...options,
    };

    this.cache = new QueryCache<ContextCacheEntry>({
      maxSize: this.options.maxSize,
      ttlMs: this.options.ttlMs,
    });
  }

  /**
   * Generate cache key from parameters
   */
  generateKey(params: {
    project: string;
    sessionId?: string;
    query?: string;
    limit?: number;
  }): string {
    const parts = [
      `project:${params.project}`,
      params.sessionId ? `session:${params.sessionId}` : '',
      params.query ? `query:${params.query}` : '',
      params.limit ? `limit:${params.limit}` : '',
    ].filter(Boolean);

    return parts.join('|');
  }

  /**
   * Get cached context
   */
  get(key: string): ContextCacheEntry | undefined {
    return this.cache.get(key);
  }

  /**
   * Set cached context
   */
  set(
    key: string,
    context: string,
    tokenCount: number,
    observations: number[]
  ): void {
    this.cache.set(key, {
      context,
      tokenCount,
      observations,
      generatedAt: Date.now(),
    });
  }

  /**
   * Check if context is cached
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Invalidate context for a project
   */
  invalidateProject(project: string): number {
    return this.cache.invalidatePattern(new RegExp(`project:${project}`));
  }

  /**
   * Invalidate context for a session
   */
  invalidateSession(sessionId: string): number {
    return this.cache.invalidatePattern(new RegExp(`session:${sessionId}`));
  }

  /**
   * Invalidate all context containing specific observations
   */
  invalidateObservations(observationIds: number[]): number {
    const idSet = new Set(observationIds);
    let count = 0;

    for (const key of this.cache.keys()) {
      const entry = this.cache.get(key);
      if (entry && entry.observations.some(id => idSet.has(id))) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }

  /**
   * Clear all cached context
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  stats(): {
    size: number;
    totalTokens: number;
    averageTokens: number;
    hitRate: number;
  } {
    const baseStats = this.cache.stats();
    let totalTokens = 0;

    for (const key of this.cache.keys()) {
      const entry = this.cache.get(key);
      if (entry) {
        totalTokens += entry.tokenCount;
      }
    }

    return {
      size: baseStats.size,
      totalTokens,
      averageTokens: baseStats.size > 0 ? totalTokens / baseStats.size : 0,
      hitRate: baseStats.hitRate,
    };
  }

  /**
   * Get or generate context
   */
  async getOrGenerate(
    key: string,
    generator: () => Promise<{ context: string; tokenCount: number; observations: number[] }>
  ): Promise<ContextCacheEntry> {
    const cached = this.get(key);
    if (cached) {
      return cached;
    }

    const result = await generator();
    this.set(key, result.context, result.tokenCount, result.observations);
    
    return {
      ...result,
      generatedAt: Date.now(),
    };
  }

  /**
   * Prune expired entries
   */
  prune(): number {
    return this.cache.prune();
  }
}

// Singleton instance
let instance: ContextCache | null = null;

export function getContextCache(options?: ContextCacheOptions): ContextCache {
  if (!instance) {
    instance = new ContextCache(options);
  }
  return instance;
}
