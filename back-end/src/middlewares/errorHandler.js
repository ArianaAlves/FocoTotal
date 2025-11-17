export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error Details:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    name: err.name,
    code: err.code
  });

  // Erro de conexão com banco
  if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      message: "Serviço temporariamente indisponível",
      error: "Database connection failed"
    });
  }

  // Erro do Prisma
  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: "E-mail já cadastrado" });
    }
    return res.status(400).json({ message: "Erro na operação do banco de dados" });
  }

  if (err.name === 'PrismaClientUnknownRequestError' || err.name === 'PrismaClientInitializationError') {
    return res.status(500).json({ message: "Erro de conexão com banco de dados" });
  }

  // Diferentes tipos de erro com status codes apropriados
  if (err.message.includes("E-mail já cadastrado")) {
    return res.status(409).json({ message: err.message });
  }

  if (err.message.includes("Usuário não encontrado") || err.message.includes("Senha incorreta")) {
    return res.status(401).json({ message: err.message });
  }

  if (err.name === 'ValidationError' || err.name === 'ZodError') {
    return res.status(400).json({
      message: "Dados inválidos",
      details: err.message
    });
  }

  // Erro genérico do servidor
  res.status(500).json({
    message: "Erro interno do servidor",
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    timestamp: new Date().toISOString()
  });
};
