/**
 * JSON Exporter
 * 
 * Exports observations and sessions to JSON format.
 */

import type { Observation, Summary, Session } from '../types/index.js';

export interface JsonExportOptions {
  pretty?: boolean;
  includeMetadata?: boolean;
  dateFormat?: 'iso' | 'unix' | 'human';
}

export interface JsonExportData {
  version: string;
  exported_at: string;
  metadata?: {
    total_observations: number;
    total_sessions: number;
    total_summaries: number;
    date_range: {
      start: string;
      end: string;
    };
    projects: string[];
  };
  observations: Observation[];
  sessions: Session[];
  summaries: Summary[];
}

export class JsonExporter {
  private options: JsonExportOptions;

  constructor(options: JsonExportOptions = {}) {
    this.options = {
      pretty: true,
      includeMetadata: true,
      dateFormat: 'iso',
      ...options,
    };
  }

  /**
   * Export data to JSON string
   */
  export(
    observations: Observation[],
    sessions: Session[],
    summaries: Summary[]
  ): string {
    const data: JsonExportData = {
      version: '9.0.9',
      exported_at: this.formatDate(new Date()),
      observations: observations.map(o => this.transformObservation(o)),
      sessions: sessions.map(s => this.transformSession(s)),
      summaries: summaries.map(s => this.transformSummary(s)),
    };

    if (this.options.includeMetadata) {
      data.metadata = this.generateMetadata(observations, sessions, summaries);
    }

    return this.options.pretty
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data);
  }

  /**
   * Export observations only
   */
  exportObservations(observations: Observation[]): string {
    const data = {
      version: '9.0.9',
      exported_at: this.formatDate(new Date()),
      count: observations.length,
      observations: observations.map(o => this.transformObservation(o)),
    };

    return this.options.pretty
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data);
  }

  /**
   * Export sessions only
   */
  exportSessions(sessions: Session[], summaries: Summary[]): string {
    const data = {
      version: '9.0.9',
      exported_at: this.formatDate(new Date()),
      count: sessions.length,
      sessions: sessions.map(s => ({
        ...this.transformSession(s),
        summary: summaries.find(sum => sum.session_id === s.content_session_id),
      })),
    };

    return this.options.pretty
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data);
  }

  /**
   * Export single observation
   */
  exportSingleObservation(observation: Observation): string {
    return this.options.pretty
      ? JSON.stringify(this.transformObservation(observation), null, 2)
      : JSON.stringify(this.transformObservation(observation));
  }

  private transformObservation(obs: Observation): any {
    return {
      id: obs.id,
      session_id: obs.session_id,
      type: obs.type,
      title: obs.title,
      subtitle: obs.subtitle,
      narrative: obs.narrative,
      facts: this.parseJsonField(obs.facts),
      concepts: this.parseJsonField(obs.concepts),
      files_read: this.parseJsonField(obs.files_read),
      files_modified: this.parseJsonField(obs.files_modified),
      project: obs.project,
      prompt_number: obs.prompt_number,
      created_at: this.formatDate(obs.created_at),
      tokens_used: obs.tokens_used,
    };
  }

  private transformSession(session: Session): any {
    return {
      id: session.id,
      content_session_id: session.content_session_id,
      project: session.project,
      created_at: this.formatDate(session.created_at),
      is_complete: session.is_complete,
      prompt_count: session.prompt_count,
    };
  }

  private transformSummary(summary: Summary): any {
    return {
      id: summary.id,
      session_id: summary.session_id,
      request: summary.request,
      investigated: summary.investigated,
      learned: summary.learned,
      completed: summary.completed,
      next_steps: summary.next_steps,
      notes: summary.notes,
      project: summary.project,
      created_at: this.formatDate(summary.created_at),
    };
  }

  private generateMetadata(
    observations: Observation[],
    sessions: Session[],
    summaries: Summary[]
  ): JsonExportData['metadata'] {
    const projects = new Set<string>();
    let minDate: Date | null = null;
    let maxDate: Date | null = null;

    for (const obs of observations) {
      projects.add(obs.project);
      const date = new Date(obs.created_at);
      if (!minDate || date < minDate) minDate = date;
      if (!maxDate || date > maxDate) maxDate = date;
    }

    return {
      total_observations: observations.length,
      total_sessions: sessions.length,
      total_summaries: summaries.length,
      date_range: {
        start: minDate ? this.formatDate(minDate) : '',
        end: maxDate ? this.formatDate(maxDate) : '',
      },
      projects: Array.from(projects).sort(),
    };
  }

  private formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    
    switch (this.options.dateFormat) {
      case 'unix':
        return String(d.getTime());
      case 'human':
        return d.toLocaleString();
      case 'iso':
      default:
        return d.toISOString();
    }
  }

  private parseJsonField(field: any): any {
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return field;
      }
    }
    return field;
  }
}
