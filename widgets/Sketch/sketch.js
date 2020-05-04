define([
  "esri/widgets/Expand",
  "esri/widgets/Sketch",
  "esri/layers/GraphicsLayer",
], (Expand, Sketch, GraphicsLayer) => {
  const graphicsLayer = new GraphicsLayer({listMode:'hide'});
  const load = (view) => {
    const sketch = new Sketch({
      layer: graphicsLayer,
      view: view,
    });

    view.map.layers.add(graphicsLayer);
    const expand = new Expand({
      expandIconClass: "esri-icon-edit",
      view: view,
      content: sketch,
    });
    view.ui.add(expand, "top-left");
  };

  return { load };
});
