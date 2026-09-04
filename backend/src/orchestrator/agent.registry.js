const createAgentRegistry = ({
  rootCauseAgent,
  resolutionAgent,
  supportAgent,
}) => {
  if (!rootCauseAgent) {
    throw new Error(
      "Root Cause Agent is required."
    );
  }

  if (!resolutionAgent) {
    throw new Error(
      "Resolution Agent is required."
    );
  }

  if (!supportAgent) {
    throw new Error(
      "Support Agent is required."
    );
  }

  return Object.freeze({
    rootCause: rootCauseAgent,
    resolution: resolutionAgent,
    support: supportAgent,
  });
};

export {
  createAgentRegistry,
};