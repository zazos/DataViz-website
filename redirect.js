(function () {
  const redirectTo = sessionStorage.redirectTo;
  delete sessionStorage.redirectTo;
  if (redirectTo && redirectTo !== location.href) {
    history.replaceState(null, null, redirectTo);
  }

  // Handle hash-based routing
  if (location.hash && location.hash.startsWith("#")) {
    const path = location.hash.substring(1); // Get the path without the hash symbol
    history.replaceState(null, null, path);
  }
})();
