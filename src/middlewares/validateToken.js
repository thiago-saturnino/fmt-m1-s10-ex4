const jwt = require("jsonwebtoken");

function validateToken(req, res, next) {
  console.log(req.headers.authorization);
  const token = req.headers.authorization;

  console.log(token);

  if (!token || token === "Bearer") {
    return res.status(403).json({ message: "Token ausente!" });
  }

  const tokenJwt = token.slice(7);
  console.log(tokenJwt);

  jwt.verify(tokenJwt, "MINHA_CHAVE_TOKEN", (error, conteudoDoToken) => {
    if (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(403).json({ message: "Atenção! Token expirado." });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(403).json({ message: "Token não está válido." });
      } else {
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
    } else {
      req.body.user_id = conteudoDoToken.id;
      return next();
    }
  });
}

module.exports = validateToken;
