/**
 * GovernanceBlockchain - Simulated blockchain for autonomous governance
 *
 * This blockchain implementation manages:
 * - Office holder tracking
 * - Performance metrics with historical data
 * - Autonomous election triggers
 * - Ranked choice voting
 * - Transparent transaction history
 */
export class GovernanceBlockchain {
  constructor() {
    this.blocks = [];
    this.currentOfficeHolders = {};
    this.performanceMetrics = {};
    this.activeElections = {};
    this.completedElections = {}; // Store completed elections for viewing results
    this.votingRecords = {};
    this.initializeGenesis();
  }

  initializeGenesis() {
    const genesisBlock = {
      index: 0,
      timestamp: Date.now() - 365 * 24 * 60 * 60 * 1000, // 1 year ago
      transactions: [{
        type: 'OFFICE_INITIALIZATION',
        office: 'Governor',
        holder: {
          id: 'official_001',
          name: 'Sarah Chen',
          publicKey: '0x7a9f3e2d1c4b8a6f5e3d2c1b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0',
          termStart: Date.now() - 365 * 24 * 60 * 60 * 1000,
          termLength: 4 * 365 * 24 * 60 * 60 * 1000
        },
        initialMetrics: {
          gdp: 100,
          educationRanking: 15,
          approvalRating: 55,
          unemploymentRate: 4.2,
          infrastructureScore: 72
        }
      }],
      previousHash: '0',
      hash: this.calculateHash({ index: 0, timestamp: Date.now(), transactions: [], previousHash: '0' })
    };

    this.blocks.push(genesisBlock);
    this.currentOfficeHolders['Governor'] = genesisBlock.transactions[0].holder;
    const initialMetrics = genesisBlock.transactions[0].initialMetrics;
    this.performanceMetrics['Governor'] = {
      history: [{ ...initialMetrics, timestamp: genesisBlock.timestamp }],
      current: initialMetrics,
      baseline: { ...initialMetrics } // Establish baseline from start
    };
  }

  calculateHash(block) {
    return '0x' + Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  addBlock(transactions) {
    const block = {
      index: this.blocks.length,
      timestamp: Date.now(),
      transactions,
      previousHash: this.blocks[this.blocks.length - 1].hash,
      hash: ''
    };
    block.hash = this.calculateHash(block);
    this.blocks.push(block);
    return block;
  }

  updateMetrics(office, newMetrics) {
    const transaction = {
      type: 'METRICS_UPDATE',
      office,
      metrics: newMetrics,
      timestamp: Date.now(),
      validator: 'consensus_nodes'
    };

    this.addBlock([transaction]);

    if (!this.performanceMetrics[office]) {
      this.performanceMetrics[office] = { history: [], current: {} };
    }

    this.performanceMetrics[office].history.push({
      ...newMetrics,
      timestamp: transaction.timestamp
    });
    this.performanceMetrics[office].current = newMetrics;

    // Check if metrics trigger an election
    this.evaluateGovernanceTriggers(office);
  }

  evaluateGovernanceTriggers(office) {
    const metrics = this.performanceMetrics[office]?.current;
    const baseline = this.performanceMetrics[office]?.baseline;
    const holder = this.currentOfficeHolders[office];

    if (!metrics || !holder) return null;

    const triggers = [];

    // Term completion check
    const termElapsed = Date.now() - holder.termStart;
    if (termElapsed >= holder.termLength) {
      triggers.push({ type: 'TERM_COMPLETE', severity: 'mandatory' });
    }

    // Performance-based triggers - measuring change from baseline
    if (baseline) {
      // Approval rating: 20+ point drop from baseline (e.g., 55% -> 35% or lower)
      const approvalDrop = baseline.approvalRating - metrics.approvalRating;
      if (approvalDrop >= 20) {
        triggers.push({
          type: 'APPROVAL_COLLAPSE',
          value: metrics.approvalRating,
          baseline: baseline.approvalRating,
          change: -approvalDrop,
          severity: 'critical'
        });
      }

      // GDP: 10% or greater decline from baseline
      const gdpDecline = ((baseline.gdp - metrics.gdp) / baseline.gdp) * 100;
      if (gdpDecline >= 10) {
        triggers.push({
          type: 'GDP_DECLINE',
          value: metrics.gdp,
          baseline: baseline.gdp,
          change: -gdpDecline,
          severity: 'critical'
        });
      }

      // Education: Dropped 10+ spots in ranking
      const educationDrop = metrics.educationRanking - baseline.educationRanking;
      if (educationDrop >= 10) {
        triggers.push({
          type: 'EDUCATION_DECLINE',
          value: metrics.educationRanking,
          baseline: baseline.educationRanking,
          change: educationDrop,
          severity: 'warning'
        });
      }

      // Unemployment: 2.5+ percentage point increase
      const unemploymentIncrease = metrics.unemploymentRate - baseline.unemploymentRate;
      if (unemploymentIncrease >= 2.5) {
        triggers.push({
          type: 'UNEMPLOYMENT_SPIKE',
          value: metrics.unemploymentRate,
          baseline: baseline.unemploymentRate,
          change: unemploymentIncrease,
          severity: 'warning'
        });
      }

      // Infrastructure: 15+ point decline from baseline
      const infrastructureDecline = baseline.infrastructureScore - metrics.infrastructureScore;
      if (infrastructureDecline >= 15) {
        triggers.push({
          type: 'INFRASTRUCTURE_FAILURE',
          value: metrics.infrastructureScore,
          baseline: baseline.infrastructureScore,
          change: -infrastructureDecline,
          severity: 'critical'
        });
      }
    } else {
      // Fallback to absolute thresholds if no baseline (first term)
      if (metrics.approvalRating < 35) {
        triggers.push({ type: 'LOW_APPROVAL', value: metrics.approvalRating, threshold: 35, severity: 'critical' });
      }

      if (metrics.gdp < 90) {
        triggers.push({ type: 'GDP_DECLINE', value: metrics.gdp, threshold: 90, severity: 'critical' });
      }

      if (metrics.educationRanking > 25) {
        triggers.push({ type: 'EDUCATION_DECLINE', value: metrics.educationRanking, threshold: 25, severity: 'warning' });
      }

      if (metrics.unemploymentRate > 7.5) {
        triggers.push({ type: 'UNEMPLOYMENT_HIGH', value: metrics.unemploymentRate, threshold: 7.5, severity: 'warning' });
      }

      if (metrics.infrastructureScore < 55) {
        triggers.push({ type: 'INFRASTRUCTURE_FAILURE', value: metrics.infrastructureScore, threshold: 55, severity: 'critical' });
      }
    }

    // Autonomous election initiation
    if (triggers.some(t => t.severity === 'mandatory' || t.severity === 'critical')) {
      if (!this.activeElections[office]) {
        this.initiateElection(office, triggers);
      }
    }

    return triggers;
  }

  initiateElection(office, triggers) {
    const election = {
      id: `election_${office}_${Date.now()}`,
      office,
      triggers,
      startTime: Date.now(),
      phase: 'candidate_registration',
      candidates: [],
      votes: [],
      status: 'active'
    };

    this.activeElections[office] = election;

    const transaction = {
      type: 'ELECTION_INITIATED',
      election: election.id,
      office,
      triggers: triggers.map(t => t.type),
      autonomousActivation: true
    };

    this.addBlock([transaction]);
    return election;
  }

  registerCandidate(electionId, office, candidate) {
    const election = this.activeElections[office];
    if (!election) return null;

    const registration = {
      candidateId: candidate.id,
      name: candidate.name,
      publicKey: candidate.publicKey,
      platform: candidate.platform,
      timestamp: Date.now()
    };

    election.candidates.push(registration);

    const transaction = {
      type: 'CANDIDATE_REGISTERED',
      election: electionId,
      candidate: registration,
      blockchainVerified: true
    };

    this.addBlock([transaction]);
    return registration;
  }

  castRankedVote(office, voterId, voterPublicKey, rankedChoices, signature) {
    const election = this.activeElections[office];
    if (!election || election.phase !== 'voting') return null;

    const vote = {
      voterId,
      voterPublicKey,
      rankedChoices, // Array of candidate IDs in preference order
      signature,
      timestamp: Date.now(),
      voteHash: this.calculateHash({ voterId, rankedChoices, timestamp: Date.now() })
    };

    election.votes.push(vote);

    const transaction = {
      type: 'VOTE_CAST',
      election: election.id,
      voteHash: vote.voteHash,
      voterPublicKey, // Public key for verification, not identity
      timestamp: vote.timestamp,
      signatureVerified: true
    };

    this.addBlock([transaction]);
    return vote;
  }

  tallyRankedChoiceVotes(office) {
    const election = this.activeElections[office];
    if (!election) return null;

    const candidates = election.candidates.map(c => c.candidateId);
    let activeBallots = election.votes.map(v => ({
      ...v,
      currentChoice: 0
    }));

    const rounds = [];

    while (candidates.length > 1) {
      // Count first-choice votes for each remaining candidate
      const voteCounts = {};
      candidates.forEach(c => voteCounts[c] = 0);

      activeBallots.forEach(ballot => {
        const choice = ballot.rankedChoices[ballot.currentChoice];
        if (candidates.includes(choice)) {
          voteCounts[choice]++;
        }
      });

      const totalVotes = activeBallots.length;
      const majority = Math.floor(totalVotes / 2) + 1;

      rounds.push({ voteCounts, totalVotes });

      // Check for majority winner
      const winner = Object.entries(voteCounts).find(([_, count]) => count >= majority);
      if (winner) {
        return { winner: winner[0], rounds, totalBallots: election.votes.length };
      }

      // Eliminate candidate with fewest votes
      const loser = Object.entries(voteCounts)
        .sort((a, b) => a[1] - b[1])[0][0];

      const loserIndex = candidates.indexOf(loser);
      candidates.splice(loserIndex, 1);

      // Redistribute votes
      activeBallots = activeBallots.map(ballot => {
        if (ballot.rankedChoices[ballot.currentChoice] === loser) {
          return { ...ballot, currentChoice: ballot.currentChoice + 1 };
        }
        return ballot;
      });
    }

    return { winner: candidates[0], rounds, totalBallots: election.votes.length };
  }

  concludeElection(office) {
    const election = this.activeElections[office];
    if (!election) return null;

    const results = this.tallyRankedChoiceVotes(office);
    const winner = election.candidates.find(c => c.candidateId === results.winner);

    const newHolder = {
      id: winner.candidateId,
      name: winner.name,
      publicKey: winner.publicKey,
      termStart: Date.now(),
      termLength: 4 * 365 * 24 * 60 * 60 * 1000
    };

    this.currentOfficeHolders[office] = newHolder;
    election.status = 'completed';
    election.results = results;
    election.completedAt = Date.now();

    const transaction = {
      type: 'ELECTION_CONCLUDED',
      election: election.id,
      office,
      winner: winner.candidateId,
      totalVotes: results.totalBallots,
      rounds: results.rounds.length,
      newOfficeHolder: newHolder
    };

    this.addBlock([transaction]);

    // Establish fresh baseline metrics for the new office holder
    // New administration inherits current situation but gets fresh targets from this point
    const currentMetrics = this.performanceMetrics[office]?.current || {};
    const newBaseline = {
      gdp: currentMetrics.gdp || 100, // Inherit current GDP
      educationRanking: currentMetrics.educationRanking || 15, // Inherit current ranking
      approvalRating: 55, // Fresh approval rating
      unemploymentRate: currentMetrics.unemploymentRate || 4.2, // Inherit current rate
      infrastructureScore: currentMetrics.infrastructureScore || 72 // Inherit current score
    };

    // Update metrics with reset approval and new baseline
    this.performanceMetrics[office].baseline = { ...newBaseline };
    this.performanceMetrics[office].current = { ...newBaseline };
    this.performanceMetrics[office].history.push({
      ...newBaseline,
      timestamp: Date.now(),
      event: 'NEW_TERM_START'
    });

    // Move to completed elections before clearing from active
    if (!this.completedElections[office]) {
      this.completedElections[office] = [];
    }
    this.completedElections[office].unshift(election); // Add to beginning (most recent first)

    // Keep only last 5 completed elections per office
    if (this.completedElections[office].length > 5) {
      this.completedElections[office] = this.completedElections[office].slice(0, 5);
    }

    // Clear the active election so it no longer shows as active
    delete this.activeElections[office];

    return results;
  }
}
