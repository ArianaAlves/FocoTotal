export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error Details:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body
  });

  // Diferentes tipos de erro com status codes apropriados
  if (err.message.includes("E-mail já cadastrado")) {
    return res.status(409).json({ message: err.message });
  }

  if (err.message.includes("Usuário não encontrado") || err.message.includes("Senha incorreta")) {
    return res.status(401).json({ message: err.message });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  // Erro genérico do servidor
  res.status(500).json({
    message: "Erro interno do servidor",
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};
