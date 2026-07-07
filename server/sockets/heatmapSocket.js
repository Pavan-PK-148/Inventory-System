import Product from '../models/Warehouse.js'; // Using Product model directly
import ProductModel from '../models/Product.js'; 

export default (io) => {
  io.on('connection', (socket) => {
    
    socket.on('get_heatmap_init', async (warehouseName) => {
      try {
        // 1. Query real-time metrics across all items stored in this warehouse
        const products = await ProductModel.find({ warehouseLocation: warehouseName });

        // 2. Initialize our default map array structures
        const sectionsMap = {
          "A1": { stockLevel: 0, utilization: 0, temperature: 18, activity: "LOW" },
          "A2": { stockLevel: 0, utilization: 0, temperature: 19, activity: "LOW" },
          "A3": { stockLevel: 0, utilization: 0, temperature: 21, activity: "LOW" },
          "A4": { stockLevel: 0, utilization: 0, temperature: 17, activity: "LOW" },
          "B1": { stockLevel: 0, utilization: 0, temperature: 22, activity: "LOW" },
          "B2": { stockLevel: 0, utilization: 0, temperature: 20, activity: "LOW" },
          "B3": { stockLevel: 0, utilization: 0, temperature: 24, activity: "LOW" },
          "B4": { stockLevel: 0, utilization: 0, temperature: 18, activity: "LOW" },
        };

        // 3. Deterministically aggregate active item quantities using SKU string endings
        products.forEach(product => {
          const skuStr = product.sku || '';
          const lastChar = skuStr.trim().slice(-1);
          let targetSection = "A1"; 

          if (['1', '5'].includes(lastChar)) targetSection = "A1";
          else if (['2', '6'].includes(lastChar)) targetSection = "A2";
          else if (['3', '7'].includes(lastChar)) targetSection = "A3";
          else if (['4', '8'].includes(lastChar)) targetSection = "A4";
          else if (['9', 'A', 'E'].includes(lastChar)) targetSection = "B1";
          else if (['0', 'B', 'F'].includes(lastChar)) targetSection = "B2";
          else if (['C', 'G', 'M'].includes(lastChar)) targetSection = "B3";
          else targetSection = "B4";

          sectionsMap[targetSection].stockLevel += product.quantity;
        });

        // 4. Calculate dynamic utilization percentages and intensity markers based on stock depth
        const sectionsArray = Object.keys(sectionsMap).map(key => {
          const stock = sectionsMap[key].stockLevel;
          // Dynamically scale utilization based on a maximum cap threshold of 120 items per bay
          const utilization = Math.min(Math.round((stock / 120) * 100), 100);
          let activity = "LOW";
          if (stock > 50) activity = "HIGH";
          else if (stock > 15) activity = "MEDIUM";

          return {
            sectionId: key,
            stockLevel: stock,
            utilization: utilization,
            temperature: sectionsMap[key].temperature,
            activity: activity
          };
        });

        // Send out the computed state down the socket stream
        socket.emit('warehouse_update', {
          name: warehouseName,
          sections: sectionsArray
        });

      } catch (err) {
        console.error("Heatmap socket dynamic retrieval error:", err);
      }
    });

  });
};