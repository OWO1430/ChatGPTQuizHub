const { MongoClient, ObjectId } = require('mongodb');
const { getCurrentTime } = require('../../utils/utils');
require('dotenv').config({ path: __dirname + `/../../.env` });
const axios = require('axios');


const url = process.env.MONGOURL;
const dbName = 'GPTQuizHub';

const quizCreate = async (req, res) => {
    console.log('quizcreate')
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        const user_id = new ObjectId(req.signInId);
        const article = req.body.article;
        const total = ['easy', 'normal', 'hard'].reduce((sum, key) => sum + parseInt(article[key]), 0);
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);

        const quizzesCollection = db.collection('quizzes');
        
        const quizData = {
            user_id: user_id,
            title: article.title,
            content: article.content,
            is_deleted: false,
            status: "pending",
            created_at: getCurrentTime()
        };
        
        if (article.tag) {
            quizData.tag = article.tag;
        }
        
        const insertQuiz = await quizzesCollection.insertOne(quizData);

        const data = {
            user_id: req.signInId,
            article,
            total,
            insertQuiz
        }

        axios.post(process.env.GPTURL, data, { timeout: 600000 });

        console.log('gptres')
        res.status(200).json({
            data: {
                quiz: {id: insertQuiz.insertedId}
            }
        });
        return
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error." })
    } finally {
        console.log('client close')
        await client.close();
    }
}

module.exports = {
    quizCreate
  };
