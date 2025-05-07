import 'dotenv/config';
import { Client as ElasticClient } from '@elastic/elasticsearch';

//elastic search client setup
const elasticClient = new ElasticClient({
    node: process.env.ELASTICSEARCH_HOST
})

//check elasticsearch connection on server startup
async function checkElasticConnection (){
    try{
        //ping is used in ES v7.x, for v8+ use info() or perform a simple query
        await elasticClient.ping({}, {requestTimeout: 3000});
        console.log("ElasticSearch Client Connected");
    }
    catch(error){
        console.log("ElasticSearch Connection failed");
        console.log(error);
    }
}
checkElasticConnection();

export default elasticClient;
