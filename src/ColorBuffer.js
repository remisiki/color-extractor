import Color from "./Color";

/**
 * A buffer of color, used for clustering
 */
export default class ColorBuffer {
  /**
   * Construct from canvas image data
   * @param {ImageData} imageData
   */
  constructor(imageData) {
    this.data = [];
    for (let i = 0; i < imageData.data.length; i += 4) {
      this.data.push(
        Color.fromRgb(
          imageData.data[i],
          imageData.data[i + 1],
          imageData.data[i + 2],
        ),
      );
    }
  }

  /**
   * Cluster colors using k-means. Runs asynchronously and may not end if input image is too large.
   * @param {number} k number of clusters
   * @return {Promise[Color[]]} k major colors, sorted by lightness
   */
  async cluster(k = 5) {
    // Init centroids evenly distributed over the image
    let centroids = Array.from({ length: k }, (_, i) => {
      const idx = i * Math.floor(this.data.length / k);
      return this.data[idx];
    });

    while (true) {
      // Assign each pixel to the closest centroid
      this.data.forEach((color) => {
        let minDistance = Infinity;
        let cluster = 0;
        centroids.forEach((centroid, i) => {
          let distance = Color.dist(color, centroid);
          if (distance < minDistance) {
            minDistance = distance;
            cluster = i;
          }
        });
        color.cluster = cluster;
      });

      // Calculate new centroids
      let tot = Array.from({ length: centroids.length }, () => ({
        l: 0,
        a: 0,
        b: 0,
      }));
      let cnt = Array(centroids.length).fill(0);
      this.data.forEach((color) => {
        tot[color.cluster].l += color.l;
        tot[color.cluster].a += color.a;
        tot[color.cluster].b += color.b;
        cnt[color.cluster]++;
      });
      const newCentroids = centroids.map((c, i) =>
        cnt[i] === 0
          ? c
          : new Color(tot[i].l / cnt[i], tot[i].a / cnt[i], tot[i].b / cnt[i]),
      );

      // Check if centroids have changed
      if (
        centroids.every(
          (centroid, i) => Color.dist(centroid, newCentroids[i]) < 1,
        )
      ) {
        break;
      }
      centroids = newCentroids;
    }

    // Sort colors by lightness
    centroids.sort((a, b) => b.l - a.l);

    return centroids;
  }
}
