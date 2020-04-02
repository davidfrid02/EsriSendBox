define(() => {
  const load = view => {
    require(["esri/widgets/Expand", "esri/widgets/Bookmarks"], function(
      Expand,
      Bookmarks
    ) {
      const bookmarks = new Bookmarks({
        view: view,
        editingEnabled: true
      });

      const expand = new Expand({
        expandIconClass: "esri-icon-bookmark",
        view: view,
        content: bookmarks
      });
      view.ui.add(expand, "top-left");
    });
  };

  return { load };
});
