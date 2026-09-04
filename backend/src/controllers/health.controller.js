const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: "LedgerLens Backend",
      status: "healthy",
      timestamp: new Date().toISOString(),
    },
    error: null,
    meta: {
      requestId: req.requestId,
    },
  });
};

export { getHealth };