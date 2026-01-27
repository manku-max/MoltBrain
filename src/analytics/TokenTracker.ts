/**
 * Token Tracker
 * 
 * Tracks token usage across sessions and provides analytics.
 */

export interface TokenUsage {
  input: number;
  output: number;
  total: number;
  timestamp: number;
}

export interface TokenStats {
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  averagePerSession: number;
  averagePerObservation: number;
  peakUsage: TokenUsage | null;
  usageByDay: Map<string, number>;
  usageByProject: Map<string, number>;
}

export interface TokenBudget {
  daily: number;
  monthly: number;
  perSession: number;
}

export class TokenTracker {
  private usageHistory: TokenUsage[] = [];
  private sessionTokens: Map<string, number> = new Map();
  private projectTokens: Map<string, number> = new Map();
  private budget: TokenBudget | null = null;

  constructor(budget?: TokenBudget) {
    this.budget = budget || null;
  }

  /**
   * Record token usage for an operation
   */
  record(input: number, output: number, sessionId?: string, project?: string): void {
    const usage: TokenUsage = {
      input,
      output,
      total: input + output,
      timestamp: Date.now(),
    };

    this.usageHistory.push(usage);

    if (sessionId) {
      const current = this.sessionTokens.get(sessionId) || 0;
      this.sessionTokens.set(sessionId, current + usage.total);
    }

    if (project) {
      const current = this.projectTokens.get(project) || 0;
      this.projectTokens.set(project, current + usage.total);
    }
  }

  /**
   * Get total tokens used
   */
  getTotalTokens(): number {
    return this.usageHistory.reduce((sum, u) => sum + u.total, 0);
  }

  /**
   * Get tokens used today
   */
  getTodayTokens(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfDay = today.getTime();

    return this.usageHistory
      .filter(u => u.timestamp >= startOfDay)
      .reduce((sum, u) => sum + u.total, 0);
  }

  /**
   * Get tokens used this month
   */
  getMonthTokens(): number {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    return this.usageHistory
      .filter(u => u.timestamp >= startOfMonth)
      .reduce((sum, u) => sum + u.total, 0);
  }

  /**
   * Get tokens for a specific session
   */
  getSessionTokens(sessionId: string): number {
    return this.sessionTokens.get(sessionId) || 0;
  }

  /**
   * Get tokens for a specific project
   */
  getProjectTokens(project: string): number {
    return this.projectTokens.get(project) || 0;
  }

  /**
   * Check if within budget
   */
  isWithinBudget(): { daily: boolean; monthly: boolean; session: boolean } {
    if (!this.budget) {
      return { daily: true, monthly: true, session: true };
    }

    return {
      daily: this.getTodayTokens() <= this.budget.daily,
      monthly: this.getMonthTokens() <= this.budget.monthly,
      session: true, // Checked per-session
    };
  }

  /**
   * Check if session is within budget
   */
  isSessionWithinBudget(sessionId: string): boolean {
    if (!this.budget) return true;
    return this.getSessionTokens(sessionId) <= this.budget.perSession;
  }

  /**
   * Get remaining budget
   */
  getRemainingBudget(): { daily: number; monthly: number } | null {
    if (!this.budget) return null;

    return {
      daily: Math.max(0, this.budget.daily - this.getTodayTokens()),
      monthly: Math.max(0, this.budget.monthly - this.getMonthTokens()),
    };
  }

  /**
   * Get comprehensive statistics
   */
  getStats(): TokenStats {
    const totalTokens = this.getTotalTokens();
    const inputTokens = this.usageHistory.reduce((sum, u) => sum + u.input, 0);
    const outputTokens = this.usageHistory.reduce((sum, u) => sum + u.output, 0);

    const sessionCount = this.sessionTokens.size;
    const averagePerSession = sessionCount > 0 ? totalTokens / sessionCount : 0;
    const averagePerObservation = this.usageHistory.length > 0 
      ? totalTokens / this.usageHistory.length 
      : 0;

    // Find peak usage
    let peakUsage: TokenUsage | null = null;
    for (const usage of this.usageHistory) {
      if (!peakUsage || usage.total > peakUsage.total) {
        peakUsage = usage;
      }
    }

    // Usage by day
    const usageByDay = new Map<string, number>();
    for (const usage of this.usageHistory) {
      const day = new Date(usage.timestamp).toISOString().split('T')[0];
      const current = usageByDay.get(day) || 0;
      usageByDay.set(day, current + usage.total);
    }

    return {
      totalTokens,
      inputTokens,
      outputTokens,
      averagePerSession,
      averagePerObservation,
      peakUsage,
      usageByDay,
      usageByProject: new Map(this.projectTokens),
    };
  }

  /**
   * Get usage trend (last N days)
   */
  getUsageTrend(days: number = 7): Array<{ date: string; tokens: number }> {
    const trend: Array<{ date: string; tokens: number }> = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const startOfDay = new Date(dateStr).getTime();
      const endOfDay = startOfDay + 24 * 60 * 60 * 1000;

      const tokens = this.usageHistory
        .filter(u => u.timestamp >= startOfDay && u.timestamp < endOfDay)
        .reduce((sum, u) => sum + u.total, 0);

      trend.push({ date: dateStr, tokens });
    }

    return trend;
  }

  /**
   * Estimate tokens for text
   */
  static estimateTokens(text: string): number {
    // Rough approximation: ~4 characters per token for English
    return Math.ceil(text.length / 4);
  }

  /**
   * Clear history (for testing or reset)
   */
  clear(): void {
    this.usageHistory = [];
    this.sessionTokens.clear();
    this.projectTokens.clear();
  }

  /**
   * Export usage data
   */
  export(): {
    history: TokenUsage[];
    sessions: Record<string, number>;
    projects: Record<string, number>;
  } {
    return {
      history: [...this.usageHistory],
      sessions: Object.fromEntries(this.sessionTokens),
      projects: Object.fromEntries(this.projectTokens),
    };
  }

  /**
   * Import usage data
   */
  import(data: {
    history: TokenUsage[];
    sessions: Record<string, number>;
    projects: Record<string, number>;
  }): void {
    this.usageHistory = [...data.history];
    this.sessionTokens = new Map(Object.entries(data.sessions));
    this.projectTokens = new Map(Object.entries(data.projects));
  }
}

// Singleton instance
let instance: TokenTracker | null = null;

export function getTokenTracker(budget?: TokenBudget): TokenTracker {
  if (!instance) {
    instance = new TokenTracker(budget);
  }
  return instance;
}
