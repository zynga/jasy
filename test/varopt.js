function outer(alpha, beta, gamma) {
  function inner() {}
  var result = alpha * beta + gamma;
  var doNot = result.alpha.beta.gamma;
  return result * outer(alpha, beta, gamma);
}
