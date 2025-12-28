'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQView = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (sectionId) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  const faqSections = [
    {
      id: 'security',
      title: 'Security & Attack Vectors',
      color: 'purple',
      questions: [
        {
          id: 'security-1',
          question: 'What if someone hacks the blockchain?',
          answer: (
            <>
              <p className="mb-4">
                <strong className="text-blue-400">The Reality:</strong> Blockchains are designed to be
                extremely difficult to hack, but not impossible. A successful attack would require controlling
                51% or more of the network's computing power (a "51% attack").
              </p>
              <p className="mb-4">
                <strong className="text-blue-400">For Small Networks:</strong> If only a few government
                servers run the blockchain, this is a real vulnerability. A determined attacker or authoritarian
                regime could potentially compromise the system.
              </p>
              <p>
                <strong className="text-green-400">Mitigation:</strong> The network must be sufficiently
                distributed across independent validators (universities, NGOs, international observers, citizen
                nodes) to make coordination prohibitively difficult. Think thousands of independent validators,
                not dozens.
              </p>
            </>
          ),
        },
        {
          id: 'security-2',
          question: "Can't voters be coerced or bribed since votes are traceable via public keys?",
          answer: (
            <>
              <p className="mb-4">
                <strong className="text-red-400">Critical Vulnerability:</strong> Yes, this is a serious
                problem with blockchain voting. While your identity isn't directly linked to your public key,
                if someone knows your public key, they can verify how you voted by checking the blockchain.
              </p>
              <p className="mb-4">
                <strong className="text-blue-400">The Coercion Scenario:</strong> An employer, family member,
                or criminal organization could demand to see your public key or force you to vote in front of
                them, then verify your vote on the public ledger.
              </p>
              <p>
                <strong className="text-green-400">Advanced Solutions:</strong> Zero-knowledge proofs (ZKPs)
                allow you to prove you cast a valid vote without revealing which choice you made. The blockchain
                verifies the vote is legitimate but hides the actual selection. Systems like zk-SNARKs can provide
                this privacy while maintaining verifiability.
              </p>
            </>
          ),
        },
        {
          id: 'security-3',
          question: 'What prevents a government from shutting down the blockchain?',
          answer: (
            <>
              <p className="mb-4">
                <strong className="text-amber-400">Honest Answer:</strong> If the blockchain only runs on
                servers within a single country, the government can absolutely shut it down by seizing servers,
                cutting internet access, or simply passing laws prohibiting its operation.
              </p>
              <p>
                <strong className="text-green-400">Resilience Strategy:</strong> The blockchain must be
                internationally distributed with nodes in multiple jurisdictions. This is why cryptocurrency
                networks are hard to shut down—they have nodes in hundreds of countries. A government blockchain
                would need similar geographic distribution, perhaps managed by international bodies, allied
                democracies, and domestic institutions (universities, courts, independent agencies).
              </p>
            </>
          ),
        },
      ],
    },
    {
      id: 'data-integrity',
      title: 'Data Integrity & Metrics',
      color: 'purple',
      questions: [
        {
          id: 'data-1',
          question: 'How do we prevent governments from lying about GDP, unemployment, or other metrics?',
          answer: (
            <>
              <p className="mb-4">
                <strong className="text-red-400">The Challenge:</strong> This is one of the hardest problems.
                If the government controls the agencies that produce statistics, they can manipulate the data
                before it reaches the blockchain. "Garbage in, garbage out" applies here.
              </p>
              <div className="mb-4">
                <strong className="text-blue-400">Multi-Source Validation:</strong> Require consensus from
                multiple independent sources:
                <ul className="mt-3 ml-5 space-y-1 list-disc">
                  <li>Government statistical agencies</li>
                  <li>Independent audit firms</li>
                  <li>International organizations (World Bank, IMF, UN)</li>
                  <li>Academic institutions</li>
                  <li>Private sector data providers</li>
                </ul>
              </div>
              <p>
                <strong className="text-green-400">Cryptographic Attestation:</strong> Each source digitally
                signs their data submission. If 3 out of 5 sources agree, the data is accepted. Major discrepancies
                trigger public alerts and investigation requirements. This doesn't eliminate manipulation but makes
                it require coordinating multiple independent parties.
              </p>
            </>
          ),
        },
        {
          id: 'data-2',
          question: 'What if the metrics themselves are poorly chosen or politically motivated?',
          answer: (
            <>
              <p className="mb-4">
                <strong className="text-amber-400">Valid Concern:</strong> Choosing metrics is inherently
                political. GDP doesn't measure happiness or inequality. Unemployment rates can be manipulated
                through definitions. Approval ratings can be biased by who conducts the polls.
              </p>
              <p className="mb-4">
                <strong className="text-blue-400">Governance Solution:</strong> The metrics and thresholds
                should be embedded in a "constitutional smart contract" that requires supermajority approval
                (e.g., 2/3 vote) to modify. This prevents ruling parties from changing the rules to their
                advantage but allows evolution through broad consensus.
              </p>
              <p>
                <strong className="text-green-400">Transparency:</strong> All metric methodologies must be
                public and auditable. Citizens can challenge the data through formal dispute mechanisms built
                into the smart contracts.
              </p>
            </>
          ),
        },
        {
          id: 'data-3',
          question: 'Can metrics be gamed? What about "teaching to the test"?',
          answer: (
            <>
              <p className="mb-4">
                <strong className="text-red-400">Goodhart's Law:</strong> "When a measure becomes a target,
                it ceases to be a good measure." Governments will absolutely optimize for whatever metrics trigger
                elections, potentially at the expense of unmeasured but important outcomes.
              </p>
              <div className="mb-4">
                <strong className="text-amber-400">Examples:</strong>
                <ul className="mt-3 ml-5 space-y-1 list-disc">
                  <li>To boost GDP, slash environmental regulations and public health spending</li>
                  <li>To reduce unemployment, create meaningless government jobs</li>
                  <li>To improve education rankings, focus only on standardized test preparation</li>
                </ul>
              </div>
              <p>
                <strong className="text-green-400">Partial Mitigation:</strong> Use composite metrics that
                are harder to game (HDI, genuine progress indicator) and include both short-term and long-term
                indicators. No perfect solution exists—this is a fundamental challenge in any performance-based
                accountability system.
              </p>
            </>
          ),
        },
      ],
    },
    {
      id: 'implementation',
      title: 'Practical Implementation',
      color: 'purple',
      questions: [
        {
          id: 'impl-1',
          question: 'What about voters without internet access or technical literacy?',
          answer: (
            <>
              <p className="mb-4">
                <strong className="text-red-400">Digital Divide Problem:</strong> Blockchain voting
                exacerbates existing inequalities. Elderly citizens, rural communities, and economically
                disadvantaged populations may lack smartphones, internet access, or technical skills.
              </p>
              <p className="mb-4">
                <strong className="text-blue-400">Hybrid Approach:</strong> Maintain physical polling
                stations with paper ballot backups that are then digitized and recorded on the blockchain
                by election officials. This preserves accessibility while gaining blockchain's auditability
                benefits for the overall tally.
              </p>
              <p>
                <strong className="text-green-400">Public Infrastructure:</strong> Provide free public
                terminals (like libraries) where citizens can vote with assistance. Similar to how Estonia
                provides digital ID cards and support centers for their e-governance system.
              </p>
            </>
          ),
        },
        {
          id: 'impl-2',
          question: "What happens if there's a bug in the smart contract code?",
          answer: (
            <>
              <p className="mb-4">
                <strong className="text-red-400">Historical Precedent:</strong> The DAO hack in Ethereum
                showed that smart contract bugs can have catastrophic consequences. $60 million was stolen due
                to a recursion vulnerability that developers missed.
              </p>
              <p className="mb-4">
                <strong className="text-amber-400">Election Scenario:</strong> A bug could incorrectly tally
                votes, lock out legitimate voters, or allow double-voting. Since smart contracts are immutable,
                you can't just "patch" them like regular software.
              </p>
              <div>
                <strong className="text-green-400">Risk Mitigation:</strong>
                <ul className="mt-3 ml-5 space-y-2 list-disc">
                  <li>
                    <strong>Extensive Testing:</strong> Formal verification (mathematical proofs of correctness),
                    security audits by multiple independent firms, and bug bounty programs
                  </li>
                  <li>
                    <strong>Upgrade Mechanisms:</strong> Build in governance processes to upgrade contracts
                    with safeguards (time delays, multi-signature approval, public review periods)
                  </li>
                  <li>
                    <strong>Emergency Pause:</strong> Include circuit breakers that can freeze the system
                    if anomalies are detected, requiring multi-party approval to resume
                  </li>
                </ul>
              </div>
            </>
          ),
        },
        {
          id: 'impl-3',
          question: 'How much does this cost and who pays for it?',
          answer: (
            <>
              <p className="mb-4">
                <strong className="text-blue-400">Infrastructure Costs:</strong> Running a blockchain requires
                significant computational resources. Thousands of validator nodes, each needing servers, electricity,
                and maintenance. Estonia's e-governance system costs roughly €50-100 million annually.
              </p>
              <p className="mb-4">
                <strong className="text-amber-400">Transaction Fees:</strong> Who pays for recording votes?
                In public blockchains like Ethereum, users pay "gas fees." For government voting, the state would
                likely subsidize these costs to ensure free access, but this creates a taxpayer burden.
              </p>
              <p>
                <strong className="text-green-400">Cost-Benefit Analysis:</strong> Traditional elections are
                expensive too (poll workers, printed ballots, physical security). Blockchain could reduce some
                costs while adding others. Net savings are unclear and would depend on implementation scale
                and design choices.
              </p>
            </>
          ),
        },
      ],
    },
    {
      id: 'governance',
      title: 'Governance & Political Challenges',
      color: 'purple',
      questions: [
        {
          id: 'gov-1',
          question: "Won't automated triggers create constant political chaos?",
          answer: (
            <>
              <p className="mb-4">
                <strong className="text-amber-400">The Instability Risk:</strong> If metrics are volatile or
                thresholds are too sensitive, you could trigger elections every few months. This prevents
                long-term planning and policy implementation.
              </p>
              <p className="mb-4">
                <strong className="text-blue-400">Example:</strong> GDP naturally fluctuates with business
                cycles. A brief recession could trigger an election, but replacing leadership during economic
                downturns might make things worse, not better.
              </p>
              <div>
                <strong className="text-green-400">Design Considerations:</strong>
                <ul className="mt-3 ml-5 space-y-2 list-disc">
                  <li>
                    <strong>Sustained Triggers:</strong> Require metrics to stay below thresholds for multiple
                    consecutive periods (e.g., 3+ months) before triggering
                  </li>
                  <li>
                    <strong>Cooldown Periods:</strong> Prevent more than one recall election per year
                  </li>
                  <li>
                    <strong>Proportional Responses:</strong> Minor infractions could trigger public hearings
                    or reform requirements rather than immediate elections
                  </li>
                </ul>
              </div>
            </>
          ),
        },
        {
          id: 'gov-2',
          question: 'Can authoritarian regimes use this technology to appear democratic?',
          answer: (
            <>
              <div className="mb-4">
                <strong className="text-red-400">Critical Warning:</strong> Yes, absolutely. Blockchain
                doesn't guarantee democracy—it's just a tool. Authoritarian governments could:
                <ul className="mt-3 ml-5 space-y-1 list-disc">
                  <li>Control all validator nodes themselves</li>
                  <li>Manipulate metrics before they reach the blockchain</li>
                  <li>Disqualify opposition candidates through bureaucratic means</li>
                  <li>Use "blockchain verification" as propaganda while maintaining control</li>
                </ul>
              </div>
              <p>
                <strong className="text-green-400">The Real Requirements:</strong> Technology alone cannot
                create democracy. You also need: independent judiciary, free press, protection of opposition
                parties, civil society organizations, and genuine separation of powers. Blockchain can strengthen
                existing democratic institutions but cannot create them from nothing.
              </p>
            </>
          ),
        },
        {
          id: 'gov-3',
          question: "Who decides the initial rules? Isn't this just moving power somewhere else?",
          answer: (
            <>
              <p className="mb-4">
                <strong className="text-blue-400">The Bootstrap Problem:</strong> Someone has to write the
                initial smart contracts, choose the metrics, set the thresholds, and define the rules. This
                group has enormous power to shape the system.
              </p>
              <p className="mb-4">
                <strong className="text-amber-400">Political Reality:</strong> The programmers who write the
                code become a powerful technocratic elite. If citizens don't understand the system, they can't
                effectively challenge it. This is "code is law" taken to its extreme.
              </p>
              <p>
                <strong className="text-green-400">Democratic Legitimacy:</strong> The initial rules should
                come from a constitutional convention or referendum, not just be imposed by technical experts.
                The code must then be open-source, publicly audited, and amendable through democratic processes.
                Transparency is essential but not sufficient.
              </p>
            </>
          ),
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-blue-400 mb-4 tracking-tight">
          Frequently Asked Questions
        </h2>
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <p className="text-sm text-slate-400 leading-relaxed">
            This FAQ addresses critical questions about blockchain governance systems, including potential failure
            points, security concerns, and practical implementation challenges. Understanding both the strengths
            and limitations of this technology is essential for informed discussion.
          </p>
        </div>
      </div>

      {/* FAQ Sections */}
      {faqSections.map((section) => (
        <div key={section.id} className="space-y-4">
          <h3 className="text-2xl font-semibold text-purple-400 mb-4">
            {section.title}
          </h3>

          {section.questions.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden transition-all duration-200 hover:border-slate-600"
            >
              <button
                onClick={() => toggleSection(item.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700/30 transition-colors"
              >
                <span className="text-base font-bold text-slate-200 pr-4">
                  {item.question}
                </span>
                {openSection === item.id ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>

              {openSection === item.id && (
                <div className="px-6 py-4 border-t border-slate-700 bg-slate-900/30">
                  <div className="text-sm text-slate-400 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Bottom Line */}
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-6 border-2 border-purple-500/50">
        <h3 className="text-xl font-bold text-purple-300 mb-4">
          The Bottom Line
        </h3>
        <div className="text-sm text-slate-200 leading-relaxed space-y-4">
          <p>
            Blockchain governance systems are not a silver bullet. They introduce new capabilities
            (tamper-proof records, automated accountability, transparent auditing) but also new vulnerabilities
            (technical complexity, digital divide, potential for sophisticated manipulation).
          </p>

          <div>
            <strong className="text-blue-400">These systems work best as:</strong>
            <ul className="mt-3 ml-5 space-y-1 list-disc">
              <li>Complements to existing democratic institutions, not replacements</li>
              <li>Tools for transparency and auditability in already-democratic societies</li>
              <li>Checks on government power when combined with independent validators</li>
              <li>Frameworks for gradual experimentation and iteration</li>
            </ul>
          </div>

          <div>
            <strong className="text-amber-400">They are dangerous when:</strong>
            <ul className="mt-3 ml-5 space-y-1 list-disc">
              <li>Implemented without adequate security auditing and testing</li>
              <li>Used to bypass rather than strengthen democratic norms</li>
              <li>Controlled by centralized authorities who manage all validators</li>
              <li>Treated as sufficient for democracy without supporting institutions</li>
            </ul>
          </div>

          <p>
            Technology can enhance governance, but it cannot replace the hard work of maintaining
            democratic culture, institutions, and civic engagement.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQView;
