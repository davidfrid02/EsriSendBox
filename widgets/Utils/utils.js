define(["esri/Graphic", "esri/layers/FeatureLayer"], (
  Graphic,
  FeatureLayer
) => {
  const load = (view) => {
    const featureLayer = createFeature();
    view.map.layers.add(featureLayer);
  };

  const createFeature = () =>{
    const pointCount = 1000;

    const createPoints = (extent, count = 100) => {
      return [...Array(count)].map((_, i) => {
        let location = randomPointInRect(extent);
        let point = {
          type: "point", // autocasts as new Point()
          x: location.x,
          y: location.y,
        };
        return {
          geometry: point,
          attributes: {
            ObjectID: i,
            SymbolId: i % 50,
            ProjectName: "Proj" + (i % 10),
            SiteName: "SiteA",
          },
        };
      });
    };

    const randomPointInRect = ({ xmin, ymin, xmax, ymax }) => {
      return {
        x: xmin + Math.random() * (xmax - xmin),
        y: ymin + Math.random() * (ymax - ymin),
      };
    };

    const features = createPoints(
      {
        xmin: 30,
        xmax: 40,
        ymin: 30,
        ymax: 40,
      },
      pointCount
    );

    const getRandomColor = () => {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    const uniqueValues = [...Array(pointCount / 2)].map((_, i) => {
      return {
        // All features with value of "North" will be blue
        value: i,
        symbol: {
          type: "simple-marker",
          size: i < 10 ? 10 : i, // autocasts as new SimpleFillSymbol()
          color: getRandomColor(),
        },
      };
    });
    var renderer = {
      type: "unique-value", // autocasts as new UniqueValueRenderer()
      field: "SymbolId",
      defaultSymbol: { type: "simple-fill" }, // autocasts as new SimpleFillSymbol()
      uniqueValueInfos: uniqueValues,
    };

    const featureLayer = new FeatureLayer({
      source: features,
      renderer: renderer,
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
  }

  return { load };
});
