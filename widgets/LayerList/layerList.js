define([
  "esri/widgets/Expand",
  "esri/widgets/LayerList",
  "esri/layers/FeatureLayer",
], (Expand, LayerList, FeatureLayer) => {
  let featureLayerPortal;
  const load = (view) => {
    var layerList = new LayerList({
      view: view,
      listItemCreatedFunction: defineActions,
    });

    const expand = new Expand({
      expandIconClass: "esri-icon-layer-list",
      view: view,
      content: layerList,
    });
    view.ui.add(expand, "top-right");

    const labelClass = {
      // autocasts as new LabelClass()
      symbol: {
        type: "text", // autocasts as new TextSymbol()
        color: "green",
        font: {
          // autocast as new Font()
          family: "Playfair Display",
          size: 18,
          weight: "bold",
        },
      },
      labelPlacement: "above-center",
      labelExpressionInfo: {
        expression: "$feature.MARKER_ACTIVITY",
      },
    };

    featureLayerPortal = new FeatureLayer({
      portalItem: {
        // autocasts as new PortalItem
        id: "6012738cd1c74582a5f98ea30ae9876f",
      },
    });

    featureLayerPortal.labelingInfo = [labelClass];
    view.map.add(featureLayerPortal);




  };
  const changeTextSize = (event)=>{
    featureLayerPortal.labelingInfo[0].symbol.font.size = event.target.selectedOptions[0].value;
    var citiesRenderer = {
      type: "simple",  // autocasts as new SimpleRenderer()
      symbol: { type: "simple-fill" },  // autocasts as new SimpleFillSymbol()
    };
    featureLayerPortal.renderer = citiesRenderer;
  }

  const changeColor = (event)=>{
    featureLayerPortal.labelingInfo[0].symbol.color = event.target.selectedOptions[0].value;
    var citiesRenderer = {
      type: "simple",  // autocasts as new SimpleRenderer()
      symbol: { type: "simple-fill" },  // autocasts as new SimpleFillSymbol()
    };
    featureLayerPortal.renderer = citiesRenderer;
  }


  const defineActions = (event) => {  
    // The event object contains an item property.
    // is is a ListItem referencing the associated layer
    // and other properties. You can control the visibility of the
    // item, its title, and actions using this object.

    var item = event.item;
    const selectBoxElement = document.createElement("select");
    selectBoxElement.appendChild(createOptionElement("green"));
    selectBoxElement.appendChild(createOptionElement("red"));
    selectBoxElement.appendChild(createOptionElement("blue"));
    selectBoxElement.onchange = changeColor;

    const selectBoxElement2 = document.createElement("select");
    selectBoxElement2.appendChild(createOptionElement("10pt"));
    selectBoxElement2.appendChild(createOptionElement("20pt"));
    selectBoxElement2.appendChild(createOptionElement("30pt"));
    selectBoxElement2.onchange = changeTextSize;

    // An array of objects defining actions to place in the LayerList.
    // By making this array two-dimensional, you can separate similar
    // actions into separate groups with a breaking line.

    item.panel = {
      content: [selectBoxElement, selectBoxElement2]
    };
  }

  const createOptionElement = (value) => {
    const optionElement = document.createElement("option");
    optionElement.value = value;
    optionElement.innerText = value;

    return optionElement;
  };
  return { load };
});
