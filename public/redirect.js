(function () {
  const params = new URLSearchParams(window.location.search);
  const redirectTo = params.get('redirect');

  if (redirectTo && redirectTo !== location.pathname + location.search) {
    history.replaceState(null, null, redirectTo + location.hash);
  }
})();
