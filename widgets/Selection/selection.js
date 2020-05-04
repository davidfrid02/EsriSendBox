define(["esri/widgets/Sketch/SketchViewModel", "esri/layers/GraphicsLayer"], (
  SketchViewModel,
  GraphicsLayer
) => {
  const graphicsLayer = new GraphicsLayer({ listMode: "hide" });
  const load = (view) => {
    view.map.layers.add(graphicsLayer);
    var sketchVM = new SketchViewModel({
      layer: graphicsLayer,
      view: view,
    });

    view.on("pointer-down", ["Ctrl"], (event) => {
      sketchVM.create("rectangle");
    });

    view.on("pointer-down", (event)=>{
      if(event.buttons === 0){
        //remove selection
      }
    })

    let selectionActive = false;
    sketchVM.on("create", function (event) {
      if (event.state === "active") {
        selectionActive = true;
        }
      if (event.state === "complete") {
        if(selectionActive){
          //Filter
          //event.graphic.geometry.extent
          console.log("rectangle")
        }else{
          //Filter this lat, long
          //event.graphic.geometry.centroid.latitude, event.graphic.geometry.centroid.longitude
          console.log("point")
        }
        selectionActive = false;
        graphicsLayer.remove(event.graphic)
      }
    });
  };

  return { load };
});
