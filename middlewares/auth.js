
// middleware to test if authenticated
export const isAuthenticated = (req, res, next) => {
    //console.log(req.session);
    // next(); //! pour passer l'étape d'authentification en dev
    if (req.session.authenticated && req.session.user) next() //TODO vérifications à durcir
    else res.redirect("/admin/login/")
  };