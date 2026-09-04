import {
  INVESTIGATION_STATES,
  canTransition,
} from "./state.machine.js";

import {
  getAgentPlan,
} from "./routing.policy.js";


const createInvestigationContext = ({
  investigationId,
  transactionId,
  userId,
}) => {
  return {
    investigationId,
    transactionId,
    userId,

    state: INVESTIGATION_STATES.CREATED,

    evidence: null,
    reconciliation: null,

    rootCause: null,
    resolution: null,
    supportSummary: null,

    error: null,
  };
};


const transitionState = (
  context,
  nextState
) => {
  if (
    !canTransition(
      context.state,
      nextState
    )
  ) {
    throw new Error(
      `Invalid investigation transition: ${context.state} → ${nextState}`
    );
  }

  return {
    ...context,
    state: nextState,
  };
};


const runInvestigationAI = async ({
  context,
  transaction,
  agentRegistry,
}) => {
  const reconciliation =
    context.reconciliation;

  const agentPlan = getAgentPlan({
    overallFinding:
      reconciliation.overallFinding,
  });


  /*
   * No AI required.
   */

  const requiresAI =
    agentPlan.rootCause ||
    agentPlan.resolution ||
    agentPlan.support;

  if (!requiresAI) {
    return context;
  }


  /*
   * Move into AI_ANALYSIS.
   */

  context = transitionState(
    context,
    INVESTIGATION_STATES.AI_ANALYSIS
  );


  /*
   * Root Cause Agent
   */

  if (agentPlan.rootCause) {
    try {
      context.rootCause =
        await agentRegistry.rootCause({
          transaction,
          reconciliation,
        });
    } catch (error) {
      console.error(
        "Root Cause Agent failed:",
        error.message
      );

      context.rootCause = {
        rootCause:
          "Root cause analysis is unavailable.",

        confidence: 0,

        supportingEvidence: [],

        uncertainties: [
          "The AI analysis could not be completed.",
        ],
      };
    }
  }


  /*
   * Resolution Agent
   */

  if (agentPlan.resolution) {
    try {
      context.resolution =
        await agentRegistry.resolution({
          transaction,
          reconciliation,
          rootCause: context.rootCause,
        });
    } catch (error) {
      console.error(
        "Resolution Agent failed:",
        error.message
      );

      context.resolution = {
        recommendedAction:
          "Manual investigation is required.",

        priority:
          reconciliation.severity,

        steps: [
          "Review the reconciliation findings.",
          "Verify the affected source system.",
        ],

        escalationRequired: true,

        escalationReason:
          "Automated resolution analysis was unavailable.",

        uncertainties: [
          "The AI resolution analysis could not be completed.",
        ],
      };
    }
  }


  /*
   * Support Agent
   */

  if (agentPlan.support) {
    try {
      context.supportSummary =
        await agentRegistry.support({
          transaction,
          reconciliation,
          rootCause: context.rootCause,
          resolution: context.resolution,
        });
    } catch (error) {
      console.error(
        "Support Agent failed:",
        error.message
      );

      context.supportSummary = {
        summary:
          "The investigation was completed using deterministic reconciliation.",

        customerMessage:
          "We are reviewing your payment and will provide an update once more information is available.",

        internalNote:
          "AI support analysis was unavailable. Review the reconciliation findings manually.",

        tone: "NEUTRAL",

        uncertainties: [
          "The AI support analysis could not be completed.",
        ],
      };
    }
  }


  /*
   * Return completed context.
   */

  return context;
};


const completeInvestigation = (context) => {
  return transitionState(
    context,
    INVESTIGATION_STATES.COMPLETED
  );
};


const failInvestigation = (
  context,
  error
) => {
  return {
    ...context,
    state: INVESTIGATION_STATES.FAILED,
    error: error.message,
  };
};


export {
  createInvestigationContext,
  transitionState,
  runInvestigationAI,
  completeInvestigation,
  failInvestigation,
};