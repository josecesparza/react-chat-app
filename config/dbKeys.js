if(process.env.NODE_ENV === 'production') {
    module.exports = {
            mongoURI: 'mongodb+srv://admin:dbAdmin2020@cluster0-g7y2f.mongodb.net/react-chat-app?retryWrites=true&w=majority' }; // Add your remote db connection string here
} else {
    module.exports = {
            mongoURI: 'mongodb+srv://admin:dbAdmin2020@cluster0-g7y2f.mongodb.net/react-chat-app?retryWrites=true&w=majority' }; // Add your local db connection string here
}