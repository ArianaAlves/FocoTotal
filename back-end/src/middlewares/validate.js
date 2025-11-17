export const validate =
  (schema) =>
    (req, res, next) => {
      try {
        console.log("🔍 Validating request body:", req.body);
        req.body = schema.parse(req.body);
        console.log("✅ Validation successful");
        next();
      } catch (error) {
        console.error("❌ Validation error:", error);

        if (error.name === 'ZodError') {
          const formattedErrors = error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }));

          return res.status(400).json({
            message: "Erro de validação.",
            errors: formattedErrors,
          });
        }

        return res.status(400).json({
          message: "Erro de validação.",
          error: error.message,
        });
      }
    };
