import React, { useState, useMemo } from 'react';

interface FeatureVolumes {
  aiMagicCampaigns: boolean;
  newPositionsPerMonth: number;
  autoContactDataEnrichment: boolean;
  dialer: boolean;
  aiIcebreakers: boolean;
  aiLabels: boolean;
  aiReplies: boolean;
  aiComments: boolean;
  aiInbox: boolean;
  voicemail: boolean;
  sms: boolean;
  smsMessagesPerDay: number;
  pingsPerDay: number;
  emailsPerDay: number;
  linkedinRequestsPerDay: number;
  connectionAcceptanceRate: number;
}

interface PlanDetail {
  credits: number;
  cost: number;
  hasAI: boolean;
  hasVoicemail: boolean;
  hasSMS: boolean;
  hasDialer: boolean;
  creditCost: number;
  pingsPerDay: number;
  emailsPerDay: number;
}

interface FeatureInfoItem {
  label: string;
  description: string;
  availableOn: string;
}

interface FeatureDetail {
  assumptions: string;
  details: string;
}

type PlanName = 'Prospect' | 'Rookie' | 'Legend';

const CampaignCalculator = () => {
  // State management - Feature-focused
  const [workingDays, setWorkingDays] = useState(22);

  // Feature volumes - what user actually needs
  const [featureVolumes, setFeatureVolumes] = useState<FeatureVolumes>({
    aiMagicCampaigns: false,
    newPositionsPerMonth: 0,
    autoContactDataEnrichment: false,
    dialer: false,
    aiIcebreakers: false,
    aiLabels: false,
    aiReplies: false,
    aiComments: false,
    aiInbox: false,
    voicemail: false,
    sms: false,
    smsMessagesPerDay: 0,
    pingsPerDay: 50,
    emailsPerDay: 25,
    linkedinRequestsPerDay: 25,
    connectionAcceptanceRate: 0.30,
  });

  // Retail pricing for plans
  const planDetails: Record<PlanName, PlanDetail> = {
    Prospect: { credits: 250, cost: 200, hasAI: false, hasVoicemail: false, hasSMS: false, hasDialer: false, creditCost: 0.1812, pingsPerDay: 50, emailsPerDay: 50 },
    Rookie: { credits: 500, cost: 295, hasAI: true, hasVoicemail: false, hasSMS: false, hasDialer: false, creditCost: 0.1531, pingsPerDay: 100, emailsPerDay: 1000 },
    Legend: { credits: 1000, cost: 395, hasAI: true, hasVoicemail: true, hasSMS: true, hasDialer: true, creditCost: 0.1234, pingsPerDay: 200, emailsPerDay: 1000 },
  };

  // Add-on credit packages with tiered pricing
  const addOnPricing = [
    { credits: 250, costPerCredit: 0.1812 }, // $45.31
    { credits: 500, costPerCredit: 0.1531 }, // $76.56
    { credits: 1000, costPerCredit: 0.1234 }, // $123.44
    { credits: 2000, costPerCredit: 0.1164 }, // $232.81
    { credits: 5000, costPerCredit: 0.0934 }, // $467.19
    { credits: 10000, costPerCredit: 0.0780 }, // $779.69
  ];

  // Feature display information
  const featureInfo: Record<string, FeatureInfoItem> = {
    autoContactDataEnrichment: {
      label: 'Auto Contact Data Enrichment',
      description: 'Automatically enrich email contacts for first email in sequence',
      availableOn: 'All Plans',
    },
    dialer: {
      label: 'Dialer',
      description: 'Make outbound calls directly from Boombands',
      availableOn: 'Legend+',
    },
    aiMagicCampaigns: {
      label: 'AI Magic Campaigns',
      description: 'Auto-generate campaigns for new job positions',
      availableOn: 'Rookie+',
    },
    aiIcebreakers: {
      label: 'AI Icebreakers',
      description: 'Personalized opening message on LinkedIn connections',
      availableOn: 'Rookie+',
    },
    aiLabels: {
      label: 'AI Labels',
      description: 'Auto-categorize all inbox replies across channels (email, LinkedIn, Pings, SMS)',
      availableOn: 'Rookie+',
    },
    aiReplies: {
      label: 'AI Replies',
      description: 'AI-generated responses to inbox replies - semi-automated assistant tool',
      availableOn: 'Rookie+',
    },
    aiComments: {
      label: 'AI Powered Comments',
      description: 'Auto-comment on LinkedIn posts from connections',
      availableOn: 'Rookie+',
    },
    aiInbox: {
      label: 'AI Employee Assist in Inbox',
      description: 'AI assistance for email inbox management',
      availableOn: 'Rookie+',
    },
    voicemail: {
      label: 'Voicemail Drops',
      description: 'Personalized voicemail left with connections',
      availableOn: 'Legend+',
    },
    sms: {
      label: 'SMS Messages',
      description: 'Send SMS text messages to prospects',
      availableOn: 'Legend+',
    },
  };

  const calculations = useMemo(() => {
    // Calculate credit requirements based on selected features
    const emailsPerDay = featureVolumes.emailsPerDay;
    const linkedinRequests = featureVolumes.linkedinRequestsPerDay;
    const connectionRate = featureVolumes.connectionAcceptanceRate;
    const newPositions = featureVolumes.newPositionsPerMonth || 0;
    const smsMessagesPerDay = featureVolumes.smsMessagesPerDay || 0;

    // Daily metrics
    const domainDaily = Math.ceil(emailsPerDay / 69);
    const linkedinConnections = linkedinRequests * connectionRate;
    const aiRepliedConnections = linkedinConnections * 0.25; // 25% reply to AI

    // Monthly metrics
    // Domain setup will be calculated conditionally based on plan - only for Rookie+ plans
    let domainSetupMonthly = 0; // Will be calculated after plan determination

    // AI Magic Campaigns (25 credits per position) - Rookie+ only
    const magicCampaignsMonthly = featureVolumes.aiMagicCampaigns ? newPositions * 25 : 0;

    // Calculate credits needed for each active feature
    const icebreakersMonthly = featureVolumes.aiIcebreakers ? linkedinConnections * workingDays : 0;

    // AI Labels - replies from all channels
    // Email replies: 5%, Pings replies: ~5% (similar to email), LinkedIn replies: 15%, SMS replies: ~3% (market average)
    const emailRepliesDaily = emailsPerDay * 0.05; // 5% response rate
    const pingRepliesDaily = featureVolumes.pingsPerDay * 0.05; // ~5% response rate (same as email)
    const linkedinRepliesDaily = linkedinConnections * 0.15; // 15% reply rate to connections
    const smsRepliesDaily = featureVolumes.smsMessagesPerDay * 0.03; // ~3% market average for SMS
    const totalRepliesDaily = emailRepliesDaily + pingRepliesDaily + linkedinRepliesDaily + smsRepliesDaily;
    const labelsMonthly = featureVolumes.aiLabels ? totalRepliesDaily * workingDays : 0;

    const inboxMonthly = featureVolumes.aiInbox ? emailRepliesDaily * workingDays : 0;
    const commentsMonthly = featureVolumes.aiComments ? (linkedinConnections * 0.485) * workingDays : 0;
    const repliesMonthly = featureVolumes.aiReplies ? aiRepliedConnections * workingDays : 0;
    const paidReplies = Math.max(0, repliesMonthly - 250); // 250 free credits
    const voicemailMonthly = featureVolumes.voicemail ? linkedinConnections * workingDays : 0;

    // SMS (1 credit per message) - Legend+ only
    const smsMonthly = featureVolumes.sms ? smsMessagesPerDay * workingDays : 0;

    // Auto Contact Data Enrichment (1 credit per 4 emails sent) - Available to all plans
    // Only the first email in a sequence needs enrichment (1 out of every 4 emails in the sequence)
    const enrichmentMonthly = featureVolumes.autoContactDataEnrichment ? Math.ceil((emailsPerDay / 4) * workingDays) : 0;

    // Totals
    const firstMonthTotal = domainSetupMonthly + magicCampaignsMonthly + icebreakersMonthly + labelsMonthly + commentsMonthly + inboxMonthly + paidReplies + voicemailMonthly + smsMonthly + enrichmentMonthly;
    const ongoingTotal = magicCampaignsMonthly + icebreakersMonthly + labelsMonthly + commentsMonthly + inboxMonthly + paidReplies + voicemailMonthly + smsMonthly + enrichmentMonthly;

    // Determine which plans can handle this load
    const planSuitability = {
      Prospect: {
        canHandle: ongoingTotal <= 250 && emailsPerDay <= 50,
        firstMonthOk: firstMonthTotal <= 250,
        creditShortfall: Math.max(0, ongoingTotal - 250),
        emailsExceeded: emailsPerDay > 50,
      },
      Rookie: {
        canHandle: ongoingTotal <= 500,
        firstMonthOk: firstMonthTotal <= 500,
        creditShortfall: Math.max(0, ongoingTotal - 500),
        emailsExceeded: false,
      },
      Legend: {
        canHandle: ongoingTotal <= 1000,
        firstMonthOk: firstMonthTotal <= 1000,
        creditShortfall: Math.max(0, ongoingTotal - 1000),
        emailsExceeded: false,
      },
    };

    // Check if any Rookie+ features are selected
    const hasGrowthFeatures = featureVolumes.aiMagicCampaigns ||
      featureVolumes.aiIcebreakers ||
      featureVolumes.aiLabels ||
      featureVolumes.aiReplies ||
      featureVolumes.aiComments ||
      featureVolumes.aiInbox;

    // Check if any Legend+ features are selected
    const hasScaleFeatures = featureVolumes.dialer ||
      featureVolumes.voicemail ||
      featureVolumes.sms;

    // Find most economical plan that works
    let recommendedPlan: PlanName = 'Legend';
    let needsAddOn = false;
    let addOnCreditsNeeded = 0;
    let emailLimitExceeded = false;

    // Enforce minimum plan based on features selected AND email volume
    if (hasScaleFeatures) {
      // Must be on Legend or higher
      if (planSuitability.Legend.canHandle) {
        recommendedPlan = 'Legend';
      } else {
        // Legend doesn't have enough credits
        recommendedPlan = 'Legend';
        needsAddOn = true;
        addOnCreditsNeeded = ongoingTotal - planDetails.Legend.credits;
      }
    } else if (hasGrowthFeatures) {
      // Must be on Rookie or higher
      if (planSuitability.Rookie.canHandle) {
        recommendedPlan = 'Rookie';
      } else {
        // Rookie doesn't have enough credits - compare add-on vs upgrade
        const rookieShortfall = ongoingTotal - planDetails.Rookie.credits;
        const rookieAddOnCost = rookieShortfall * planDetails.Rookie.creditCost;
        const monthlyCostDifference = planDetails.Legend.cost - planDetails.Rookie.cost;

        if (rookieAddOnCost < monthlyCostDifference) {
          recommendedPlan = 'Rookie';
          needsAddOn = true;
          addOnCreditsNeeded = rookieShortfall;
        } else {
          recommendedPlan = 'Legend';
        }
      }
    } else {
      // No Rookie+ or Legend+ features selected
      if (emailsPerDay > 50) {
        // Email volume exceeds Prospect limit
        emailLimitExceeded = true;
        if (planSuitability.Rookie.canHandle) {
          recommendedPlan = 'Rookie';
        } else {
          // Rookie doesn't have enough credits - compare add-on vs upgrade
          const rookieShortfall = ongoingTotal - planDetails.Rookie.credits;
          const rookieAddOnCost = rookieShortfall * planDetails.Rookie.creditCost;
          const monthlyCostDifference = planDetails.Legend.cost - planDetails.Rookie.cost;

          if (rookieAddOnCost < monthlyCostDifference) {
            recommendedPlan = 'Rookie';
            needsAddOn = true;
            addOnCreditsNeeded = rookieShortfall;
          } else {
            recommendedPlan = 'Legend';
          }
        }
      } else {
        // Within email limits - choose most economical
        if (planSuitability.Prospect.canHandle) {
          recommendedPlan = 'Prospect';
        } else if (planSuitability.Rookie.canHandle) {
          recommendedPlan = 'Rookie';
        } else {
          // Rookie doesn't have enough credits - compare add-on vs upgrade
          const rookieShortfall = ongoingTotal - planDetails.Rookie.credits;
          const rookieAddOnCost = rookieShortfall * planDetails.Rookie.creditCost;
          const monthlyCostDifference = planDetails.Legend.cost - planDetails.Rookie.cost;

          if (rookieAddOnCost < monthlyCostDifference) {
            recommendedPlan = 'Rookie';
            needsAddOn = true;
            addOnCreditsNeeded = rookieShortfall;
          } else {
            recommendedPlan = 'Legend';
          }
        }
      }
    }

    // Check if add-on needed
    const selectedPlanCredit = planDetails[recommendedPlan].credits;

    // Calculate add-on cost based on tiered pricing
    let addOnCostMonthly = 0;
    if (needsAddOn && addOnCreditsNeeded > 0) {
      // Find the best matching add-on package (smallest package that covers the need)
      const bestAddOn = addOnPricing.find(pkg => pkg.credits >= addOnCreditsNeeded);
      if (bestAddOn) {
        addOnCostMonthly = bestAddOn.credits * bestAddOn.costPerCredit;
      } else {
        // If needs more than 10k, use the 10k rate
        const maxPackage = addOnPricing[addOnPricing.length - 1];
        addOnCostMonthly = addOnCreditsNeeded * maxPackage.costPerCredit;
      }
    }

    // Recalculate firstMonthTotal with adjusted domainSetupMonthly
    const firstMonthTotalAdjusted = domainSetupMonthly + magicCampaignsMonthly + icebreakersMonthly + labelsMonthly + commentsMonthly + inboxMonthly + paidReplies + voicemailMonthly + smsMonthly + enrichmentMonthly;

    if (ongoingTotal > selectedPlanCredit) {
      needsAddOn = true;
      addOnCreditsNeeded = ongoingTotal - selectedPlanCredit;
    }

    return {
      emailsPerDay,
      linkedinRequests,
      connectionRate,
      newPositions,
      smsMessagesPerDay,
      domainDaily,
      linkedinConnections,
      emailRepliesDaily,
      aiRepliedConnections,
      magicCampaignsMonthly,
      icebreakersMonthly,
      labelsMonthly,
      commentsMonthly,
      inboxMonthly,
      repliesMonthly,
      paidReplies,
      voicemailMonthly,
      smsMonthly,
      enrichmentMonthly,
      domainSetupMonthly,
      firstMonthTotal: Math.round(firstMonthTotalAdjusted),
      ongoingTotal: Math.round(ongoingTotal),
      planSuitability,
      recommendedPlan,
      emailLimitExceeded,
      needsAddOn,
      addOnCreditsNeeded: Math.ceil(addOnCreditsNeeded),
      addOnCostMonthly,
      economicalAIConnections: Math.floor((250 * 0.60) / workingDays),
      economicalAIReplyCredits: Math.floor(250 * 0.60),
    };
  }, [featureVolumes, workingDays]);

  // Handle feature toggle
  const handleFeatureToggle = (feature: keyof FeatureVolumes) => {
    setFeatureVolumes(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  // Handle numeric input
  const handleNumericChange = (field: keyof FeatureVolumes, value: number) => {
    setFeatureVolumes(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Slider Component - Simplified slider only
  interface SliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
    format?: (v: number) => string | number;
  }

  const Slider: React.FC<SliderProps> = ({ label, value, onChange, min, max, step, format = (v) => v }) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-semibold text-gray-200">{label}</label>
          <span className="text-2xl font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600/30 to-cyan-400/30 border border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-400/20">
            {format(value)}
          </span>
        </div>

        <div className="relative pt-2 pb-1">
          {/* Background track */}
          <div className="absolute left-0 right-0 top-4 h-2 bg-slate-700 rounded-full"></div>

          {/* Filled track */}
          <div
            className="absolute left-0 top-4 h-2 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          ></div>

          {/* Actual input (invisible but functional) */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="relative w-full h-2 rounded-lg appearance-none bg-transparent cursor-pointer z-10"
            style={{
              WebkitAppearance: 'none',
              outline: 'none',
              background: 'transparent',
            }}
          />

          <style>{`
            input[type='range'] {
              -webkit-appearance: none;
              appearance: none;
              width: 100%;
              height: 8px;
              border-radius: 4px;
              background: transparent;
              outline: none;
              cursor: pointer;
            }
            
            input[type='range']::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: #64748b;
              cursor: grab;
              border: 2px solid #475569;
              box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            }
            
            input[type='range']::-webkit-slider-thumb:hover {
              background: #94a3b8;
              border-color: #64748b;
            }
            
            input[type='range']::-webkit-slider-thumb:active {
              cursor: grabbing;
            }
            
            input[type='range']::-moz-range-thumb {
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: #64748b;
              cursor: grab;
              border: 2px solid #475569;
              box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            }
            
            input[type='range']::-moz-range-thumb:hover {
              background: #94a3b8;
              border-color: #64748b;
            }
            
            input[type='range']::-moz-range-thumb:active {
              cursor: grabbing;
            }
            
            input[type='range']::-moz-range-track {
              background: transparent;
              border: none;
            }
            
            input[type='number'] {
              font-family: inherit;
            }
            
            input[type='number']:focus {
              outline: none;
              border-color: #64748b;
              background-color: rgba(100, 116, 139, 0.3);
            }
          `}</style>
        </div>

        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{format(min)}</span>
          <span>{format(max)}</span>
        </div>
      </div>
    );
  };

  // Feature Checkbox Component with Learn More Accordion
  interface FeatureCheckboxProps {
    featureKey: keyof FeatureVolumes;
    disabled?: boolean;
  }

  const FeatureCheckbox: React.FC<FeatureCheckboxProps> = ({ featureKey, disabled = false }) => {
    const info = featureInfo[featureKey];
    const isChecked = featureVolumes[featureKey] as boolean;
    const [learnMoreOpen, setLearnMoreOpen] = React.useState(false);

    // Feature assumptions and details
    const featureDetails: Record<string, FeatureDetail> = {
      aiMagicCampaigns: {
        assumptions: "25 credits per new job position posted",
        details: "Automatically generates campaigns for new positions you're hiring for."
      },
      aiIcebreakers: {
        assumptions: "1 credit per LinkedIn connection made (based on 30% acceptance rate)",
        details: "Sends personalized opening messages to new LinkedIn connections."
      },
      aiLabels: {
        assumptions: "1 credit per reply received: Email (5%), Pings (5%), LinkedIn (15%), SMS (3% market avg)",
        details: "Auto-categorizes inbox replies across all channels (email, LinkedIn, Pings, SMS)."
      },
      aiReplies: {
        assumptions: "1 credit per AI-generated reply (first 250 credits free per month)",
        details: "AI-powered responses to inbox replies with 25% response rate from connections."
      },
      aiComments: {
        assumptions: "1 credit per connection (48.5% engagement rate on connections)",
        details: "Automatically comments on LinkedIn posts from your connections."
      },
      aiInbox: {
        assumptions: "1 credit per email reply received",
        details: "AI assistance for managing your email inbox."
      },
      autoContactDataEnrichment: {
        assumptions: "1 credit per 4 emails sent (enriches first email in sequence)",
        details: "Automatically enriches contact data for your email outreach."
      },
      dialer: {
        assumptions: "Available on Legend plan and higher",
        details: "Make outbound calls directly from Boombands interface."
      },
      voicemail: {
        assumptions: "1 credit per Voicemail Drop sent (based on a 30% pass rate)",
        details: "Leave personalized voicemails with new LinkedIn connections."
      },
      sms: {
        assumptions: "1 credit per SMS message sent",
        details: "Send SMS text messages to prospects."
      }
    };

    const details = featureDetails[featureKey];

    return (
      <div>
        <label className={`flex items-start gap-3 p-4 rounded-lg border transition-all relative ${disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer'
          } ${isChecked && !disabled
            ? 'border-purple-500/50 bg-slate-700/40 shadow-lg shadow-purple-500/20'
            : 'border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:shadow-md hover:shadow-purple-500/10'
          }`}>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => handleFeatureToggle(featureKey)}
            disabled={disabled}
            className="mt-1 w-4 h-4 cursor-pointer accent-cyan-400 disabled:cursor-not-allowed"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-100">{info.label}</p>
              <span className={`text-xs font-bold ${isChecked ? 'text-cyan-400' : 'text-slate-400'}`}>{info.availableOn}</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{info.description}</p>

            {/* Learn More Accordion Inside Tile */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setLearnMoreOpen(!learnMoreOpen);
              }}
              className="mt-3 text-xs hover:text-cyan-300 transition-colors flex items-center gap-2 group"
            >
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-semibold hover:from-purple-300 hover:to-cyan-300">
                Learn more
              </span>
            </button>

            {learnMoreOpen && (
              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-xs space-y-2 mt-3">
                <div>
                  <p className="font-semibold text-slate-300 mb-1">Assumptions:</p>
                  <p className="text-slate-400">{details?.assumptions}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-300 mb-1">How it works:</p>
                  <p className="text-slate-400">{details?.details}</p>
                </div>
                <div className="border-t border-slate-600 pt-2 mt-2">
                  <p className="text-slate-400 italic">⚠️ Results may vary based on your Slate Configuration and campaign performance.</p>
                </div>
              </div>
            )}
          </div>
        </label>
      </div>
    );
  };

  // Stat Card Component
  interface StatCardProps {
    label: string;
    value: string | number;
    unit?: string;
    highlight?: boolean;
  }

  const StatCard: React.FC<StatCardProps> = ({ label, value, unit = '', highlight = false }) => (
    <div className={`p-4 rounded-xl transition-all border ${highlight
        ? 'bg-slate-700/40 border-slate-600 shadow-lg'
        : 'bg-slate-800/40 border-slate-700 shadow-md'
      }`}>
      <p className="text-xs font-semibold text-gray-400 uppercase">{label}</p>
      <p className={`text-2xl font-bold mt-2 ${highlight ? 'text-slate-100' : 'text-gray-200'}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
        {unit && <span className="text-lg ml-1 text-gray-500">{unit}</span>}
      </p>
    </div>
  );

  // Plan Recommendation Card
  interface PlanCardProps {
    planName: string;
    info: PlanDetail;
    suitability: {
      canHandle: boolean;
      firstMonthOk: boolean;
      creditShortfall: number;
      emailsExceeded: boolean;
    };
  }

  const PlanCard = ({ planName, info, suitability }: PlanCardProps) => {
    const isRecommended = planName === calculations.recommendedPlan;

    return (
      <div className={`p-4 rounded-xl border transition-all ${isRecommended
          ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-400 border-0 shadow-lg'
          : suitability.canHandle
            ? 'border-slate-600 bg-slate-800/30'
            : 'border-slate-700 bg-slate-800/20 opacity-60'
        }`}>
        <div className="flex justify-between items-start mb-2">
          <p className={`font-bold ${isRecommended ? 'text-white' : 'text-gray-100'}`}>{planName}</p>
          <p className={`text-lg font-bold ${isRecommended ? 'text-white' : 'text-slate-300'}`}>${info.cost}/mo</p>
        </div>
        <p className={`text-xs ${isRecommended ? 'text-white/80' : 'text-gray-500'} mb-3`}>{info.credits} credits/month</p>

        {isRecommended && (
          <div className="bg-slate-600 text-gray-100 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
            RECOMMENDED
          </div>
        )}

        {suitability.canHandle ? (
          <p className="text-sm font-semibold text-slate-300">Sufficient</p>
        ) : (
          <div>
            <p className="text-sm font-semibold text-gray-400">Needs add-on</p>
            <p className="text-xs text-gray-500 mt-1">+{suitability.creditShortfall.toLocaleString()} credits needed</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-slate-950 pb-16 min-h-screen w-full">
      {/* Subtle gradient background glow */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-[1920px] mx-auto p-4 py-8 animate-fade-up">
        {/* Header */}
        <div className="mb-10 relative z-10 text-center">
          <div className="inline-block">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl text-center my-2 font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">Slate Planner</h1>
            </div>
          </div>
          <p className="text-lg text-gray-400">Select the features you need, we'll recommend the perfect plan</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Feature Selection First */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl p-8 sticky top-6 space-y-6 relative overflow-hidden">
              {/* Subtle gradient accent border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-400"></div>

              <h2 className="text-2xl font-bold text-gray-100 mb-6">Build Your Plan</h2>

              {/* Included Core Features */}
              <div className="border-b border-slate-700 pb-6">
                <h3 className="text-base font-bold text-gray-200 mb-4">Prospect Plan</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-slate-700/20 border border-slate-600">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mt-1 flex-shrink-0"></span>
                        <span className="text-gray-300">50 Pings per Day</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mt-1 flex-shrink-0"></span>
                        <span className="text-gray-300">Unlimited Boombands Video</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mt-1 flex-shrink-0"></span>
                        <span className="text-gray-300">Unlimited LinkedIn</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mt-1 flex-shrink-0"></span>
                        <span className="text-gray-300">Limited Email Automation</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mt-1 flex-shrink-0"></span>
                        <span className="text-gray-300">Unified Multichannel Inbox</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mt-1 flex-shrink-0"></span>
                        <span className="text-gray-300">CRM Integrations</span>
                      </div>
                    </div>
                    <div className="border-t border-slate-500/30 mt-4 pt-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={featureVolumes.autoContactDataEnrichment}
                          onChange={() => handleFeatureToggle('autoContactDataEnrichment')}
                          className="mt-1 w-4 h-4 cursor-pointer accent-cyan-400"
                        />
                        <div className="flex-1">
                          <span className="text-gray-300 font-semibold">Auto Contact Data Enrichment</span>
                          <p className="text-xs text-slate-400 mt-1">Enrich first email in sequence</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 1: Optional Features - Organized by Tier */}
              <div className="border-b border-slate-700 pb-6">
                <h3 className="text-base font-bold text-gray-200 mb-2">Step 1: Choose Features</h3>
                <p className="text-sm text-gray-400 mb-4">What features do you want to use?</p>

                <div className="grid grid-cols-2 gap-4">
                  {/* Rookie+ Features */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase">Rookie+</p>
                    <div className="space-y-3">
                      <FeatureCheckbox featureKey="aiMagicCampaigns" />
                      <FeatureCheckbox featureKey="aiIcebreakers" />
                      <FeatureCheckbox featureKey="aiLabels" />
                      <FeatureCheckbox featureKey="aiReplies" />
                      <FeatureCheckbox featureKey="aiInbox" />
                      <FeatureCheckbox featureKey="aiComments" />
                    </div>
                  </div>

                  {/* Legend+ Features */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase">Legend+</p>
                    <div className="space-y-3">
                      <FeatureCheckbox featureKey="dialer" />
                      <FeatureCheckbox featureKey="voicemail" />
                      <FeatureCheckbox featureKey="sms" />
                    </div>
                  </div>
                </div>
              </div>

              {/* New Positions - Accordion style only show if AI Magic Campaigns selected */}
              {featureVolumes.aiMagicCampaigns && (
                <div className="border-b border-slate-700 pb-6">
                  <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between cursor-pointer">
                      <h3 className="text-base font-bold text-gray-200">New Job Postings Per Month</h3>
                      <span className="text-2xl text-gray-400">▼</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2 mb-4">How many new job positions will you be filling each month?</p>

                    <Slider
                      label="Postings"
                      value={featureVolumes.newPositionsPerMonth}
                      onChange={(v) => handleNumericChange('newPositionsPerMonth', v)}
                      min={0}
                      max={50}
                      step={1}
                    />
                  </div>
                </div>
              )}

              {/* SMS Messages - Only show if SMS selected */}
              {featureVolumes.sms && (
                <div className="border-b border-slate-700 pb-6">
                  <h3 className="text-base font-bold text-gray-200 mb-2">SMS Messages Per Day</h3>
                  <p className="text-sm text-gray-400 mb-4">How many SMS messages will you send daily?</p>

                  <Slider
                    label="SMS/Day"
                    value={featureVolumes.smsMessagesPerDay}
                    onChange={(v) => handleNumericChange('smsMessagesPerDay', v)}
                    min={0}
                    max={500}
                    step={10}
                    format={(v) => v.toLocaleString()}
                  />
                </div>
              )}

              {/* Step 2: Campaign Volume */}
              <div className="border-b border-slate-700 pb-6">
                <h3 className="text-base font-bold text-gray-200 mb-2">Step 2: Set Volume</h3>
                <p className="text-sm text-gray-400 mb-4">How much volume do you want to send?</p>

                <Slider
                  label="Pings per Day"
                  value={featureVolumes.pingsPerDay}
                  onChange={(v) => handleNumericChange('pingsPerDay', v)}
                  min={25}
                  max={200}
                  step={25}
                  format={(v) => v.toLocaleString()}
                />

                <Slider
                  label="Emails per Day"
                  value={featureVolumes.emailsPerDay}
                  onChange={(v) => handleNumericChange('emailsPerDay', v)}
                  min={25}
                  max={1000}
                  step={25}
                  format={(v) => v.toLocaleString()}
                />

                <Slider
                  label="LinkedIn Requests/Day"
                  value={featureVolumes.linkedinRequestsPerDay}
                  onChange={(v) => handleNumericChange('linkedinRequestsPerDay', v)}
                  min={0}
                  max={50}
                  step={5}
                />

                <Slider
                  label="Connection Acceptance Rate"
                  value={featureVolumes.connectionAcceptanceRate}
                  onChange={(v) => handleNumericChange('connectionAcceptanceRate', v)}
                  min={0}
                  max={1}
                  step={0.05}
                  format={(v) => `${(v * 100).toFixed(0)}%`}
                />

                <Slider
                  label="Working Days/Month"
                  value={workingDays}
                  onChange={setWorkingDays}
                  min={1}
                  max={30}
                  step={1}
                />
              </div>
            </div>
          </div>

          {/* Right Columns - Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Recommendation */}
            <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-400 rounded-2xl shadow-xl p-8 text-gray-100">
              <h2 className="text-3xl font-bold mb-2">Recommended Plan</h2>
              <p className="text-slate-100 mb-6">{calculations.recommendedPlan}</p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase">Monthly Cost</p>
                  <p className="text-4xl font-bold mt-2">${planDetails[calculations.recommendedPlan].cost}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase">Plan Credits</p>
                  <p className="text-4xl font-bold mt-2">{planDetails[calculations.recommendedPlan].credits}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase">Credits Needed</p>
                  <p className="text-4xl font-bold mt-2">{calculations.ongoingTotal}</p>
                </div>
              </div>

              {calculations.needsAddOn && (
                <div className="bg-slate-700/50 backdrop-blur p-4 rounded-lg border border-slate-600">
                  <p className="text-sm font-semibold mb-2">Add-on Required:</p>
                  <p className="text-2xl font-bold">{calculations.addOnCreditsNeeded.toLocaleString()} extra credits/month</p>
                  <p className="text-xs text-slate-400 mt-2">
                    Est. cost: ${(calculations.addOnCostMonthly).toFixed(2)}/month
                  </p>
                </div>
              )}

              {calculations.emailLimitExceeded && (
                <div className="bg-orange-900/40 backdrop-blur p-4 rounded-lg border border-orange-600/50">
                  <p className="text-sm font-semibold text-orange-200 mb-2">⚠️ Email Domain Limit Exceeded</p>
                  <p className="text-xs text-orange-100">Prospect plan is limited to 50 emails/day from your own domain. You're sending {calculations.emailsPerDay}/day, so Rookie or Legend plan is required for multiple domain strategy.</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-400 border-0 shadow-lg">
                <p className="text-xs font-semibold text-white/90 uppercase">Credits First Month</p>
                <p className="text-2xl font-bold mt-2 text-white">
                  {calculations.firstMonthTotal.toLocaleString()}
                  <span className="text-lg ml-1 text-white/80">credits</span>
                </p>
              </div>
              <div className="p-4 rounded-xl border bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-400 border-0 shadow-lg">
                <p className="text-xs font-semibold text-white/90 uppercase">Credits Ongoing</p>
                <p className="text-2xl font-bold mt-2 text-white">
                  {calculations.ongoingTotal.toLocaleString()}
                  <span className="text-lg ml-1 text-white/80">credits</span>
                </p>
              </div>
            </div>

            {/* Campaign Metrics */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl p-8 relative overflow-hidden">
              {/* Gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-400"></div>
              {/* Subtle gradient accent */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-400/10 to-transparent rounded-full blur-2xl"></div>
              <h2 className="text-xl font-bold text-gray-100 mb-6 relative z-10">Campaign Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {calculations.recommendedPlan !== 'Prospect' && <StatCard label="Domains Needed" value={calculations.domainDaily} />}
                <StatCard label="Daily Connections" value={calculations.linkedinConnections.toFixed(1)} />
                <StatCard label="Daily Email Replies" value={calculations.emailRepliesDaily.toFixed(1)} />
                <StatCard label="Connections Replying" value={calculations.aiRepliedConnections.toFixed(1)} />
                <StatCard label="Economical AI Replies/Day" value={calculations.economicalAIConnections} />
                {featureVolumes.aiMagicCampaigns && <StatCard label="New Positions/Month" value={calculations.newPositions} />}
                {featureVolumes.sms && <StatCard label="SMS/Day" value={calculations.smsMessagesPerDay} />}
                {featureVolumes.autoContactDataEnrichment && <StatCard label="Daily Contacts Enriched" value={Math.ceil(calculations.emailsPerDay / 4)} />}
              </div>
              <p className="text-xs text-gray-400 mt-6 p-4 bg-slate-800/50 rounded border border-slate-700">
                Economical AI Setup: {calculations.economicalAIConnections} AI replies/day uses 60% of your free 250 credits ({calculations.economicalAIReplyCredits} credits/month), leaving room for growth.
              </p>
            </div>

            {/* Credit Breakdown */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl p-8 relative overflow-hidden">
              {/* Gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-400"></div>
              {/* Subtle gradient accent */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-purple-600/10 to-transparent rounded-full blur-2xl"></div>
              <h2 className="text-xl font-bold text-gray-100 mb-6 relative z-10">Credit Breakdown (Monthly)</h2>
              <div className="space-y-3">
                {calculations.domainSetupMonthly > 0 && (
                  <div className="flex justify-between p-3 bg-slate-800/30 rounded border border-slate-700">
                    <span className="font-semibold text-gray-300">Domain Setup (1st month)</span>
                    <span className="font-bold text-slate-300">{Math.round(calculations.domainSetupMonthly)}</span>
                  </div>
                )}
                {calculations.magicCampaignsMonthly > 0 && (
                  <div className="flex justify-between p-3 bg-slate-800/30 rounded border border-slate-700">
                    <span className="font-semibold text-gray-300">AI Magic Campaigns ({calculations.newPositions} positions × 25 credits)</span>
                    <span className="font-bold text-slate-300">{Math.round(calculations.magicCampaignsMonthly)}</span>
                  </div>
                )}
                {calculations.enrichmentMonthly > 0 && (
                  <div className="flex justify-between p-3 bg-slate-800/30 rounded border border-slate-700">
                    <span className="font-semibold text-gray-300">Auto Contact Data Enrichment ({Math.ceil(calculations.emailsPerDay / 4)} enrichments/day)</span>
                    <span className="font-bold text-slate-300">{Math.round(calculations.enrichmentMonthly)}</span>
                  </div>
                )}
                {calculations.icebreakersMonthly > 0 && (
                  <div className="flex justify-between p-3 bg-slate-800/30 rounded border border-slate-700">
                    <span className="font-semibold text-gray-300">AI Icebreakers</span>
                    <span className="font-bold text-slate-300">{Math.round(calculations.icebreakersMonthly)}</span>
                  </div>
                )}
                {calculations.labelsMonthly > 0 && (
                  <div className="flex justify-between p-3 bg-slate-800/30 rounded border border-slate-700">
                    <span className="font-semibold text-gray-300">AI Labels</span>
                    <span className="font-bold text-slate-300">{Math.round(calculations.labelsMonthly)}</span>
                  </div>
                )}
                {calculations.inboxMonthly > 0 && (
                  <div className="flex justify-between p-3 bg-slate-800/30 rounded border border-slate-700">
                    <span className="font-semibold text-gray-300">AI Employee Assist in Inbox</span>
                    <span className="font-bold text-slate-300">{Math.round(calculations.inboxMonthly)}</span>
                  </div>
                )}
                {calculations.commentsMonthly > 0 && (
                  <div className="flex justify-between p-3 bg-slate-800/30 rounded border border-slate-700">
                    <span className="font-semibold text-gray-300">AI Comments</span>
                    <span className="font-bold text-slate-300">{Math.round(calculations.commentsMonthly)}</span>
                  </div>
                )}
                {calculations.paidReplies > 0 && (
                  <div className="flex justify-between p-3 bg-slate-800/30 rounded border border-slate-700">
                    <span className="font-semibold text-gray-300">AI Replies (paid)</span>
                    <span className="font-bold text-slate-300">{Math.round(calculations.paidReplies)}</span>
                  </div>
                )}
                {calculations.voicemailMonthly > 0 && (
                  <div className="flex justify-between p-3 bg-slate-800/30 rounded border border-slate-700">
                    <span className="font-semibold text-gray-300">Voicemail Drops</span>
                    <span className="font-bold text-slate-300">{Math.round(calculations.voicemailMonthly)}</span>
                  </div>
                )}
                {calculations.smsMonthly > 0 && (
                  <div className="flex justify-between p-3 bg-slate-800/30 rounded border border-slate-700">
                    <span className="font-semibold text-gray-300">SMS Messages</span>
                    <span className="font-bold text-slate-300">{Math.round(calculations.smsMonthly)}</span>
                  </div>
                )}
                {featureVolumes.aiReplies && calculations.paidReplies < 0 && (
                  <div className="flex justify-between p-3 bg-slate-700/50 rounded border border-slate-600">
                    <span className="font-semibold text-gray-300">AI Replies (FREE within 250)</span>
                    <span className="font-bold text-slate-300">Included</span>
                  </div>
                )}

                <div className="border-t border-slate-700 pt-3 flex justify-between p-3 bg-slate-800/50 rounded">
                  <span className="font-bold text-lg text-gray-100">TOTAL MONTHLY</span>
                  <span className="font-bold text-2xl text-slate-300">{calculations.ongoingTotal}</span>
                </div>
              </div>
            </div>

            {/* Plan Options */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl p-8 relative overflow-hidden">
              {/* Gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-400"></div>
              {/* Subtle gradient accents */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-400/10 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-600/10 to-transparent rounded-full blur-2xl"></div>
              <h2 className="text-xl font-bold text-gray-100 mb-6 relative z-10">Plan Options</h2>
              <div className="grid grid-cols-3 gap-4">
                {(Object.entries(planDetails) as [PlanName, PlanDetail][]).map(([planName, info]) => (
                  <PlanCard
                    key={planName}
                    planName={planName}
                    info={info}
                    suitability={calculations.planSuitability[planName]}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCalculator;
