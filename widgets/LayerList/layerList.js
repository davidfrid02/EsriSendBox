define(["esri/widgets/Expand", "esri/widgets/LayerList"], (
  Expand,
  LayerList
) => {
  const load = (view) => {
    var layerList = new LayerList({
      view: view,
    });

    const expand = new Expand({
      expandIconClass: "esri-icon-layer-list",
      view: view,
      content: layerList,
    });
    view.ui.add(expand, "top-right");
  };

  return { load };
});
