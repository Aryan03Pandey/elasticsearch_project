//imports
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import elasticClient from './elasticsearch.js';
import dbPool from './db.js';


//Express App Setup
const app = express();
const port = process.env.PORT || 4000;

//middlewares
app.use(express.json());
app.use(cors());

//Search Route Implementation
const productIndexName = 'products'; //the name of the elasticsearch index for products

app.get('/api/search', async (req, res) => {
    const query = req.query.q;

    if(!query){
        return res.status(400).json({message: 'Search Query cannot be empty'});
    }

    try{
        //perform the search query in elasticsearch
        //using multi-match to search across multiple fields
        const searchResponse = await elasticClient.search({
            index: productIndexName,
            body: {
                query: {
                    multi_match: {
                        query: query,
                        fields: ['title^3', 'description', 'features.color', 'features.screen_size'],
                        fuzziness: 'AUTO'
                    }
                }
            }
        });

        //extract hits (search results)
        const hits = searchResponse.hits.hits;

        const results = hits.map(hit => ({
            _id: hit._id,
            _score: hit._score,
            ...hit._source
        }));

        res.json({
            total: searchResponse.hits.total.value,
            results: results
        });

    }
    catch(error){
        console.log("Error doing elasticsearch query");
        res.status(500).json({message: "Internal server error, try again later", error: error.message})
    }
})


//start the server
const server = app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log('Ensure your Docker containers (db, elasticsearch, kibana) are running.');
    console.log(`Kibana is likely available at http://localhost:5601`);
})

//Handle Graceful shutdown
//Ensure the database connections are closed on server shutdown
process.on("SIGINT", async () => {
    console.log("SIGINT signal recieved, shutting down server");
    server.close(async (error) => {
        if(error){
            console.log("Error closing server: ", error);
        }

        try{
            await dbPool.end();
            console.log("Database connection closed");
        }
        catch(dbErr){
            console.log("Error closing database connection: ", dbErr);
        }

        console.log("Shutting server gracefully");
        process.exit(0);
    })
})