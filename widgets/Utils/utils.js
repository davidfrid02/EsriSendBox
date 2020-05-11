define([
  "esri/Graphic",
  "esri/layers/FeatureLayer",
  "esri/layers/GraphicsLayer",
], (Graphic, FeatureLayer, GraphicsLayer) => {

  const createPoints = ({ xmin, ymin, xmax, ymax }, count = 100) => {
    return [...Array(count)].map((_, i) => {
      let location = {
        x: xmin + Math.random() * (xmax - xmin),
        y: ymin + Math.random() * (ymax - ymin),
      };
      let point = {
        type: "point", // autocasts as new Point()
        x: location.x,
        y: location.y,
      };
      return {
        geometry: point,
        attributes: {
          ObjectID: i,
          SymbolId: i,
          ProjectName: "Proj" + (i % 10),
          SiteName: "SiteA",
        },
      };
    });
  };
  let points = createPoints(
    {
      xmin: 30,
      xmax: 40,
      ymin: 30,
      ymax: 40,
    },
    100
  );
  const load = (view) => {
    const featureLayerPoints = createFeatureLayerPoints();
    //const graphicLayerSymbol = createGraphicLayerSymbol();
    const featureLayerUniqueValueText = createFeatureLayerUniqueValueText();

    view.map.layers.add(featureLayerPoints);
    //view.map.layers.add(graphicLayerSymbol);
    view.map.layers.add(featureLayerUniqueValueText);
  };

  const createFeatureLayerPoints = () => {
    const featureLayer = new FeatureLayer({
      title: "FeatureLayer",
      source: points,
      renderer: {
        type: "simple", // autocasts as new SimpleRenderer()
        symbol: {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          size: 35,
          color: "blue",
          outline: {
            // autocasts as new SimpleLineSymbol()
            width: 0.5,
            color: "white",
          },
        },
      },
      objectIDField: "ObjectID",
      popupTemplate: {
        title: "{ProjectName}",
        content: "{SymbolId}",
      },
      fields: [
        {
          name: "ObjectID",
          alias: "ObjectID",
          type: "oid",
        },
        {
          name: "ProjectName",
          alias: "ProjectName",
          type: "string",
        },
        {
          name: "SiteName",
          alias: "SiteName",
          type: "string",
        },
        {
          name: "SymbolId",
          alias: "SymbolId",
          type: "integer",
        },
      ],
    });
    return featureLayer;
  };

  const createGraphicLayerSymbol = () => {
    let graphics = points.map((point) => {
      return {
        geometry: point.geometry,
        symbol: getSymbol({
          text: point.attributes.SymbolId,
          color: "white",
          fontSize: 14,
          yOffset: 12,
          xOffset: 15,
        }),
      };
    });

    var graphicsLayer = new GraphicsLayer({
      title: "GraphicLayer",
    });
    graphicsLayer.addMany(graphics);
    return graphicsLayer;
  };

  const createFeatureLayerUniqueValueText = () => {
    let uniqueValues = [];
    for (point of points) {
      uniqueValues.push({
        value: point.attributes.SymbolId,
        symbol: getSymbol({
          text: point.attributes.SymbolId,
          color: "red",
          fontSize: 24,
          yOffset: 12,
          xOffset: -15,
        }),
      });
    }

    var renderer = {
      type: "unique-value", // autocasts as new UniqueValueRenderer()
      field: "SymbolId",
      uniqueValueInfos: uniqueValues,
    };

    const featureLayer = new FeatureLayer({
      source: points,
      objectIdField: "OBJECTID",
      renderer: renderer,
      fields: [
        {
          name: "ObjectID",
          alias: "ObjectID",
          type: "oid",
        },
        {
          name: "SymbolId",
          alias: "SymbolId",
          type: "integer",
        },
      ],
    });
    return featureLayer;
  };

  let getSymbol = ({ text, color, fontSize, yOffset, xOffset }) => {
    return {
      type: "text", // autocasts as new TextSymbol()
      color: color,
      haloColor: "black",
      haloSize: "1px",
      text: text,
      xoffset: xOffset,
      yoffset: yOffset,
      font: {
        // autocasts as new Font()
        size: fontSize,
        family: "Josefin Slab",
        weight: "bold",
      },
    };
  };

  return { load };
});
