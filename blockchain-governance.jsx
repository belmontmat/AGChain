import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, TrendingDown, TrendingUp, Users, Award, FileText, Activity, Lock } from 'lucide-react';

// Simulated blockchain with on-chain state
class GovernanceBlockchain {
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

const BlockchainGovernanceApp = () => {
  const [blockchain] = useState(() => new GovernanceBlockchain());
  const [selectedView, setSelectedView] = useState('education');
  const [selectedOffice, setSelectedOffice] = useState('Governor');
  const [simulationSpeed, setSimulationSpeed] = useState(1000);
  const [autoSimulate, setAutoSimulate] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [educationSection, setEducationSection] = useState('overview');
  const [rcvExample, setRcvExample] = useState({
    round: 0,
    ballots: [
      { id: 1, preferences: ['A', 'B', 'C'] },
      { id: 2, preferences: ['B', 'A', 'C'] },
      { id: 3, preferences: ['C', 'B', 'A'] },
      { id: 4, preferences: ['A', 'C', 'B'] },
      { id: 5, preferences: ['B', 'C', 'A'] },
    ]
  });
  const [voterData, setVoterData] = useState({
    id: 'voter_' + Math.random().toString(36).substr(2, 9),
    publicKey: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
  });

  const forceUpdate = () => setUpdateTrigger(prev => prev + 1);

  // Simulation effect
  useEffect(() => {
    if (!autoSimulate) return;

    // Stop simulation if election is active
    const election = blockchain.activeElections[selectedOffice];
    if (election) {
      setAutoSimulate(false);
      return;
    }

    const interval = setInterval(() => {
      const currentMetrics = blockchain.performanceMetrics[selectedOffice]?.current;
      if (!currentMetrics) return;

      // Check again before updating to prevent race condition
      const activeElection = blockchain.activeElections[selectedOffice];
      if (activeElection) {
        setAutoSimulate(false);
        return;
      }

      // Simulate metric changes
      const newMetrics = {
        gdp: Math.max(85, Math.min(115, currentMetrics.gdp + (Math.random() - 0.5) * 3)),
        educationRanking: Math.max(5, Math.min(50, currentMetrics.educationRanking + Math.floor((Math.random() - 0.5) * 4))),
        approvalRating: Math.max(25, Math.min(85, currentMetrics.approvalRating + (Math.random() - 0.5) * 8)),
        unemploymentRate: Math.max(2, Math.min(10, currentMetrics.unemploymentRate + (Math.random() - 0.5) * 0.5)),
        infrastructureScore: Math.max(60, Math.min(95, currentMetrics.infrastructureScore + (Math.random() - 0.5) * 4))
      };

      blockchain.updateMetrics(selectedOffice, newMetrics);
      setLastUpdateTime(Date.now());
      forceUpdate();
    }, simulationSpeed);

    return () => clearInterval(interval);
  }, [autoSimulate, simulationSpeed, selectedOffice, blockchain]);

  // Auto-redirect to voting tab when election starts
  useEffect(() => {
    const election = blockchain.activeElections[selectedOffice];
    if (election) {
      const timer = setTimeout(() => {
        setSelectedView('voting-explorer');
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [blockchain.activeElections[selectedOffice], selectedOffice]);

  const handleVote = () => {
    const election = blockchain.activeElections[selectedOffice];
    if (!election || election.phase !== 'voting') return;

    // Simulate ranked choice voting
    const candidates = election.candidates.map(c => c.candidateId);
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    
    const signature = '0x' + Array(128).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    blockchain.castRankedVote(
      selectedOffice,
      voterData.id,
      voterData.publicKey,
      shuffled,
      signature
    );

    forceUpdate();
  };

  const advanceElectionPhase = () => {
    const election = blockchain.activeElections[selectedOffice];
    if (!election) return;

    if (election.phase === 'candidate_registration') {
      // Add some candidates
      ['Alice Johnson', 'Marcus Rodriguez', 'Emily Zhang'].forEach((name, i) => {
        blockchain.registerCandidate(election.id, selectedOffice, {
          id: `candidate_${i}`,
          name,
          publicKey: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
          platform: 'Reform and Innovation'
        });
      });
      election.phase = 'voting';
    } else if (election.phase === 'voting') {
      // Simulate some votes
      for (let i = 0; i < 25; i++) {
        const candidates = election.candidates.map(c => c.candidateId);
        const shuffled = [...candidates].sort(() => Math.random() - 0.5);
        blockchain.castRankedVote(
          selectedOffice,
          `voter_${i}`,
          '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
          shuffled,
          '0x' + Array(128).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
        );
      }
      election.phase = 'tallying';
      // Immediately conclude the election after tallying starts
      blockchain.concludeElection(selectedOffice);
    }

    forceUpdate();
  };

  const simulateRCVRound = () => {
    const candidates = ['A', 'B', 'C'];
    const voteCounts = { A: 0, B: 0, C: 0 };
    
    rcvExample.ballots.forEach(ballot => {
      const firstChoice = ballot.preferences[rcvExample.round];
      if (firstChoice && candidates.includes(firstChoice)) {
        voteCounts[firstChoice]++;
      }
    });

    const loser = Object.entries(voteCounts)
      .sort((a, b) => a[1] - b[1])[0][0];

    setRcvExample({
      ...rcvExample,
      round: rcvExample.round + 1,
      eliminated: loser,
      voteCounts
    });
  };

  const resetRCVExample = () => {
    setRcvExample({
      round: 0,
      ballots: [
        { id: 1, preferences: ['A', 'B', 'C'] },
        { id: 2, preferences: ['B', 'A', 'C'] },
        { id: 3, preferences: ['C', 'B', 'A'] },
        { id: 4, preferences: ['A', 'C', 'B'] },
        { id: 5, preferences: ['B', 'C', 'A'] },
      ]
    });
  };

  const metrics = blockchain.performanceMetrics[selectedOffice]?.current || {};
  const holder = blockchain.currentOfficeHolders[selectedOffice];
  const election = blockchain.activeElections[selectedOffice];
  const triggers = election?.triggers || blockchain.evaluateGovernanceTriggers(selectedOffice) || [];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%)',
      color: '#e8eaed',
      fontFamily: '"IBM Plex Mono", "Courier New", monospace',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background grid */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridMove 20s linear infinite',
        pointerEvents: 'none'
      }} />

      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
        .metric-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          padding: 20px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          animation: slideIn 0.5s ease;
        }
        .metric-card:hover {
          border-color: rgba(59, 130, 246, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1);
        }
        .blockchain-block {
          background: linear-gradient(135deg, rgba(20, 30, 50, 0.8), rgba(30, 40, 60, 0.8));
          border-left: 3px solid #3b82f6;
          padding: 16px;
          margin: 12px 0;
          border-radius: 4px;
          font-size: 13px;
          backdrop-filter: blur(10px);
          animation: slideIn 0.4s ease;
        }
        .vote-button {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-family: inherit;
          font-weight: 600;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 12px;
        }
        .vote-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
        }
        .vote-button:disabled {
          background: linear-gradient(135deg, #4b5563, #374151);
          cursor: not-allowed;
          transform: none;
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <Lock size={32} color="#3b82f6" />
            <h1 style={{ 
              margin: 0, 
              fontSize: '42px', 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px'
            }}>
              AUTONOMOUS GOVERNANCE CHAIN
            </h1>
          </div>
          <p style={{ 
            margin: 0, 
            color: '#94a3b8', 
            fontSize: '14px',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            Blockchain-Verified • Ranked Choice Voting • Performance-Triggered Elections
          </p>
        </div>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '32px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {['education', 'live-demo', 'voting-explorer', 'faq'].map(view => (
            <button
              key={view}
              onClick={() => setSelectedView(view)}
              style={{
                padding: '10px 20px',
                background: selectedView === view 
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                  : 'rgba(30, 41, 59, 0.5)',
                border: '1px solid ' + (selectedView === view ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)'),
                color: selectedView === view ? 'white' : '#94a3b8',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'all 0.3s ease'
              }}
            >
              {view === 'education' ? 'Education' : 
               view === 'live-demo' ? 'Live Demo' : 
               view === 'voting-explorer' ? 'Voting & Blockchain' :
               'FAQ'}
            </button>
          ))}
        </div>

        {/* Education View */}
        {selectedView === 'education' && (
          <div>
            {/* Section Navigation */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              marginBottom: '32px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {[
                { id: 'overview', label: 'System Overview' },
                { id: 'rcv', label: 'Ranked Choice Voting' },
                { id: 'blockchain', label: 'Blockchain Architecture' },
                { id: 'data', label: 'On-Chain Data' },
                { id: 'triggers', label: 'Autonomous Triggers' }
              ].map(section => (
                <button
                  key={section.id}
                  onClick={() => setEducationSection(section.id)}
                  style={{
                    padding: '8px 16px',
                    background: educationSection === section.id 
                      ? 'rgba(139, 92, 246, 0.3)' 
                      : 'rgba(30, 41, 59, 0.3)',
                    border: '1px solid ' + (educationSection === section.id ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)'),
                    color: educationSection === section.id ? '#a78bfa' : '#64748b',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '11px',
                    fontWeight: 500,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* Overview Section */}
            {educationSection === 'overview' && (
              <div>
                <h2 style={{ 
                  fontSize: '28px', 
                  marginBottom: '24px',
                  color: '#3b82f6',
                  fontWeight: 700,
                  letterSpacing: '-0.5px'
                }}>
                  Blockchain-Based Governance System
                </h2>

                <div className="metric-card" style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#e8eaed' }}>
                    This system demonstrates how blockchain technology can create a transparent, tamper-proof, 
                    and autonomous democratic governance framework. Unlike traditional voting systems that rely 
                    on centralized authorities and paper trails, this approach uses cryptographic proofs and 
                    distributed consensus to ensure election integrity.
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#8b5cf6' }}>
                  Core Principles
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                  <div className="metric-card" style={{ borderLeft: '3px solid #3b82f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <Lock size={24} color="#3b82f6" />
                      <div style={{ fontSize: '16px', fontWeight: 600 }}>Immutability</div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                      Once a vote is recorded on the blockchain, it cannot be altered or deleted. Each block 
                      contains a cryptographic hash of the previous block, creating an unbreakable chain of 
                      records that would require rewriting the entire history to tamper with.
                    </div>
                  </div>

                  <div className="metric-card" style={{ borderLeft: '3px solid #22c55e' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <CheckCircle size={24} color="#22c55e" />
                      <div style={{ fontSize: '16px', fontWeight: 600 }}>Verifiability</div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                      Every voter receives a cryptographic receipt (vote hash) that proves their vote was 
                      recorded, while digital signatures ensure that only authorized voters can cast ballots. 
                      Anyone can audit the blockchain to verify the election results.
                    </div>
                  </div>

                  <div className="metric-card" style={{ borderLeft: '3px solid #f59e0b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <Activity size={24} color="#f59e0b" />
                      <div style={{ fontSize: '16px', fontWeight: 600 }}>Autonomy</div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                      Smart contracts automatically trigger elections when performance metrics fall below 
                      thresholds or terms expire. No human intervention or partisan manipulation can delay 
                      or prevent accountability mechanisms from activating.
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#8b5cf6' }}>
                  System Architecture
                </h3>

                <div className="metric-card">
                  <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <strong style={{ color: '#3b82f6', fontSize: '14px' }}>1. Voter Registration & Identity</strong><br/>
                      Each voter is issued a unique cryptographic key pair (public and private keys). The public 
                      key serves as their identity on the blockchain, while the private key signs their ballot to 
                      prove authenticity without revealing their identity.
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <strong style={{ color: '#3b82f6', fontSize: '14px' }}>2. Ballot Casting</strong><br/>
                      Voters rank candidates in order of preference. The ballot is digitally signed with the voter's 
                      private key, creating a unique signature that proves the vote came from an authorized voter 
                      without revealing which specific person cast it.
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <strong style={{ color: '#3b82f6', fontSize: '14px' }}>3. Blockchain Recording</strong><br/>
                      Each vote is hashed and recorded in a transaction block along with the signature and timestamp. 
                      The block is cryptographically linked to previous blocks, making it computationally impossible 
                      to alter past votes without detection.
                    </div>

                    <div>
                      <strong style={{ color: '#3b82f6', fontSize: '14px' }}>4. Transparent Tallying</strong><br/>
                      The ranked choice algorithm runs directly on the blockchain data, eliminating the need for 
                      trusted intermediaries. Anyone can verify the count by replaying the algorithm against the 
                      public blockchain ledger.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RCV Section */}
            {educationSection === 'rcv' && (
              <div>
                <h2 style={{ 
                  fontSize: '28px', 
                  marginBottom: '24px',
                  color: '#3b82f6',
                  fontWeight: 700,
                  letterSpacing: '-0.5px'
                }}>
                  Ranked Choice Voting Explained
                </h2>

                <div className="metric-card" style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#e8eaed' }}>
                    Ranked Choice Voting (RCV), also called instant runoff voting, allows voters to rank candidates 
                    in order of preference. This ensures that the winner has broad support and eliminates the "spoiler 
                    effect" where similar candidates split the vote.
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#8b5cf6' }}>
                  How It Works: Step by Step
                </h3>

                <div className="metric-card" style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ 
                        background: 'rgba(59, 130, 246, 0.2)', 
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        padding: '16px',
                        borderRadius: '6px',
                        marginBottom: '12px'
                      }}>
                        <strong style={{ color: '#3b82f6', fontSize: '14px' }}>Step 1: Voters Rank Candidates</strong>
                      </div>
                      Instead of selecting just one candidate, voters rank all candidates in order of preference 
                      (1st choice, 2nd choice, 3rd choice, etc.). You don't have to rank all candidates—you can 
                      rank as many or as few as you want.
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ 
                        background: 'rgba(59, 130, 246, 0.2)', 
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        padding: '16px',
                        borderRadius: '6px',
                        marginBottom: '12px'
                      }}>
                        <strong style={{ color: '#3b82f6', fontSize: '14px' }}>Step 2: Count First-Choice Votes</strong>
                      </div>
                      All ballots are examined, and each candidate receives one vote for every ballot that 
                      ranked them as the first choice. If any candidate has more than 50% of first-choice votes, 
                      they win immediately. If not, we proceed to Round 2.
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ 
                        background: 'rgba(59, 130, 246, 0.2)', 
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        padding: '16px',
                        borderRadius: '6px',
                        marginBottom: '12px'
                      }}>
                        <strong style={{ color: '#3b82f6', fontSize: '14px' }}>Step 3: Eliminate Last Place</strong>
                      </div>
                      The candidate with the fewest first-choice votes is eliminated from the race. Their votes 
                      aren't thrown away—instead, each ballot that ranked the eliminated candidate first now 
                      transfers to that voter's second choice.
                    </div>

                    <div>
                      <div style={{ 
                        background: 'rgba(59, 130, 246, 0.2)', 
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        padding: '16px',
                        borderRadius: '6px',
                        marginBottom: '12px'
                      }}>
                        <strong style={{ color: '#3b82f6', fontSize: '14px' }}>Step 4: Repeat Until Majority</strong>
                      </div>
                      We recount with the transferred votes. If someone now has more than 50%, they win. If not, 
                      we eliminate the new last-place candidate and transfer their votes. This continues until 
                      someone achieves a majority.
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#8b5cf6' }}>
                  Interactive Example
                </h3>

                <div className="metric-card" style={{ marginBottom: '24px' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
                      Sample Election: 5 Voters, 3 Candidates (A, B, C)
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                      Round {rcvExample.round + 1} {rcvExample.eliminated ? `(Candidate ${rcvExample.eliminated} eliminated)` : '(First Choice Count)'}
                    </div>
                  </div>

                  {/* Ballot Display */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    {rcvExample.ballots.map(ballot => (
                      <div key={ballot.id} style={{
                        background: 'rgba(0,0,0,0.3)',
                        padding: '12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                      }}>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>
                          Ballot #{ballot.id}
                        </div>
                        {ballot.preferences.map((pref, idx) => (
                          <div key={idx} style={{
                            fontSize: '12px',
                            padding: '4px 8px',
                            marginBottom: '4px',
                            background: idx === rcvExample.round 
                              ? 'rgba(59, 130, 246, 0.3)' 
                              : 'rgba(0,0,0,0.2)',
                            borderRadius: '4px',
                            color: idx === rcvExample.round ? '#60a5fa' : '#94a3b8'
                          }}>
                            {idx + 1}. Candidate {pref}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Vote Counts */}
                  {rcvExample.voteCounts && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: '#8b5cf6' }}>
                        Current Vote Count:
                      </div>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {Object.entries(rcvExample.voteCounts).map(([candidate, count]) => {
                          const total = Object.values(rcvExample.voteCounts).reduce((a, b) => a + b, 0);
                          const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                          const hasMajority = count > total / 2;
                          
                          return (
                            <div key={candidate} style={{
                              background: hasMajority 
                                ? 'rgba(34, 197, 94, 0.2)'
                                : 'rgba(0,0,0,0.3)',
                              border: '1px solid ' + (hasMajority ? '#22c55e' : 'rgba(59, 130, 246, 0.2)'),
                              padding: '12px 16px',
                              borderRadius: '6px',
                              flex: 1,
                              minWidth: '150px'
                            }}>
                              <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
                                Candidate {candidate}
                              </div>
                              <div style={{ fontSize: '13px', color: hasMajority ? '#22c55e' : '#64748b' }}>
                                {count} votes ({percentage}%)
                                {hasMajority && <span style={{ marginLeft: '8px' }}>✓ WINNER</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      className="vote-button"
                      onClick={simulateRCVRound}
                      disabled={rcvExample.round >= 2}
                    >
                      {rcvExample.round === 0 ? 'Count Votes' : 'Next Round'}
                    </button>
                    <button
                      className="vote-button"
                      onClick={resetRCVExample}
                      style={{ background: 'linear-gradient(135deg, #64748b, #475569)' }}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#8b5cf6' }}>
                  Why RCV for Blockchain Governance?
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div className="metric-card">
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#3b82f6' }}>
                      Majority Support Guaranteed
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                      The winner always has more than 50% support (when counting transferred votes). This ensures 
                      elected officials have genuine mandate rather than winning with 35% in a crowded field.
                    </div>
                  </div>

                  <div className="metric-card">
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#3b82f6' }}>
                      No Spoiler Effect
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                      Similar candidates don't split the vote. Voters can support their true favorite without 
                      "wasting" their vote, knowing it will transfer if their first choice is eliminated.
                    </div>
                  </div>

                  <div className="metric-card">
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#3b82f6' }}>
                      Transparent Algorithm
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
                      The RCV tabulation process is deterministic and verifiable. Running it on a blockchain means 
                      anyone can independently verify the results by processing the public vote data themselves.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Blockchain Architecture Section */}
            {educationSection === 'blockchain' && (
              <div>
                <h2 style={{ 
                  fontSize: '28px', 
                  marginBottom: '24px',
                  color: '#3b82f6',
                  fontWeight: 700,
                  letterSpacing: '-0.5px'
                }}>
                  Blockchain Architecture
                </h2>

                <div className="metric-card" style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#e8eaed' }}>
                    A blockchain is a distributed, immutable ledger that records transactions in chronologically 
                    linked blocks. Each block contains a cryptographic hash of the previous block, creating a 
                    tamper-evident chain where any attempt to alter past data would be immediately detectable.
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#8b5cf6' }}>
                  Block Structure
                </h3>

                <div className="metric-card" style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                    Each block in this governance blockchain contains:
                  </div>
                  
                  <div style={{ 
                    background: 'rgba(0,0,0,0.4)', 
                    padding: '20px',
                    borderRadius: '8px',
                    marginTop: '16px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.3)'
                  }}>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ color: '#8b5cf6' }}>Block</span> {'{'}<br/>
                      <span style={{ marginLeft: '20px', color: '#64748b' }}>// Unique identifier</span><br/>
                      <span style={{ marginLeft: '20px', color: '#3b82f6' }}>index:</span> <span style={{ color: '#f59e0b' }}>42</span>,<br/>
                      <br/>
                      <span style={{ marginLeft: '20px', color: '#64748b' }}>// When block was created</span><br/>
                      <span style={{ marginLeft: '20px', color: '#3b82f6' }}>timestamp:</span> <span style={{ color: '#22c55e' }}>"2025-01-15T10:30:00Z"</span>,<br/>
                      <br/>
                      <span style={{ marginLeft: '20px', color: '#64748b' }}>// Governance transactions</span><br/>
                      <span style={{ marginLeft: '20px', color: '#3b82f6' }}>transactions:</span> [<br/>
                      <span style={{ marginLeft: '40px' }}>{'{'}</span><br/>
                      <span style={{ marginLeft: '60px', color: '#3b82f6' }}>type:</span> <span style={{ color: '#22c55e' }}>"VOTE_CAST"</span>,<br/>
                      <span style={{ marginLeft: '60px', color: '#3b82f6' }}>voteHash:</span> <span style={{ color: '#22c55e' }}>"0x7a9f..."</span>,<br/>
                      <span style={{ marginLeft: '60px', color: '#3b82f6' }}>signature:</span> <span style={{ color: '#22c55e' }}>"0x3c2b..."</span><br/>
                      <span style={{ marginLeft: '40px' }}>{'}'}</span><br/>
                      <span style={{ marginLeft: '20px' }}>],</span><br/>
                      <br/>
                      <span style={{ marginLeft: '20px', color: '#64748b' }}>// Links to previous block</span><br/>
                      <span style={{ marginLeft: '20px', color: '#3b82f6' }}>previousHash:</span> <span style={{ color: '#22c55e' }}>"0x9d4e..."</span>,<br/>
                      <br/>
                      <span style={{ marginLeft: '20px', color: '#64748b' }}>// This block's unique fingerprint</span><br/>
                      <span style={{ marginLeft: '20px', color: '#3b82f6' }}>hash:</span> <span style={{ color: '#22c55e' }}>"0x2f8c..."</span><br/>
                      {'}'}
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#8b5cf6' }}>
                  Cryptographic Hashing
                </h3>

                <div className="metric-card" style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8', marginBottom: '16px' }}>
                    A <strong style={{ color: '#3b82f6' }}>hash function</strong> takes any input data and produces 
                    a fixed-size "fingerprint" (typically 256 bits). Even a tiny change to the input creates a 
                    completely different hash. This property makes tampering detectable.
                  </div>

                  <div style={{ 
                    background: 'rgba(139, 92, 246, 0.1)', 
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    padding: '16px',
                    borderRadius: '6px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '12px', marginBottom: '8px', color: '#a78bfa' }}>
                      Example: SHA-256 Hash
                    </div>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', marginBottom: '8px' }}>
                      Input: <span style={{ color: '#3b82f6' }}>"Vote for Candidate A"</span><br/>
                      Hash: <span style={{ color: '#22c55e' }}>0x7a9f3e2d1c4b8a6f5e3d2c1b9a8f7e6d...</span>
                    </div>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                      Input: <span style={{ color: '#3b82f6' }}>"Vote for Candidate B"</span> (only 1 letter changed!)<br/>
                      Hash: <span style={{ color: '#ef4444' }}>0x9c3b7f1e8d2a4c6b9e1f3d5a7c9b4e2f...</span> (completely different!)
                    </div>
                  </div>

                  <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                    Because each block contains the hash of the previous block, changing any historical block 
                    would require recalculating all subsequent block hashes—an computationally infeasible task 
                    in a distributed system where other nodes maintain copies of the correct chain.
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#8b5cf6' }}>
                  Digital Signatures
                </h3>

                <div className="metric-card">
                  <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8', marginBottom: '16px' }}>
                    Digital signatures use <strong style={{ color: '#3b82f6' }}>public-key cryptography</strong> to 
                    verify that a vote came from an authorized voter without revealing their identity.
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      padding: '16px',
                      borderRadius: '6px'
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: '#3b82f6' }}>
                        1. Private Key (Secret)
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Only you know this. Used to "sign" your ballot by creating a unique signature that 
                        proves the vote is yours.
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      padding: '16px',
                      borderRadius: '6px'
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: '#22c55e' }}>
                        2. Public Key (Shared)
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Everyone can see this. Used to verify that a signature was created by the corresponding 
                        private key, without revealing what that private key is.
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      padding: '16px',
                      borderRadius: '6px'
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: '#f59e0b' }}>
                        3. Signature (Proof)
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Created by combining your private key with your ballot data. Proves the vote is authentic 
                        without revealing your identity.
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    background: 'rgba(0,0,0,0.3)', 
                    padding: '16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    lineHeight: '1.6'
                  }}>
                    <strong style={{ color: '#8b5cf6' }}>Privacy Protection:</strong> While the blockchain is public, 
                    your identity is not linked to your public key in the system. Observers can verify that valid 
                    voters cast ballots, but cannot determine which person cast which specific vote.
                  </div>
                </div>
              </div>
            )}

            {/* On-Chain Data Section */}
            {educationSection === 'data' && (
              <div>
                <h2 style={{ 
                  fontSize: '28px', 
                  marginBottom: '24px',
                  color: '#3b82f6',
                  fontWeight: 700,
                  letterSpacing: '-0.5px'
                }}>
                  On-Chain Governance Data
                </h2>

                <div className="metric-card" style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#e8eaed' }}>
                    One of the key innovations in this system is storing all governance metrics directly on the 
                    blockchain, eliminating the need for trusted third-party "oracles" to feed data into the system. 
                    This creates a fully self-contained, verifiable governance framework.
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#8b5cf6' }}>
                  The Oracle Problem
                </h3>

                <div className="metric-card" style={{ marginBottom: '24px', borderLeft: '3px solid #ef4444' }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                    <div style={{ marginBottom: '16px' }}>
                      Traditional blockchain systems face a fundamental challenge: <strong style={{ color: '#ef4444' }}>
                      blockchains cannot access external data on their own</strong>. If a smart contract needs to know 
                      the current GDP, unemployment rate, or approval rating, it must rely on external data providers 
                      called "oracles."
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <strong style={{ color: '#f59e0b' }}>The Problem:</strong> Oracles introduce centralization 
                      and trust assumptions. If the oracle is compromised, controlled by partisan interests, or simply 
                      provides inaccurate data, the entire governance system becomes vulnerable to manipulation.
                    </div>

                    <div style={{ 
                      background: 'rgba(239, 68, 68, 0.1)', 
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      padding: '12px',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}>
                      <strong>Example Attack:</strong> A malicious oracle could report falsely low GDP numbers to 
                      trigger an early election and remove an incumbent they oppose, even if the actual economy is 
                      performing well.
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#8b5cf6' }}>
                  Our Solution: Consensus-Based Data Updates
                </h3>

                <div className="metric-card" style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8', marginBottom: '16px' }}>
                    This system eliminates oracles by having governance metrics validated through blockchain consensus 
                    before being recorded on-chain. Here's how it works:
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ 
                      background: 'rgba(59, 130, 246, 0.2)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      padding: '14px',
                      borderRadius: '6px',
                      marginBottom: '12px'
                    }}>
                      <strong style={{ color: '#3b82f6', fontSize: '13px' }}>Step 1: Multiple Data Sources</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '16px', lineHeight: '1.6' }}>
                      Various authorized entities (government statistical agencies, independent auditors, economic 
                      research institutions) submit performance metrics to the blockchain. Each submission is 
                      digitally signed by the submitting organization.
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ 
                      background: 'rgba(59, 130, 246, 0.2)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      padding: '14px',
                      borderRadius: '6px',
                      marginBottom: '12px'
                    }}>
                      <strong style={{ color: '#3b82f6', fontSize: '13px' }}>Step 2: Consensus Verification</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '16px', lineHeight: '1.6' }}>
                      Network validators (distributed nodes running the blockchain software) verify that submitted 
                      metrics come from authorized sources and that multiple independent sources agree on the values. 
                      Outlier data is flagged and requires additional verification.
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ 
                      background: 'rgba(59, 130, 246, 0.2)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      padding: '14px',
                      borderRadius: '6px',
                      marginBottom: '12px'
                    }}>
                      <strong style={{ color: '#3b82f6', fontSize: '13px' }}>Step 3: On-Chain Recording</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '16px', lineHeight: '1.6' }}>
                      Once consensus is reached, the metrics are recorded in a blockchain transaction. The block 
                      includes cryptographic proofs from all validators who approved the data, creating an immutable 
                      audit trail.
                    </div>
                  </div>

                  <div>
                    <div style={{ 
                      background: 'rgba(59, 130, 246, 0.2)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      padding: '14px',
                      borderRadius: '6px',
                      marginBottom: '12px'
                    }}>
                      <strong style={{ color: '#3b82f6', fontSize: '13px' }}>Step 4: Automatic Trigger Evaluation</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '16px', lineHeight: '1.6' }}>
                      Smart contracts continuously monitor the on-chain metrics. When values cross predefined thresholds 
                      (e.g., approval &lt; 35%, GDP decline &gt; 10%), the contract autonomously initiates an election 
                      without requiring any external input or human intervention.
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#8b5cf6' }}>
                  Tracked Performance Metrics
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div className="metric-card" style={{ borderLeft: '3px solid #3b82f6' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                      GDP Index (Baseline: 100)
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
                      Tracks economic growth relative to the start of the term. Declines below 90 trigger critical 
                      alerts and may initiate early elections if sustained.
                    </div>
                  </div>

                  <div className="metric-card" style={{ borderLeft: '3px solid #22c55e' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                      Education Ranking
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
                      National ranking for education quality. Rankings below 15 are considered excellent; falling 
                      below 25 generates warning flags.
                    </div>
                  </div>

                  <div className="metric-card" style={{ borderLeft: '3px solid #f59e0b' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                      Approval Rating
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
                      Weighted average of citizen satisfaction surveys. Below 35% triggers automatic recall election 
                      proceedings as the official has lost public confidence.
                    </div>
                  </div>

                  <div className="metric-card" style={{ borderLeft: '3px solid #8b5cf6' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                      Unemployment Rate
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
                      Percentage of workforce without employment. Target is below 5%; exceeding 7.5% indicates economic 
                      management concerns.
                    </div>
                  </div>

                  <div className="metric-card" style={{ borderLeft: '3px solid #ec4899' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                      Infrastructure Score
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
                      Composite rating of roads, utilities, and public services. Scores above 70 indicate well-maintained 
                      infrastructure; below 60 suggests underinvestment.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Autonomous Triggers Section */}
            {educationSection === 'triggers' && (
              <div>
                <h2 style={{ 
                  fontSize: '28px', 
                  marginBottom: '24px',
                  color: '#3b82f6',
                  fontWeight: 700,
                  letterSpacing: '-0.5px'
                }}>
                  Autonomous Governance Triggers
                </h2>

                <div className="metric-card" style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#e8eaed' }}>
                    Smart contracts enable truly autonomous governance by automatically initiating elections when 
                    specific conditions are met—without requiring any human decision-making or intervention. This 
                    eliminates partisan delays and ensures consistent accountability.
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#8b5cf6' }}>
                  How Smart Contracts Work
                </h3>

                <div className="metric-card" style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8', marginBottom: '16px' }}>
                    A <strong style={{ color: '#3b82f6' }}>smart contract</strong> is self-executing code that runs 
                    on the blockchain. Unlike traditional contracts that require courts and lawyers to enforce, smart 
                    contracts automatically execute when their programmed conditions are met.
                  </div>

                  <div style={{ 
                    background: 'rgba(0,0,0,0.4)', 
                    padding: '16px',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    marginBottom: '16px'
                  }}>
                    <div style={{ color: '#64748b', marginBottom: '8px' }}>// Simplified governance smart contract</div>
                    <div style={{ marginBottom: '4px' }}>
                      <span style={{ color: '#8b5cf6' }}>function</span> <span style={{ color: '#3b82f6' }}>checkGovernanceTriggers</span>() {'{'}<br/>
                    </div>
                    <div style={{ marginLeft: '20px', marginBottom: '4px' }}>
                      <span style={{ color: '#8b5cf6' }}>if</span> (approvalRating {'<'} <span style={{ color: '#f59e0b' }}>35</span>) {'{'}<br/>
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '4px' }}>
                      initiateElection(<span style={{ color: '#22c55e' }}>"LOW_APPROVAL"</span>);<br/>
                    </div>
                    <div style={{ marginLeft: '20px', marginBottom: '4px' }}>
                      {'}'}<br/>
                    </div>
                    <div style={{ marginLeft: '20px', marginBottom: '4px' }}>
                      <span style={{ color: '#8b5cf6' }}>if</span> (gdpIndex {'<'} <span style={{ color: '#f59e0b' }}>90</span>) {'{'}<br/>
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '4px' }}>
                      initiateElection(<span style={{ color: '#22c55e' }}>"GDP_DECLINE"</span>);<br/>
                    </div>
                    <div style={{ marginLeft: '20px', marginBottom: '4px' }}>
                      {'}'}<br/>
                    </div>
                    <div style={{ marginLeft: '20px', marginBottom: '4px' }}>
                      <span style={{ color: '#8b5cf6' }}>if</span> (currentTime {'>'} termEndDate) {'{'}<br/>
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '4px' }}>
                      initiateElection(<span style={{ color: '#22c55e' }}>"TERM_COMPLETE"</span>);<br/>
                    </div>
                    <div style={{ marginLeft: '20px', marginBottom: '4px' }}>
                      {'}'}<br/>
                    </div>
                    <div>{'}'}</div>
                  </div>

                  <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                    This code runs automatically every time new performance data is recorded on the blockchain. 
                    No person needs to manually check metrics or decide whether conditions warrant an election—the 
                    smart contract enforces the rules impartially and transparently.
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#8b5cf6' }}>
                  Trigger Categories
                </h3>

                <div style={{ marginBottom: '24px' }}>
                  <div className="metric-card" style={{ borderLeft: '4px solid #ef4444', marginBottom: '16px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'start',
                      marginBottom: '12px'
                    }}>
                      <div style={{ fontSize: '16px', fontWeight: 700 }}>
                        Mandatory Triggers
                      </div>
                      <div style={{ 
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#ef4444'
                      }}>
                        MANDATORY
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '12px' }}>
                      These triggers <strong>immediately</strong> initiate an election with no option for delay or override.
                    </div>
                    <div style={{ 
                      background: 'rgba(0,0,0,0.3)', 
                      padding: '12px',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}>
                      <strong style={{ color: '#ef4444' }}>Term Completion:</strong> When the official's term expires 
                      (typically 4 years), a new election automatically begins. No extensions or delays are possible.
                    </div>
                  </div>

                  <div className="metric-card" style={{ borderLeft: '4px solid #f59e0b', marginBottom: '16px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'start',
                      marginBottom: '12px'
                    }}>
                      <div style={{ fontSize: '16px', fontWeight: 700 }}>
                        Critical Performance Triggers
                      </div>
                      <div style={{ 
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#ef4444'
                      }}>
                        CRITICAL
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '12px' }}>
                      Severe underperformance automatically triggers recall elections, allowing citizens to replace 
                      failing leadership before the term ends.
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ 
                        background: 'rgba(0,0,0,0.3)', 
                        padding: '12px',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}>
                        <strong style={{ color: '#f59e0b' }}>Approval Rating &lt; 35%:</strong> When citizen support 
                        falls below 35%, it indicates the official has lost the public's confidence and should face 
                        immediate accountability.
                      </div>
                      <div style={{ 
                        background: 'rgba(0,0,0,0.3)', 
                        padding: '12px',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}>
                        <strong style={{ color: '#f59e0b' }}>GDP Decline &gt; 10%:</strong> A 10% or greater decline 
                        in GDP represents severe economic mismanagement requiring immediate leadership change.
                      </div>
                    </div>
                  </div>

                  <div className="metric-card" style={{ borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'start',
                      marginBottom: '12px'
                    }}>
                      <div style={{ fontSize: '16px', fontWeight: 700 }}>
                        Warning Triggers
                      </div>
                      <div style={{ 
                        background: 'rgba(245, 158, 11, 0.2)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#f59e0b'
                      }}>
                        WARNING
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '12px' }}>
                      These metrics don't immediately trigger elections but are recorded on-chain as warning signals. 
                      Multiple sustained warnings may escalate to critical status.
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ 
                        background: 'rgba(0,0,0,0.3)', 
                        padding: '12px',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}>
                        <strong style={{ color: '#3b82f6' }}>Education Ranking &gt; 25:</strong> Falling education 
                        standards indicate policy problems but may not warrant immediate removal.
                      </div>
                      <div style={{ 
                        background: 'rgba(0,0,0,0.3)', 
                        padding: '12px',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}>
                        <strong style={{ color: '#3b82f6' }}>Unemployment &gt; 7.5%:</strong> High unemployment is 
                        concerning but may result from external factors beyond the official's control.
                      </div>
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#8b5cf6' }}>
                  Benefits of Autonomous Triggers
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div className="metric-card">
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#22c55e' }}>
                      Eliminates Partisan Delays
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
                      No ruling party can delay accountability votes or avoid elections when performance falters. 
                      The blockchain enforces rules impartially regardless of political considerations.
                    </div>
                  </div>

                  <div className="metric-card">
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#22c55e' }}>
                      Ensures Consistent Standards
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
                      Every official is held to the same performance thresholds. Popular incumbents face the same 
                      triggers as unpopular ones—the code doesn't play favorites.
                    </div>
                  </div>

                  <div className="metric-card">
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#22c55e' }}>
                      Creates Transparent Accountability
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
                      Citizens can see exactly which metrics triggered elections and verify that the smart contract 
                      executed correctly. No backroom deals or hidden decision-making.
                    </div>
                  </div>

                  <div className="metric-card">
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#22c55e' }}>
                      Prevents Authoritarianism
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
                      Officials cannot cancel elections or extend their terms indefinitely. The blockchain's 
                      immutable nature means even a compromised government cannot override governance rules.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Demo View - Combined Dashboard and Simulation */}
        {selectedView === 'live-demo' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px', alignItems: 'start' }}>
              {/* Main Dashboard Content */}
              <div>
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ 
                    fontSize: '24px', 
                    marginBottom: '24px',
                    color: '#3b82f6',
                    fontWeight: 600,
                    letterSpacing: '-0.5px'
                  }}>
                    CURRENT OFFICE HOLDER
                  </h2>
                  <div className="metric-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{holder?.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          Governor • Term: {new Date(holder?.termStart).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ 
                        background: 'rgba(34, 197, 94, 0.2)', 
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        color: '#22c55e',
                        fontWeight: 600,
                        border: '1px solid rgba(34, 197, 94, 0.3)'
                      }}>
                        IN OFFICE
                      </div>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      Public Key: {holder?.publicKey}
                    </div>
                  </div>
                </div>

                <h2 style={{ 
                  fontSize: '24px', 
                  marginBottom: '24px',
                  color: '#3b82f6',
                  fontWeight: 600,
                  letterSpacing: '-0.5px'
                }}>
                  ON-CHAIN PERFORMANCE METRICS
                </h2>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                  gap: '20px',
                  marginBottom: '32px'
                }}>
                  <div className="metric-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        GDP Index
                      </div>
                      <TrendingUp size={18} color={metrics.gdp >= 95 ? '#22c55e' : metrics.gdp < 90 ? '#ef4444' : '#f59e0b'} />
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>
                      {metrics.gdp?.toFixed(1)}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: metrics.gdp >= 95 ? '#22c55e' : metrics.gdp < 90 ? '#ef4444' : '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginBottom: '6px'
                    }}>
                      {metrics.gdp >= 95 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {metrics.gdp < 90 ? 'CRITICAL: Decline Trigger Active' : 'Baseline: 100'}
                    </div>
                    {blockchain.performanceMetrics[selectedOffice]?.baseline && (
                      <div style={{ fontSize: '10px', color: '#475569', marginTop: '4px' }}>
                        Term Start: {blockchain.performanceMetrics[selectedOffice].baseline.gdp.toFixed(1)} 
                        {' '}(Change: {(metrics.gdp - blockchain.performanceMetrics[selectedOffice].baseline.gdp).toFixed(1)})
                      </div>
                    )}
                  </div>

                  <div className="metric-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Education Ranking
                      </div>
                      <FileText size={18} color={metrics.educationRanking <= 15 ? '#22c55e' : metrics.educationRanking > 25 ? '#f59e0b' : '#3b82f6'} />
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>
                      #{metrics.educationRanking}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: metrics.educationRanking <= 15 ? '#22c55e' : '#f59e0b',
                      marginBottom: '6px'
                    }}>
                      {metrics.educationRanking > 25 ? 'WARNING: Declining' : 'Target: Top 15'}
                    </div>
                    {blockchain.performanceMetrics[selectedOffice]?.baseline && (
                      <div style={{ fontSize: '10px', color: '#475569', marginTop: '4px' }}>
                        Term Start: #{blockchain.performanceMetrics[selectedOffice].baseline.educationRanking} 
                        {' '}(Change: {metrics.educationRanking > blockchain.performanceMetrics[selectedOffice].baseline.educationRanking ? '+' : ''}{(metrics.educationRanking - blockchain.performanceMetrics[selectedOffice].baseline.educationRanking)})
                      </div>
                    )}
                  </div>

                  <div className="metric-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Approval Rating
                      </div>
                      <Users size={18} color={metrics.approvalRating >= 50 ? '#22c55e' : metrics.approvalRating < 35 ? '#ef4444' : '#f59e0b'} />
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>
                      {metrics.approvalRating?.toFixed(1)}%
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: metrics.approvalRating >= 50 ? '#22c55e' : metrics.approvalRating < 35 ? '#ef4444' : '#f59e0b',
                      marginBottom: '6px'
                    }}>
                      {metrics.approvalRating < 35 ? 'CRITICAL: Election Trigger Active' : 'Threshold: 35%'}
                    </div>
                    {blockchain.performanceMetrics[selectedOffice]?.baseline && (
                      <div style={{ fontSize: '10px', color: '#475569', marginTop: '4px' }}>
                        Term Start: {blockchain.performanceMetrics[selectedOffice].baseline.approvalRating.toFixed(1)}% 
                        {' '}(Change: {(metrics.approvalRating - blockchain.performanceMetrics[selectedOffice].baseline.approvalRating).toFixed(1)})
                      </div>
                    )}
                  </div>

                  <div className="metric-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Unemployment Rate
                      </div>
                      <Activity size={18} color={metrics.unemploymentRate <= 5 ? '#22c55e' : metrics.unemploymentRate > 7.5 ? '#f59e0b' : '#3b82f6'} />
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>
                      {metrics.unemploymentRate?.toFixed(1)}%
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: metrics.unemploymentRate <= 5 ? '#22c55e' : '#f59e0b',
                      marginBottom: '6px'
                    }}>
                      {metrics.unemploymentRate > 7.5 ? 'WARNING: Above Target' : 'Target: < 5%'}
                    </div>
                    {blockchain.performanceMetrics[selectedOffice]?.baseline && (
                      <div style={{ fontSize: '10px', color: '#475569', marginTop: '4px' }}>
                        Term Start: {blockchain.performanceMetrics[selectedOffice].baseline.unemploymentRate.toFixed(1)}% 
                        {' '}(Change: {(metrics.unemploymentRate - blockchain.performanceMetrics[selectedOffice].baseline.unemploymentRate).toFixed(1)})
                      </div>
                    )}
                  </div>

                  <div className="metric-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Infrastructure Score
                      </div>
                      <Award size={18} color={metrics.infrastructureScore >= 80 ? '#22c55e' : metrics.infrastructureScore < 65 ? '#ef4444' : '#3b82f6'} />
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>
                      {metrics.infrastructureScore?.toFixed(1)}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: metrics.infrastructureScore >= 80 ? '#22c55e' : metrics.infrastructureScore < 65 ? '#ef4444' : '#f59e0b',
                      marginBottom: '6px'
                    }}>
                      {metrics.infrastructureScore < 65 ? 'CRITICAL: Poor Condition' : metrics.infrastructureScore >= 80 ? 'Excellent' : 'Target: 80+'}
                    </div>
                    {blockchain.performanceMetrics[selectedOffice]?.baseline && (
                      <div style={{ fontSize: '10px', color: '#475569', marginTop: '4px' }}>
                        Term Start: {blockchain.performanceMetrics[selectedOffice].baseline.infrastructureScore.toFixed(1)} 
                        {' '}(Change: {(metrics.infrastructureScore - blockchain.performanceMetrics[selectedOffice].baseline.infrastructureScore).toFixed(1)})
                      </div>
                    )}
                  </div>
                </div>

                {/* Governance Triggers */}
                {triggers.length > 0 && (
                  <div style={{ marginTop: '32px' }}>
                    <h2 style={{ 
                      fontSize: '24px', 
                      marginBottom: '24px',
                      color: '#3b82f6',
                      fontWeight: 600,
                      letterSpacing: '-0.5px'
                    }}>
                      ACTIVE GOVERNANCE TRIGGERS
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {triggers.map((trigger, i) => (
                        <div key={i} className="metric-card" style={{ 
                          borderLeft: trigger.severity === 'critical' || trigger.severity === 'mandatory' ? '3px solid #ef4444' : '3px solid #f59e0b'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                                {trigger.type.replace(/_/g, ' ')}
                              </div>
                              {trigger.baseline !== undefined ? (
                                <div style={{ fontSize: '12px', color: '#64748b' }}>
                                  Baseline: {trigger.baseline.toFixed(1)} → Current: {trigger.value.toFixed(1)} 
                                  ({trigger.change > 0 ? '+' : ''}{trigger.change.toFixed(1)})
                                </div>
                              ) : trigger.threshold !== undefined ? (
                                <div style={{ fontSize: '12px', color: '#64748b' }}>
                                  Current: {trigger.value.toFixed(1)} | Threshold: {trigger.threshold}
                                </div>
                              ) : null}
                            </div>
                            <div style={{ 
                              padding: '6px 12px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              background: trigger.severity === 'critical' || trigger.severity === 'mandatory' 
                                ? 'rgba(239, 68, 68, 0.2)' 
                                : 'rgba(245, 158, 11, 0.2)',
                              color: trigger.severity === 'critical' || trigger.severity === 'mandatory' ? '#ef4444' : '#f59e0b',
                              border: '1px solid ' + (trigger.severity === 'critical' || trigger.severity === 'mandatory' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'),
                              textTransform: 'uppercase',
                              letterSpacing: '1px'
                            }}>
                              {trigger.severity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Election Notice */}
                {election && (
                  <div style={{ 
                    marginTop: '32px',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
                    border: '2px solid #8b5cf6',
                    borderRadius: '8px',
                    padding: '24px',
                    animation: 'glow 2s ease infinite'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <AlertCircle size={24} color="#8b5cf6" />
                      <div style={{ fontSize: '18px', fontWeight: 700 }}>
                        AUTONOMOUS ELECTION ACTIVATED
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
                      Smart contract has initiated an election for {election.office} based on performance triggers
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ fontSize: '12px', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px' }}>
                        Phase: <span style={{ color: '#8b5cf6', fontWeight: 600 }}>{election.phase.toUpperCase()}</span>
                      </div>
                      <div style={{ fontSize: '12px', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px' }}>
                        Candidates: <span style={{ color: '#8b5cf6', fontWeight: 600 }}>{election.candidates.length}</span>
                      </div>
                      <div style={{ fontSize: '12px', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px' }}>
                        Votes Cast: <span style={{ color: '#8b5cf6', fontWeight: 600 }}>{election.votes.length}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Simulation Control Panel */}
              <div style={{ position: 'sticky', top: '20px' }}>
                <div className="metric-card" style={{ 
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))',
                  border: '2px solid rgba(139, 92, 246, 0.3)'
                }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    marginBottom: '20px',
                    color: '#8b5cf6',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Activity size={20} />
                    SIMULATION CONTROLS
                  </h3>

                  {autoSimulate && !election && (
                    <div style={{
                      marginBottom: '20px',
                      padding: '12px',
                      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
                      border: '1px solid rgba(139, 92, 246, 0.5)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                          SIMULATION ACTIVE
                        </div>
                        <div style={{ fontSize: '13px', color: '#a78bfa', fontWeight: 600 }}>
                          Last Update: {new Date(lastUpdateTime).toLocaleTimeString()}
                        </div>
                      </div>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#22c55e',
                        animation: 'pulse 1.5s ease infinite'
                      }} />
                    </div>
                  )}

                  {!autoSimulate && election && (
                    <div style={{
                      marginBottom: '20px',
                      padding: '12px',
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(245, 158, 11, 0.2))',
                      border: '1px solid rgba(239, 68, 68, 0.5)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <AlertCircle size={20} color="#f59e0b" />
                      <div>
                        <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 600, marginBottom: '4px' }}>
                          SIMULATION PAUSED
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
                          {election.phase === 'candidate_registration' 
                            ? 'Election in progress - add candidates to continue'
                            : election.phase === 'voting'
                            ? 'Voting in progress - complete election to resume'
                            : 'Tallying votes - view results in Voting & Blockchain tab'}
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      fontSize: '13px',
                      cursor: election ? 'not-allowed' : 'pointer',
                      padding: '12px',
                      background: autoSimulate ? 'rgba(139, 92, 246, 0.2)' : 'rgba(0,0,0,0.2)',
                      borderRadius: '6px',
                      border: '1px solid ' + (autoSimulate ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.2)'),
                      transition: 'all 0.3s ease',
                      opacity: election ? 0.5 : 1
                    }}>
                      <input
                        type="checkbox"
                        checked={autoSimulate}
                        onChange={(e) => setAutoSimulate(e.target.checked)}
                        disabled={!!election}
                        style={{ width: '18px', height: '18px', cursor: election ? 'not-allowed' : 'pointer' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: autoSimulate ? '#a78bfa' : '#e8eaed' }}>
                          Auto-Simulate Metrics
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                          {election ? 'Disabled during active elections' : 'Metrics update automatically'}
                        </div>
                      </div>
                    </label>
                  </div>

                  {autoSimulate && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>
                        Update Speed
                      </div>
                      <input
                        type="range"
                        min="500"
                        max="3000"
                        step="100"
                        value={simulationSpeed}
                        onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                        style={{ 
                          width: '100%',
                          accentColor: '#8b5cf6'
                        }}
                      />
                      <div style={{ 
                        fontSize: '11px', 
                        color: '#8b5cf6',
                        textAlign: 'center',
                        marginTop: '8px'
                      }}>
                        {simulationSpeed < 1000 ? 'Fast' : simulationSpeed < 2000 ? 'Medium' : 'Slow'} ({simulationSpeed}ms)
                      </div>
                    </div>
                  )}

                  <div style={{ 
                    borderTop: '1px solid rgba(139, 92, 246, 0.2)',
                    paddingTop: '20px',
                    marginBottom: '20px'
                  }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', fontWeight: 600 }}>
                      Policy Decisions
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '16px', lineHeight: '1.5' }}>
                      Make policy choices that affect metrics over time. Watch how decisions cascade through the economy!
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button
                        className="vote-button"
                        onClick={() => {
                          // Cut education funding - improves GDP short term but hurts education ranking
                          blockchain.updateMetrics(selectedOffice, {
                            ...metrics,
                            gdp: Math.min(115, metrics.gdp + 2),
                            educationRanking: Math.min(50, metrics.educationRanking + 3),
                            approvalRating: metrics.approvalRating - 3
                          });
                          forceUpdate();
                        }}
                        style={{ 
                          width: '100%',
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          fontSize: '10px',
                          padding: '10px',
                          lineHeight: '1.4'
                        }}
                      >
                        📚 Cut Education Budget<br/>
                        <span style={{ fontSize: '9px', opacity: 0.8 }}>+GDP, -Education, -Approval</span>
                      </button>
                      
                      <button
                        className="vote-button"
                        onClick={() => {
                          // Slash environmental regulations - boosts GDP and employment but unpopular
                          blockchain.updateMetrics(selectedOffice, {
                            ...metrics,
                            gdp: Math.min(115, metrics.gdp + 3),
                            unemploymentRate: Math.max(2, metrics.unemploymentRate - 0.4),
                            infrastructureScore: Math.max(60, metrics.infrastructureScore - 2),
                            approvalRating: metrics.approvalRating - 5
                          });
                          forceUpdate();
                        }}
                        style={{ 
                          width: '100%',
                          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                          fontSize: '10px',
                          padding: '10px',
                          lineHeight: '1.4'
                        }}
                      >
                        🏭 Relax Environmental Rules<br/>
                        <span style={{ fontSize: '9px', opacity: 0.8 }}>+GDP, -Infrastructure, -Approval</span>
                      </button>

                      <button
                        className="vote-button"
                        onClick={() => {
                          // Create government jobs program - reduces unemployment but costs GDP
                          blockchain.updateMetrics(selectedOffice, {
                            ...metrics,
                            gdp: Math.max(85, metrics.gdp - 2),
                            unemploymentRate: Math.max(2, metrics.unemploymentRate - 0.6),
                            approvalRating: Math.min(85, metrics.approvalRating + 4)
                          });
                          forceUpdate();
                        }}
                        style={{ 
                          width: '100%',
                          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                          fontSize: '10px',
                          padding: '10px',
                          lineHeight: '1.4'
                        }}
                      >
                        👷 Launch Jobs Program<br/>
                        <span style={{ fontSize: '9px', opacity: 0.8 }}>-GDP, --Unemployment, +Approval</span>
                      </button>

                      <button
                        className="vote-button"
                        onClick={() => {
                          // Austerity measures - improves GDP but hurts employment and approval
                          blockchain.updateMetrics(selectedOffice, {
                            ...metrics,
                            gdp: Math.min(115, metrics.gdp + 2.5),
                            unemploymentRate: Math.min(10, metrics.unemploymentRate + 0.5),
                            approvalRating: metrics.approvalRating - 6,
                            infrastructureScore: Math.max(60, metrics.infrastructureScore - 1)
                          });
                          forceUpdate();
                        }}
                        style={{ 
                          width: '100%',
                          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                          fontSize: '10px',
                          padding: '10px',
                          lineHeight: '1.4'
                        }}
                      >
                        💰 Implement Austerity<br/>
                        <span style={{ fontSize: '9px', opacity: 0.8 }}>+GDP, +Unemployment, --Approval</span>
                      </button>

                      <button
                        className="vote-button"
                        onClick={() => {
                          // Massive infrastructure investment - long term gains but short term GDP hit
                          blockchain.updateMetrics(selectedOffice, {
                            ...metrics,
                            gdp: Math.max(85, metrics.gdp - 1.5),
                            infrastructureScore: Math.min(95, metrics.infrastructureScore + 3),
                            unemploymentRate: Math.max(2, metrics.unemploymentRate - 0.3),
                            approvalRating: Math.min(85, metrics.approvalRating + 2)
                          });
                          forceUpdate();
                        }}
                        style={{ 
                          width: '100%',
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          fontSize: '10px',
                          padding: '10px',
                          lineHeight: '1.4'
                        }}
                      >
                        🏗️ Invest in Infrastructure<br/>
                        <span style={{ fontSize: '9px', opacity: 0.8 }}>-GDP, +Infrastructure, +Approval</span>
                      </button>

                      <button
                        className="vote-button"
                        onClick={() => {
                          // Tax cuts for wealthy - GDP boost but increases inequality and unpopular
                          blockchain.updateMetrics(selectedOffice, {
                            ...metrics,
                            gdp: Math.min(115, metrics.gdp + 2.5),
                            approvalRating: metrics.approvalRating - 7,
                            unemploymentRate: Math.max(2, metrics.unemploymentRate - 0.2)
                          });
                          forceUpdate();
                        }}
                        style={{ 
                          width: '100%',
                          background: 'linear-gradient(135deg, #ec4899, #db2777)',
                          fontSize: '10px',
                          padding: '10px',
                          lineHeight: '1.4'
                        }}
                      >
                        💸 Cut Taxes for Wealthy<br/>
                        <span style={{ fontSize: '9px', opacity: 0.8 }}>+GDP, --Approval</span>
                      </button>

                      <button
                        className="vote-button"
                        onClick={() => {
                          // Universal healthcare - expensive but popular and improves education indirectly
                          blockchain.updateMetrics(selectedOffice, {
                            ...metrics,
                            gdp: Math.max(85, metrics.gdp - 2),
                            approvalRating: Math.min(85, metrics.approvalRating + 6),
                            educationRanking: Math.max(5, metrics.educationRanking - 1)
                          });
                          forceUpdate();
                        }}
                        style={{ 
                          width: '100%',
                          background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                          fontSize: '10px',
                          padding: '10px',
                          lineHeight: '1.4'
                        }}
                      >
                        🏥 Expand Healthcare<br/>
                        <span style={{ fontSize: '9px', opacity: 0.8 }}>-GDP, ++Approval, +Education</span>
                      </button>
                    </div>
                  </div>

                  <div style={{ 
                    marginTop: '20px',
                    padding: '12px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: '#94a3b8',
                    lineHeight: '1.5'
                  }}>
                    💡 Tip: Enable auto-simulation and watch how performance changes trigger autonomous elections!
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Voting & Blockchain Explorer - Combined View */}
        {selectedView === 'voting-explorer' && (
          <div>
            {/* Election Control Panel - Show prominently when election is active */}
            {election && (
              <div style={{ 
                marginBottom: '32px',
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
                border: '2px solid #8b5cf6',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Activity size={24} color="#8b5cf6" />
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#a78bfa' }}>
                      Election Control Panel
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                      Manage the election lifecycle
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ 
                    flex: 1,
                    minWidth: '200px',
                    padding: '12px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '6px'
                  }}>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                      Current Phase
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#8b5cf6', textTransform: 'uppercase' }}>
                      {election.phase.replace(/_/g, ' ')}
                    </div>
                  </div>
                  
                  <div style={{ 
                    flex: 1,
                    minWidth: '200px',
                    padding: '12px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '6px'
                  }}>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                      Status
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: election.status === 'completed' ? '#22c55e' : '#f59e0b' }}>
                      {election.status.toUpperCase()}
                    </div>
                  </div>

                  <button
                    className="vote-button"
                    onClick={advanceElectionPhase}
                    disabled={election.status === 'completed'}
                    style={{ 
                      padding: '14px 28px',
                      minWidth: '200px'
                    }}
                  >
                    {election.phase === 'candidate_registration' ? '➡️ Add Candidates & Start Voting' :
                     election.phase === 'voting' ? '🗳️ Simulate Votes & Conclude' :
                     '✓ Election Complete'}
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
              {/* Voting Section */}
              <div>
                <h2 style={{ 
                  fontSize: '24px', 
                  marginBottom: '24px',
                  color: '#3b82f6',
                  fontWeight: 600,
                  letterSpacing: '-0.5px'
                }}>
                  RANKED CHOICE VOTING
                </h2>

                {!election && (!blockchain.completedElections[selectedOffice] || blockchain.completedElections[selectedOffice].length === 0) ? (
                  <div className="metric-card" style={{ textAlign: 'center', padding: '48px' }}>
                    <CheckCircle size={48} color="#22c55e" style={{ margin: '0 auto 16px' }} />
                    <div style={{ fontSize: '18px', marginBottom: '8px' }}>No Elections Yet</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      Elections are automatically triggered by smart contracts based on performance metrics
                    </div>
                  </div>
                ) : election ? (
                  <div>
                    <div className="metric-card" style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                        Election for {election.office}
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
                        This election was autonomously triggered by the blockchain's smart contracts. All votes 
                        are cryptographically signed and recorded immutably on-chain. The ranked choice voting 
                        system ensures the winner has majority support.
                      </div>
                    </div>

                    {/* Candidates */}
                    {election.candidates.length > 0 && (
                      <div>
                        <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#8b5cf6' }}>
                          Registered Candidates
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {election.candidates.map((candidate, i) => (
                            <div key={i} className="metric-card">
                              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                                {candidate.name}
                              </div>
                              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>
                                {candidate.platform}
                              </div>
                              <div style={{ fontSize: '10px', color: '#475569', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                {candidate.publicKey.substring(0, 32)}...
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Results */}
                    {election.status === 'completed' && election.results && (
                      <div style={{ marginTop: '24px' }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#22c55e' }}>
                          Election Results
                        </h3>
                        <div className="metric-card" style={{ borderLeft: '3px solid #22c55e' }}>
                          <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
                            Winner: {election.candidates.find(c => c.candidateId === election.results.winner)?.name}
                          </div>
                          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                            Total Ballots: {election.results.totalBallots} | Rounds: {election.results.rounds.length}
                          </div>
                          
                          <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', color: '#8b5cf6' }}>
                            Ranked Choice Tabulation:
                          </div>
                          {election.results.rounds.map((round, i) => (
                            <div key={i} style={{ 
                              marginBottom: '12px', 
                              padding: '12px', 
                              background: 'rgba(0,0,0,0.2)',
                              borderRadius: '4px'
                            }}>
                              <div style={{ fontSize: '11px', marginBottom: '8px', color: '#64748b' }}>
                                Round {i + 1}:
                              </div>
                              {Object.entries(round.voteCounts).map(([candidateId, count]) => {
                                const candidate = election.candidates.find(c => c.candidateId === candidateId);
                                const percentage = ((count / round.totalVotes) * 100).toFixed(1);
                                return (
                                  <div key={candidateId} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    fontSize: '11px',
                                    marginBottom: '4px'
                                  }}>
                                    <span>{candidate?.name}</span>
                                    <span style={{ color: '#3b82f6' }}>{count} votes ({percentage}%)</span>
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Show most recent completed election
                  <div>
                    <div className="metric-card" style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                        Most Recent Election - {selectedOffice}
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
                        Viewing the results of the last completed election. The elected official is now in office 
                        with reset approval ratings and new performance baselines.
                      </div>
                    </div>

                    {(() => {
                      const completedElection = blockchain.completedElections[selectedOffice]?.[0];
                      if (!completedElection) return null;
                      
                      return (
                        <>
                          {/* Candidates */}
                          {completedElection.candidates.length > 0 && (
                            <div style={{ marginBottom: '24px' }}>
                              <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#8b5cf6' }}>
                                Candidates
                              </h3>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {completedElection.candidates.map((candidate, i) => (
                                  <div key={i} className="metric-card">
                                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                                      {candidate.name}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>
                                      {candidate.platform}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#475569', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                      {candidate.publicKey.substring(0, 32)}...
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Results */}
                          {completedElection.results && (
                            <div>
                              <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#22c55e' }}>
                                Election Results
                              </h3>
                              <div className="metric-card" style={{ borderLeft: '3px solid #22c55e' }}>
                                <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
                                  Winner: {completedElection.candidates.find(c => c.candidateId === completedElection.results.winner)?.name}
                                </div>
                                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                                  Total Ballots: {completedElection.results.totalBallots} | Rounds: {completedElection.results.rounds.length}
                                  <br/>
                                  Completed: {new Date(completedElection.completedAt).toLocaleString()}
                                </div>
                                
                                <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', color: '#8b5cf6' }}>
                                  Ranked Choice Tabulation:
                                </div>
                                {completedElection.results.rounds.map((round, i) => (
                                  <div key={i} style={{ 
                                    marginBottom: '12px', 
                                    padding: '12px', 
                                    background: 'rgba(0,0,0,0.2)',
                                    borderRadius: '4px'
                                  }}>
                                    <div style={{ fontSize: '11px', marginBottom: '8px', color: '#64748b' }}>
                                      Round {i + 1}:
                                    </div>
                                    {Object.entries(round.voteCounts).map(([candidateId, count]) => {
                                      const candidate = completedElection.candidates.find(c => c.candidateId === candidateId);
                                      const percentage = ((count / round.totalVotes) * 100).toFixed(1);
                                      return (
                                        <div key={candidateId} style={{ 
                                          display: 'flex', 
                                          justifyContent: 'space-between',
                                          fontSize: '11px',
                                          marginBottom: '4px'
                                        }}>
                                          <span>{candidate?.name}</span>
                                          <span style={{ color: '#3b82f6' }}>{count} votes ({percentage}%)</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Blockchain Explorer Section */}
              <div>
                <h2 style={{ 
                  fontSize: '24px', 
                  marginBottom: '24px',
                  color: '#3b82f6',
                  fontWeight: 600,
                  letterSpacing: '-0.5px'
                }}>
                  BLOCKCHAIN EXPLORER
                </h2>

                <div style={{ marginBottom: '20px', fontSize: '13px', color: '#64748b' }}>
                  All governance transactions are recorded immutably. Total blocks: {blockchain.blocks.length}
                </div>

                <div style={{ maxHeight: '800px', overflowY: 'auto', paddingRight: '8px' }}>
                  {[...blockchain.blocks].reverse().slice(0, 10).map((block, i) => (
                    <div key={block.index} className="blockchain-block">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#3b82f6' }}>
                          Block #{block.index}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {new Date(block.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      
                      <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '8px', wordBreak: 'break-all' }}>
                        Hash: {block.hash.substring(0, 24)}...
                      </div>

                      <div style={{ borderTop: '1px solid rgba(59, 130, 246, 0.2)', paddingTop: '12px' }}>
                        {block.transactions.map((tx, j) => (
                          <div key={j} style={{ 
                            marginBottom: '8px', 
                            padding: '8px',
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '4px'
                          }}>
                            <div style={{ 
                              fontSize: '11px', 
                              fontWeight: 600, 
                              color: '#8b5cf6',
                              marginBottom: '6px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              {tx.type.replace(/_/g, ' ')}
                            </div>
                            <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                              {tx.type === 'VOTE_CAST' && (
                                <>
                                  Vote Hash: {tx.voteHash.substring(0, 16)}...<br />
                                  Verified: {tx.signatureVerified ? '✓' : '✗'}
                                </>
                              )}
                              {tx.type === 'METRICS_UPDATE' && (
                                <>
                                  Office: {tx.office}<br />
                                  GDP: {tx.metrics?.gdp?.toFixed(1)} | 
                                  Approval: {tx.metrics?.approvalRating?.toFixed(1)}%
                                </>
                              )}
                              {tx.type === 'ELECTION_INITIATED' && (
                                <>
                                  Office: {tx.office}<br />
                                  Triggers: {tx.triggers?.join(', ')}<br />
                                  Autonomous: {tx.autonomousActivation ? '✓' : '✗'}
                                </>
                              )}
                              {tx.type === 'ELECTION_CONCLUDED' && (
                                <>
                                  Winner: {tx.winner}<br />
                                  Votes: {tx.totalVotes} | Rounds: {tx.rounds}
                                </>
                              )}
                              {tx.type === 'CANDIDATE_REGISTERED' && (
                                <>
                                  {tx.candidate?.name}<br />
                                  Verified: {tx.blockchainVerified ? '✓' : '✗'}
                                </>
                              )}
                              {tx.type === 'OFFICE_INITIALIZATION' && (
                                <>
                                  Official: {tx.holder?.name}<br />
                                  Term: 4 years
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {blockchain.blocks.length > 10 && (
                  <div style={{ 
                    marginTop: '16px',
                    padding: '12px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: '#94a3b8',
                    textAlign: 'center'
                  }}>
                    Showing 10 most recent blocks of {blockchain.blocks.length} total
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FAQ View */}
        {selectedView === 'faq' && (
          <div>
            <h2 style={{ 
              fontSize: '28px', 
              marginBottom: '24px',
              color: '#3b82f6',
              fontWeight: 700,
              letterSpacing: '-0.5px'
            }}>
              Frequently Asked Questions
            </h2>

            <div style={{ marginBottom: '32px' }}>
              <div className="metric-card" style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.8' }}>
                This FAQ addresses critical questions about blockchain governance systems, including potential failure 
                points, security concerns, and practical implementation challenges. Understanding both the strengths 
                and limitations of this technology is essential for informed discussion.
              </div>
            </div>

            {/* Security & Attack Vectors */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ 
                fontSize: '22px', 
                marginBottom: '20px',
                color: '#8b5cf6',
                fontWeight: 600
              }}>
                Security & Attack Vectors
              </h3>

              <div className="metric-card" style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#e8eaed' }}>
                  What if someone hacks the blockchain?
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                  <strong style={{ color: '#3b82f6' }}>The Reality:</strong> Blockchains are designed to be 
                  extremely difficult to hack, but not impossible. A successful attack would require controlling 
                  51% or more of the network's computing power (a "51% attack").
                  <br/><br/>
                  <strong style={{ color: '#3b82f6' }}>For Small Networks:</strong> If only a few government 
                  servers run the blockchain, this is a real vulnerability. A determined attacker or authoritarian 
                  regime could potentially compromise the system.
                  <br/><br/>
                  <strong style={{ color: '#22c55e' }}>Mitigation:</strong> The network must be sufficiently 
                  distributed across independent validators (universities, NGOs, international observers, citizen 
                  nodes) to make coordination prohibitively difficult. Think thousands of independent validators, 
                  not dozens.
                </div>
              </div>

              <div className="metric-card" style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#e8eaed' }}>
                  Can't voters be coerced or bribed since votes are traceable via public keys?
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                  <strong style={{ color: '#ef4444' }}>Critical Vulnerability:</strong> Yes, this is a serious 
                  problem with blockchain voting. While your identity isn't directly linked to your public key, 
                  if someone knows your public key, they can verify how you voted by checking the blockchain.
                  <br/><br/>
                  <strong style={{ color: '#3b82f6' }}>The Coercion Scenario:</strong> An employer, family member, 
                  or criminal organization could demand to see your public key or force you to vote in front of 
                  them, then verify your vote on the public ledger.
                  <br/><br/>
                  <strong style={{ color: '#22c55e' }}>Advanced Solutions:</strong> Zero-knowledge proofs (ZKPs) 
                  allow you to prove you cast a valid vote without revealing which choice you made. The blockchain 
                  verifies the vote is legitimate but hides the actual selection. Systems like zk-SNARKs can provide 
                  this privacy while maintaining verifiability.
                </div>
              </div>

              <div className="metric-card" style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#e8eaed' }}>
                  What prevents a government from shutting down the blockchain?
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                  <strong style={{ color: '#f59e0b' }}>Honest Answer:</strong> If the blockchain only runs on 
                  servers within a single country, the government can absolutely shut it down by seizing servers, 
                  cutting internet access, or simply passing laws prohibiting its operation.
                  <br/><br/>
                  <strong style={{ color: '#22c55e' }}>Resilience Strategy:</strong> The blockchain must be 
                  internationally distributed with nodes in multiple jurisdictions. This is why cryptocurrency 
                  networks are hard to shut down—they have nodes in hundreds of countries. A government blockchain 
                  would need similar geographic distribution, perhaps managed by international bodies, allied 
                  democracies, and domestic institutions (universities, courts, independent agencies).
                </div>
              </div>
            </div>

            {/* Data Integrity & Metrics */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ 
                fontSize: '22px', 
                marginBottom: '20px',
                color: '#8b5cf6',
                fontWeight: 600
              }}>
                Data Integrity & Metrics
              </h3>

              <div className="metric-card" style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#e8eaed' }}>
                  How do we prevent governments from lying about GDP, unemployment, or other metrics?
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                  <strong style={{ color: '#ef4444' }}>The Challenge:</strong> This is one of the hardest problems. 
                  If the government controls the agencies that produce statistics, they can manipulate the data 
                  before it reaches the blockchain. "Garbage in, garbage out" applies here.
                  <br/><br/>
                  <strong style={{ color: '#3b82f6' }}>Multi-Source Validation:</strong> Require consensus from 
                  multiple independent sources:
                  <ul style={{ marginTop: '12px', paddingLeft: '20px', lineHeight: '1.6' }}>
                    <li>Government statistical agencies</li>
                    <li>Independent audit firms</li>
                    <li>International organizations (World Bank, IMF, UN)</li>
                    <li>Academic institutions</li>
                    <li>Private sector data providers</li>
                  </ul>
                  <br/>
                  <strong style={{ color: '#22c55e' }}>Cryptographic Attestation:</strong> Each source digitally 
                  signs their data submission. If 3 out of 5 sources agree, the data is accepted. Major discrepancies 
                  trigger public alerts and investigation requirements. This doesn't eliminate manipulation but makes 
                  it require coordinating multiple independent parties.
                </div>
              </div>

              <div className="metric-card" style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#e8eaed' }}>
                  What if the metrics themselves are poorly chosen or politically motivated?
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                  <strong style={{ color: '#f59e0b' }}>Valid Concern:</strong> Choosing metrics is inherently 
                  political. GDP doesn't measure happiness or inequality. Unemployment rates can be manipulated 
                  through definitions. Approval ratings can be biased by who conducts the polls.
                  <br/><br/>
                  <strong style={{ color: '#3b82f6' }}>Governance Solution:</strong> The metrics and thresholds 
                  should be embedded in a "constitutional smart contract" that requires supermajority approval 
                  (e.g., 2/3 vote) to modify. This prevents ruling parties from changing the rules to their 
                  advantage but allows evolution through broad consensus.
                  <br/><br/>
                  <strong style={{ color: '#22c55e' }}>Transparency:</strong> All metric methodologies must be 
                  public and auditable. Citizens can challenge the data through formal dispute mechanisms built 
                  into the smart contracts.
                </div>
              </div>

              <div className="metric-card" style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#e8eaed' }}>
                  Can metrics be gamed? What about "teaching to the test"?
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                  <strong style={{ color: '#ef4444' }}>Goodhart's Law:</strong> "When a measure becomes a target, 
                  it ceases to be a good measure." Governments will absolutely optimize for whatever metrics trigger 
                  elections, potentially at the expense of unmeasured but important outcomes.
                  <br/><br/>
                  <strong style={{ color: '#f59e0b' }}>Examples:</strong> 
                  <ul style={{ marginTop: '12px', paddingLeft: '20px', lineHeight: '1.6' }}>
                    <li>To boost GDP, slash environmental regulations and public health spending</li>
                    <li>To reduce unemployment, create meaningless government jobs</li>
                    <li>To improve education rankings, focus only on standardized test preparation</li>
                  </ul>
                  <br/>
                  <strong style={{ color: '#22c55e' }}>Partial Mitigation:</strong> Use composite metrics that 
                  are harder to game (HDI, genuine progress indicator) and include both short-term and long-term 
                  indicators. No perfect solution exists—this is a fundamental challenge in any performance-based 
                  accountability system.
                </div>
              </div>
            </div>

            {/* Practical Implementation */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ 
                fontSize: '22px', 
                marginBottom: '20px',
                color: '#8b5cf6',
                fontWeight: 600
              }}>
                Practical Implementation
              </h3>

              <div className="metric-card" style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#e8eaed' }}>
                  What about voters without internet access or technical literacy?
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                  <strong style={{ color: '#ef4444' }}>Digital Divide Problem:</strong> Blockchain voting 
                  exacerbates existing inequalities. Elderly citizens, rural communities, and economically 
                  disadvantaged populations may lack smartphones, internet access, or technical skills.
                  <br/><br/>
                  <strong style={{ color: '#3b82f6' }}>Hybrid Approach:</strong> Maintain physical polling 
                  stations with paper ballot backups that are then digitized and recorded on the blockchain 
                  by election officials. This preserves accessibility while gaining blockchain's auditability 
                  benefits for the overall tally.
                  <br/><br/>
                  <strong style={{ color: '#22c55e' }}>Public Infrastructure:</strong> Provide free public 
                  terminals (like libraries) where citizens can vote with assistance. Similar to how Estonia 
                  provides digital ID cards and support centers for their e-governance system.
                </div>
              </div>

              <div className="metric-card" style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#e8eaed' }}>
                  What happens if there's a bug in the smart contract code?
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                  <strong style={{ color: '#ef4444' }}>Historical Precedent:</strong> The DAO hack in Ethereum 
                  showed that smart contract bugs can have catastrophic consequences. $60 million was stolen due 
                  to a recursion vulnerability that developers missed.
                  <br/><br/>
                  <strong style={{ color: '#f59e0b' }}>Election Scenario:</strong> A bug could incorrectly tally 
                  votes, lock out legitimate voters, or allow double-voting. Since smart contracts are immutable, 
                  you can't just "patch" them like regular software.
                  <br/><br/>
                  <strong style={{ color: '#22c55e' }}>Risk Mitigation:</strong>
                  <ul style={{ marginTop: '12px', paddingLeft: '20px', lineHeight: '1.6' }}>
                    <li><strong>Extensive Testing:</strong> Formal verification (mathematical proofs of correctness), 
                    security audits by multiple independent firms, and bug bounty programs</li>
                    <li><strong>Upgrade Mechanisms:</strong> Build in governance processes to upgrade contracts 
                    with safeguards (time delays, multi-signature approval, public review periods)</li>
                    <li><strong>Emergency Pause:</strong> Include circuit breakers that can freeze the system 
                    if anomalies are detected, requiring multi-party approval to resume</li>
                  </ul>
                </div>
              </div>

              <div className="metric-card" style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#e8eaed' }}>
                  How much does this cost and who pays for it?
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                  <strong style={{ color: '#3b82f6' }}>Infrastructure Costs:</strong> Running a blockchain requires 
                  significant computational resources. Thousands of validator nodes, each needing servers, electricity, 
                  and maintenance. Estonia's e-governance system costs roughly €50-100 million annually.
                  <br/><br/>
                  <strong style={{ color: '#f59e0b' }}>Transaction Fees:</strong> Who pays for recording votes? 
                  In public blockchains like Ethereum, users pay "gas fees." For government voting, the state would 
                  likely subsidize these costs to ensure free access, but this creates a taxpayer burden.
                  <br/><br/>
                  <strong style={{ color: '#22c55e' }}>Cost-Benefit Analysis:</strong> Traditional elections are 
                  expensive too (poll workers, printed ballots, physical security). Blockchain could reduce some 
                  costs while adding others. Net savings are unclear and would depend on implementation scale 
                  and design choices.
                </div>
              </div>
            </div>

            {/* Governance & Politics */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ 
                fontSize: '22px', 
                marginBottom: '20px',
                color: '#8b5cf6',
                fontWeight: 600
              }}>
                Governance & Political Challenges
              </h3>

              <div className="metric-card" style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#e8eaed' }}>
                  Won't automated triggers create constant political chaos?
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                  <strong style={{ color: '#f59e0b' }}>The Instability Risk:</strong> If metrics are volatile or 
                  thresholds are too sensitive, you could trigger elections every few months. This prevents 
                  long-term planning and policy implementation.
                  <br/><br/>
                  <strong style={{ color: '#3b82f6' }}>Example:</strong> GDP naturally fluctuates with business 
                  cycles. A brief recession could trigger an election, but replacing leadership during economic 
                  downturns might make things worse, not better.
                  <br/><br/>
                  <strong style={{ color: '#22c55e' }}>Design Considerations:</strong>
                  <ul style={{ marginTop: '12px', paddingLeft: '20px', lineHeight: '1.6' }}>
                    <li><strong>Sustained Triggers:</strong> Require metrics to stay below thresholds for multiple 
                    consecutive periods (e.g., 3+ months) before triggering</li>
                    <li><strong>Cooldown Periods:</strong> Prevent more than one recall election per year</li>
                    <li><strong>Proportional Responses:</strong> Minor infractions could trigger public hearings 
                    or reform requirements rather than immediate elections</li>
                  </ul>
                </div>
              </div>

              <div className="metric-card" style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#e8eaed' }}>
                  Can authoritarian regimes use this technology to appear democratic?
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                  <strong style={{ color: '#ef4444' }}>Critical Warning:</strong> Yes, absolutely. Blockchain 
                  doesn't guarantee democracy—it's just a tool. Authoritarian governments could:
                  <ul style={{ marginTop: '12px', paddingLeft: '20px', lineHeight: '1.6' }}>
                    <li>Control all validator nodes themselves</li>
                    <li>Manipulate metrics before they reach the blockchain</li>
                    <li>Disqualify opposition candidates through bureaucratic means</li>
                    <li>Use "blockchain verification" as propaganda while maintaining control</li>
                  </ul>
                  <br/>
                  <strong style={{ color: '#22c55e' }}>The Real Requirements:</strong> Technology alone cannot 
                  create democracy. You also need: independent judiciary, free press, protection of opposition 
                  parties, civil society organizations, and genuine separation of powers. Blockchain can strengthen 
                  existing democratic institutions but cannot create them from nothing.
                </div>
              </div>

              <div className="metric-card" style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#e8eaed' }}>
                  Who decides the initial rules? Isn't this just moving power somewhere else?
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.8' }}>
                  <strong style={{ color: '#3b82f6' }}>The Bootstrap Problem:</strong> Someone has to write the 
                  initial smart contracts, choose the metrics, set the thresholds, and define the rules. This 
                  group has enormous power to shape the system.
                  <br/><br/>
                  <strong style={{ color: '#f59e0b' }}>Political Reality:</strong> The programmers who write the 
                  code become a powerful technocratic elite. If citizens don't understand the system, they can't 
                  effectively challenge it. This is "code is law" taken to its extreme.
                  <br/><br/>
                  <strong style={{ color: '#22c55e' }}>Democratic Legitimacy:</strong> The initial rules should 
                  come from a constitutional convention or referendum, not just be imposed by technical experts. 
                  The code must then be open-source, publicly audited, and amendable through democratic processes. 
                  Transparency is essential but not sufficient.
                </div>
              </div>
            </div>

            {/* Bottom Line */}
            <div className="metric-card" style={{ 
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
              border: '2px solid #8b5cf6'
            }}>
              <h3 style={{ 
                fontSize: '20px', 
                marginBottom: '16px',
                color: '#a78bfa',
                fontWeight: 700
              }}>
                The Bottom Line
              </h3>
              <div style={{ fontSize: '14px', color: '#e8eaed', lineHeight: '1.8' }}>
                Blockchain governance systems are not a silver bullet. They introduce new capabilities 
                (tamper-proof records, automated accountability, transparent auditing) but also new vulnerabilities 
                (technical complexity, digital divide, potential for sophisticated manipulation).
                <br/><br/>
                <strong style={{ color: '#3b82f6' }}>These systems work best as:</strong>
                <ul style={{ marginTop: '12px', paddingLeft: '20px', lineHeight: '1.6' }}>
                  <li>Complements to existing democratic institutions, not replacements</li>
                  <li>Tools for transparency and auditability in already-democratic societies</li>
                  <li>Checks on government power when combined with independent validators</li>
                  <li>Frameworks for gradual experimentation and iteration</li>
                </ul>
                <br/>
                <strong style={{ color: '#f59e0b' }}>They are dangerous when:</strong>
                <ul style={{ marginTop: '12px', paddingLeft: '20px', lineHeight: '1.6' }}>
                  <li>Implemented without adequate security auditing and testing</li>
                  <li>Used to bypass rather than strengthen democratic norms</li>
                  <li>Controlled by centralized authorities who manage all validators</li>
                  <li>Treated as sufficient for democracy without supporting institutions</li>
                </ul>
                <br/>
                Technology can enhance governance, but it cannot replace the hard work of maintaining 
                democratic culture, institutions, and civic engagement.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainGovernanceApp;