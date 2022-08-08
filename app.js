const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.set("view engine", "ejs");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/wikiDB");
}

const Article = mongoose.model("Article", { title: String, content: String });

// ALL ARTICLES

app
  .route("/articles")
  .get(function (req, res) {
    Article.find({}, function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      }
    });
  })

  .post(function (req, res) {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    article.save(function (err) {
      if (!err) {
        res.send("Successfully added new article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany({}, function (err) {
      if (!err) {
        res.send("Successfully deleted all the recordes");
      } else {
        res.send(err);
      }
    });
  });

// SPECIFIC ARTICLES

app
  .route("/articles/:articleName")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleName },
      function (err, foundArticle) {
        if (!err) {
          if (!foundArticle) {
            res.send("No such article found.");
          } else {
            res.send(foundArticle);
          }
        }
      }
    );
  })

  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleName },
      { title: req.body.title, content: req.body.content },
      function (err) {
        if (!err) {
          res.send("Successfully updated the required document.");
        }
      }
    );
  })

  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleName },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfully updated the document.");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleName }, function (err) {
      if (!err) {
        res.send("Successfully deleted the document.");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
