const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    const issues = err.issues || err.errors;
    res.status(400).json({
      success: false,
      message: issues ? issues.map(e => e.message).join(', ') : 'Validation error'
    });
  }
};

module.exports = { validate };
