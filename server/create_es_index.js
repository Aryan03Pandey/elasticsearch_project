import dbPool from "./db.js";
import elasticClient from "./elasticsearch.js";
import 'dotenv/config';

const indexName = 'products';

async function createIndex() {
  try {
    // Check if index already exists
    const exists = await elasticClient.indices.exists({ index: indexName });
    if (!exists.body) {
      await elasticClient.indices.create({
        index: indexName,
        body: {
          settings: {
            number_of_shards: 1, // Adjust for production
            number_of_replicas: 0 // Adjust for production
          },
          mappings: {
            properties: {
              id: { type: 'integer' }, // Store DB ID
              title: { type: 'text' }, // Full-text search
              description: { type: 'text' }, // Full-text search
              features: { // Index features JSONB
                properties: {
                  color: { type: 'text' }, // Example feature: color
                  screen_size: { type: 'text' }, // Example feature: screen_size
                  // Add other common features here as 'text' or 'keyword' depending on search needs
                  // dynamic: true // Consider dynamic mapping if features vary widely
                }
              }
            }
          }
        }
      });
      console.log(`Index '${indexName}' created.`);
    } else {
      console.log(`Index '${indexName}' already exists.`);
    }
  } catch (error) {
    console.error('Error creating index:', error);
  }
}

async function indexProducts() {
  try {
    const res = await dbPool.query('SELECT * FROM products');
    const products = res.rows;

    const operations = products.flatMap(product => [
      { index: { _index: indexName, _id: product.id } }, // Action: index, specify index and document ID
      { // Document body
        id: product.id,
        title: product.title,
        description: product.description,
        features: product.features // Elasticsearch can index JSON fields
      }
    ]);

    // Bulk index the documents
    const bulkResponse = await elasticClient.bulk({ refresh: true, operations });

    if (bulkResponse.errors) {
      console.error('Bulk indexing errors:', JSON.stringify(bulkResponse.items.filter(item => item.index.error), null, 2));
    } else {
      console.log(`Successfully indexed ${products.length} products.`);
    }

  } catch (error) {
    console.error('Error indexing products:', error);
  } finally {
  }
}

// Run the indexing process
async function setupAndIndex() {
    await createIndex();
    await indexProducts();
}

setupAndIndex();