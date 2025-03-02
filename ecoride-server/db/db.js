import mongoose from 'mongoose';

const connectToDb=()=> {
    mongoose.connect(process.env.DB_CONNECT
    ).then(() => {
        console.log('Connected to DB');
    }).catch(err => console.log(err));
}

export default connectToDb;
