/**
 * Governance System Constants
 *
 * Defines triggers, thresholds, and configuration for autonomous governance
 */

export const METRIC_NAMES = {
  GDP: 'gdp',
  EDUCATION: 'educationRanking',
  APPROVAL: 'approvalRating',
  UNEMPLOYMENT: 'unemploymentRate',
  INFRASTRUCTURE: 'infrastructureScore'
};

export const INITIAL_METRICS = {
  gdp: 100,
  educationRanking: 15,
  approvalRating: 55,
  unemploymentRate: 4.2,
  infrastructureScore: 72
};

export const GOVERNANCE_TRIGGERS = {
  // Baseline-relative triggers
  APPROVAL_DROP_THRESHOLD: 20, // 20+ point drop triggers election
  GDP_DECLINE_THRESHOLD: 10, // 10%+ decline triggers election
  EDUCATION_DROP_THRESHOLD: 10, // 10+ rank drop triggers election
  UNEMPLOYMENT_RISE_THRESHOLD: 2.5, // 2.5%+ increase triggers election

  // Absolute thresholds (fallback if no baseline)
  APPROVAL_ABSOLUTE_MIN: 35,
  GDP_ABSOLUTE_MIN: 90,
  EDUCATION_ABSOLUTE_MAX: 25,
  UNEMPLOYMENT_ABSOLUTE_MAX: 7.5
};

export const TRIGGER_TYPES = {
  TERM_COMPLETE: 'TERM_COMPLETE',
  APPROVAL_COLLAPSE: 'APPROVAL_COLLAPSE',
  GDP_DECLINE: 'GDP_DECLINE',
  EDUCATION_DECLINE: 'EDUCATION_DECLINE',
  UNEMPLOYMENT_SPIKE: 'UNEMPLOYMENT_SPIKE',
  LOW_APPROVAL: 'LOW_APPROVAL',
  UNEMPLOYMENT_HIGH: 'UNEMPLOYMENT_HIGH'
};

export const TRIGGER_SEVERITIES = {
  MANDATORY: 'mandatory',
  CRITICAL: 'critical',
  WARNING: 'warning'
};

export const ELECTION_PHASES = {
  CANDIDATE_REGISTRATION: 'candidate_registration',
  VOTING: 'voting',
  TALLYING: 'tallying'
};

export const ELECTION_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed'
};

export const TRANSACTION_TYPES = {
  OFFICE_INITIALIZATION: 'OFFICE_INITIALIZATION',
  METRICS_UPDATE: 'METRICS_UPDATE',
  ELECTION_INITIATED: 'ELECTION_INITIATED',
  CANDIDATE_REGISTERED: 'CANDIDATE_REGISTERED',
  VOTE_CAST: 'VOTE_CAST',
  ELECTION_CONCLUDED: 'ELECTION_CONCLUDED'
};

export const TERM_LENGTH = 4 * 365 * 24 * 60 * 60 * 1000; // 4 years in milliseconds

export const MOCK_CANDIDATES = [
  {
    id: 'candidate_001',
    name: 'Marcus Thompson',
    publicKey: '0x3f7e8d2c9b1a4f6e5d3c2b1a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0',
    platform: 'Economic Recovery & Infrastructure'
  },
  {
    id: 'candidate_002',
    name: 'Elena Rodriguez',
    publicKey: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    platform: 'Education Reform & Innovation'
  },
  {
    id: 'candidate_003',
    name: 'James Washington',
    publicKey: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8',
    platform: 'Job Creation & Social Programs'
  }
];

export const METRIC_DESCRIPTIONS = {
  gdp: 'Gross Domestic Product (GDP) Index',
  educationRanking: 'National Education Ranking',
  approvalRating: 'Public Approval Rating',
  unemploymentRate: 'Unemployment Rate',
  infrastructureScore: 'Infrastructure Quality Score'
};

export const METRIC_FORMATS = {
  gdp: (value) => `${value.toFixed(1)}`,
  educationRanking: (value) => `#${Math.round(value)}`,
  approvalRating: (value) => `${Math.round(value)}%`,
  unemploymentRate: (value) => `${value.toFixed(1)}%`,
  infrastructureScore: (value) => `${Math.round(value)}/100`
};

export const SIMULATION_SPEEDS = {
  SLOW: 3000,
  MEDIUM: 1000,
  FAST: 500
};
