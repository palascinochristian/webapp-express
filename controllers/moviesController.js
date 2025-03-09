const jwt = require("jsonwebtoken");
const connection = require("../data/db");

// Index
const index = (req, res) => {
  const sql = `SELECT movies.*, ROUND(AVG(reviews.vote)) as avg_vote 
  FROM movies 
  LEFT JOIN reviews ON movies.id = reviews.movie_id 
  GROUP BY movies.id`;
  connection.execute(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Query Error",
        message: `Database query failed: ${sql}`,
      });
    }

    res.json(results);
  });
};

// Show
const show = (req, res) => {
  const { id } = req.params;

  const movieSql = `SELECT movies.*, ROUND(AVG(reviews.vote)) as avg_vote 
  FROM movies 
  LEFT JOIN reviews ON movies.id = reviews.movie_id 
  WHERE movies.id = ? 
  GROUP BY movies.id`;

  connection.execute(movieSql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Query Error",
        message: `Database query failed: ${movieSql}`,
      });
    }
    const movie = results[0];

    if (!movie) {
      return res.status(404).json({
        error: "Not found",
        message: "Film not found",
      });
    }

    const reviewsSql = `
    SELECT * 
    FROM reviews
    WHERE movie_id = ?`;

    connection.execute(reviewsSql, [id], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "Query Error",
          message: `Database query failed: ${reviewsSql}`,
        });
      }

      movie.reviews = results;
      res.json(movie);
    });
  });
};

// Store Review
const storeReview = async (req, res) => {
  const { id } = req.params;
  const { vote, text } = req.body;

  if (!req.user || !req.user.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: user not found in token" });
  }

  const userName = req.user.username; // Recupera il nome dal token

  const reviewSql =
    "INSERT INTO reviews (movie_id, name, text, vote) VALUES (?, ?, ?, ?)";

  try {
    const [results] = await connection
      .promise()
      .query(reviewSql, [id, userName, text, vote]);
    res
      .status(201)
      .json({ message: "Recensione salvata", id: results.insertId });
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
      message: `Database query failed: ${err.message}`,
    });
  }
};

module.exports = { index, show, storeReview };
