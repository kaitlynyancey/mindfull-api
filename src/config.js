module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/mindfull',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/mindfull_test',
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL ||
    "http://localhost:3000/api"
  }