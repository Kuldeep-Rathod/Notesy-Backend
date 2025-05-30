const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://192.168.200.34:3000',
        `${process.env.CLIENT_URL}`,
    ],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
};

export default corsOptions;
