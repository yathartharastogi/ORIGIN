const validate = (
  schema,
  source = "body"
) => {
  return (req, res, next) => {
    const result = schema.safeParse(
      req[source]
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request data.",
          details: result.error.issues.map(
            (issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            })
          ),
        },
        meta: {
          requestId: req.id,
        },
      });
    }

    /*
     * req.query is read-only in the current
     * Express/Node setup, so don't replace it.
     *
     * Store validated query data separately.
     */

    if (source === "query") {
      req.validatedQuery = result.data;
    } else {
      req[source] = result.data;
    }

    next();
  };
};

export {
  validate,
};