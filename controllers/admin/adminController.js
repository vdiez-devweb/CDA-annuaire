export const dashboard = async (req, res, next) => {
    // const categories = await Category.find({});

    res.render("admin/dashboard", {
        title: "Panneau d'administration",
        // categories: categories,
        message: "bienvenue sur le Panneau d'administration Concept Institut"
    });
};