import { randomUUID } from "crypto";

import {
  findMany,
  findByInvestigationId,
} from "../repositories/investigation.repository.js";

import {
  findByTransactionId,
} from "../repositories/transaction.repository.js";

import {
  create,
} from "../repositories/investigation.repository.js";

import {
  collectEvidence,
} from "../evidence/evidence.service.js";

import {
  normalizeEvidence,
} from "../evidence/evidence.normalizer.js";

import {
  calculateEvidenceScore,
} from "../evidence/evidence.scorer.js";

import {
  reconcileTransaction,
} from "../reconciliation/reconciliation.engine.js";

import {
  createInvestigationContext,
  transitionState,
  runInvestigationAI,
  completeInvestigation,
  failInvestigation,
} from "../orchestrator/investigation.orchestrator.js";

import {
  INVESTIGATION_STATES,
} from "../orchestrator/state.machine.js";

import {
  createAgentRegistry,
} from "../orchestrator/agent.registry.js";

import {
  runRootCauseAgent,
} from "../agents/rootCause.agent.js";

import {
  runResolutionAgent,
} from "../agents/resolution.agent.js";

import {
  runSupportAgent,
} from "../agents/support.agent.js";


/*
 * Create the agent registry once.
 */

const agentRegistry = createAgentRegistry({
  rootCauseAgent: runRootCauseAgent,
  resolutionAgent: runResolutionAgent,
  supportAgent: runSupportAgent,
});

const getInvestigation = async (id) => {
  const investigation =
  await findByInvestigationId(id);

  if (!investigation) {
    const error = new Error(
      "Investigation was not found."
    );

    error.code = "INVESTIGATION_NOT_FOUND";
    error.statusCode = 404;

    throw error;
  }

  return investigation;
};

const startInvestigation = async ({
  transactionId,
  userId,
}) => {

  /*
   * 1. Find canonical transaction
   */

  const transaction =
    await findByTransactionId(transactionId);

  if (!transaction) {
    const error = new Error(
      "Transaction was not found."
    );

    error.code = "TRANSACTION_NOT_FOUND";
    error.statusCode = 404;

    throw error;
  }


  /*
   * 2. Create investigation context
   */

  let context =
    createInvestigationContext({
      investigationId:
        `INV-${randomUUID()}`,

      transactionId,

      userId,
    });


  try {

    /*
     * CREATED
     * ↓
     * COLLECTING_EVIDENCE
     */

    context = transitionState(
      context,
      INVESTIGATION_STATES.COLLECTING_EVIDENCE
    );


    /*
     * 3. Collect evidence
     */

    const rawEvidence =
      await collectEvidence(
        transactionId
      );


    /*
     * COLLECTING_EVIDENCE
     * ↓
     * EVIDENCE_READY
     */

    context = transitionState(
      context,
      INVESTIGATION_STATES.EVIDENCE_READY
    );


    context = {
      ...context,

      evidence:
        normalizeEvidence(
          rawEvidence
        ),
    };

    const evidenceScore =
  calculateEvidenceScore(
    context.evidence
  );


    /*
     * EVIDENCE_READY
     * ↓
     * RECONCILING
     */

    context = transitionState(
      context,
      INVESTIGATION_STATES.RECONCILING
    );


    /*
     * 4. Deterministic reconciliation
     */

    const reconciliation =
      reconcileTransaction({
        transaction,

        evidence:
          context.evidence,
      });


    /*
     * RECONCILING
     * ↓
     * RECONCILED
     */

    context = transitionState(
      context,
      INVESTIGATION_STATES.RECONCILED
    );


    context = {
      ...context,

      reconciliation,
    };


    /*
     * 5. Run AI pipeline
     *
     * Routing policy decides which agents
     * actually need to run.
     */

    context =
      await runInvestigationAI({
        context,

        transaction,

        agentRegistry,
      });


    /*
     * 6. Complete investigation
     */

    if (
      context.state !==
      INVESTIGATION_STATES.COMPLETED
    ) {
      context =
        completeInvestigation(
          context
        );
    }


    /*
     * 7. Persist investigation
     */

    const investigation =
  await create({
        investigationId:
          context.investigationId,

        transactionId:
          context.transactionId,

        initiatedBy:
          context.userId,

        status:
          context.state,

        severity:
          reconciliation.severity,

        evidenceScore,

        overallFinding:
          reconciliation.overallFinding,

        anomalies:
          reconciliation.findings,

        evidenceSnapshot:
          context.evidence,

        reconciliation,

        aiAnalysis: {
          rootCause:
            context.rootCause,

          resolution:
            context.resolution,

          support:
            context.supportSummary,
        },

        startedAt:
          rawEvidence.collectedAt,

        completedAt:
          new Date(),
      });


    return investigation;

  } catch (error) {

    /*
     * Any unexpected failure moves
     * the investigation into FAILED.
     */

    context =
      failInvestigation(
        context,
        error
      );


    console.error(
      "Investigation failed:",
      error.message
    );


    throw error;
  }
};

const getInvestigations = async ({
  page = 1,
  limit = 10,
  transactionId,
  severity,
  overallFinding,
  status,
}) => {
  const result = await findMany({
    page,
    limit,
    transactionId,
    severity,
    overallFinding,
    status,
  });

  const totalPages =
    Math.ceil(result.total / limit);

  return {
    investigations:
      result.investigations,

    pagination: {
      page,
      limit,
      total: result.total,
      totalPages,
      hasNextPage:
        page < totalPages,
      hasPreviousPage:
        page > 1,
    },
  };
};


export {
  startInvestigation,
  getInvestigation,
    getInvestigations,
};