const express = require("express");

const router = express.Router();

const db = require('../db');

//get posts
router
.get("/", (req, res) => {
    db.find(req.query)
      .then((posts) => {
        res.status(200).json(posts);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "Error retrieving the posts",
        });
      });
  });

//get posts by id
  router
  .get("/:id", (req, res) => {
    db.findById(req.params.id)
      .then((post) => {
        if (post) {
          res.status(200).json(post);
        } else {
          res.status(404).json({
            message: "post was not found",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "Error retrieving the post",
        });
      });
    });

//get comments
    router
    .get("/:id/comments", (req, res) => {
        db.findPostComments(req.params.id)
          .then((comment) => {
            if (comment) {
              res.status(200).json(comment);
            } else {
              res.status(404).json({
                message: "comment was not found",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              message: "Error retrieving the comment",
            });
          });
      });

//add posts
      router
      .post("/", (req, res) => {
        req.body.title && req.body.contents
          ? db.insert(req.body)
              .then(() => {
                res.status(201).json(req.body);
              })
              .catch((error) => {
                console.log(error);
                res.status(500).json({
                  messge: "Error adding the post",
                });
              })
          : res.status(400).json({
              errorMessage: "Post must include title and comments",
            });
      });


    //add comments
      router
      .post("/:id/comments", (req, res) => {
        db.findById(req.params.id)
      
          .then((post) => {
            if (post) {
              req.body.text
                ? db.insertComment(req.body)
                    .then(res.status(200).json(req.body))
                    .catch((err) => {
                      console.log(err);
                    })
                : res
                    .status(400)
                    .json({ errorMessage: "Must include text for the comment" });
            } else {
              res.status(404).json({
                message: "post was not found",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              message: "Error processing request",
            });
          });
      });

//delete post by id
      router
      .delete("/:id", (req, res) => {
        db.findById(req.params.id)
          .then((post) => {
            if (post) {
              db.remove(req.params.id)
                .then(() => res.status(200).json(post))
                .catch((error) => {
                  console.log(error);
                  res.status(500).json({ error: "The post was not removed" });
                });
            } else {
              res.status(404).json({
                message: "The post was not found",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              message: "Error processing request",
            });
          });
      });

//edit post by id
      router
      .put("/:id", (req, res) => {
        !req.params.id
          ? res.status(404).json({ errorMessage: "ID not found" })
          : req.body.title && req.body.contents
          ? db.update(req.params.id, req.body)
              .then(res.status(200).json(req.body))
              .catch((error) => {
                console.log(error);
                res.status(500).json({ message: "Error processing request" });
              })
          : res
              .status(400)
              .json({
                errorMessage: "Must include title and contents",
              });
      });
      
      module.exports = router;
