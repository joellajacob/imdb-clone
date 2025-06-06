const envConfig = {
    port: process.env.PORT || 3001,
    tmdbAPIKey: process.env.TMDB_API_KEY,
    tmdbBaseImgURL:  process.env.TMDB_SECURE_BASE_URL,
    youtubeBaseURL: process.env.YOUTUBE_BASE_URL
}

export default envConfig;
