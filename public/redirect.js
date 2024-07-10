// public/redirect.js
(function () {
  const redirectTo = sessionStorage.redirectTo;
  delete sessionStorage.redirectTo;
  if (redirectTo && redirectTo !== location.href) {
    history.replaceState(null, null, redirectTo);
  }
})();
