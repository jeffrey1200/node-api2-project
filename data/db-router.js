const express = require("express");

const database = require("./db");

const router = express.Router();

// .get requests

router.get("/", (req, res) => {
  database
    .find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." })
    );
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  database
    .findById(id)
    .then(post => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." })
    );
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  database
    .findCommentById(id)
    .then(comment => {
      if (!comment) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(comment);
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." })
    );
});

// end of .get requests

// .POST request

router.post("/", (req, res) => {
  //   const { title, contents } = req.body;
  database
    .insert(req.body)
    .then(newPost => {
      if (!req.body.title || !req.body.contents) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post."
        });
      } else {
        res.status(201).json(newPost);
      }
    })
    .catch(err =>
      res.status(500).json({
        error: "There was an error while saving the post to the database"
      })
    );
});

router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  const comment = { ...req.body, post_id: id };
  if (!comment.text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  } else {
    database
      .findById(id)
      .then(post => {
        if (post.length) {
          database
            .insertComment(comment)
            .then(data => {
              res.status(201).json(data);
            })
            .catch(err => {
              res.status(500).json({ err });
            });
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the comment to the database"
        });
      });
  }
});
// .findPostComments(id, { text })
// .then(comment => {
//   if (!comment) {
//     res
//       .status(404)
//       .json({ message: "The post with the specified ID does not exist." });
//   } else if (!text) {
//     res
//       .status(400)
//       .json({ errorMessage: "Please provide text for the comment." });
//   } else {
//     res.status(201).json(comment);
//   }
// })
// .catch(err =>
//   res.status(500).json({
//     error: "There was an error while saving the comment to the database"
//   })
// );

// .then(newComment => {
//   if (!newComment) {
//     res
//       .status(404)
//       .json({ message: "The post with the specified ID does not exist." });
//   } else if (!req.body.text) {
//     res
//       .status(400)
//       .json({ errorMessage: "Please provide text for the comment." });
//   } else {
//     res.status(201).json({ newComment });
//   }
// })
// .catch(err =>
//   res.status(500).json({
//     error: "There was an error while saving the comment to the database"
//   })
// );
// end of .post requests

// .put request

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;
  database
    .update(id, { title, contents })
    .then(post => {
      if (!title || !contents) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post."
        });
      } else if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The post information could not be modified." })
    );
});

//end of .put request

// .delete request

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  database
    .remove(id)
    .then(post => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json({ post });
      }
    })
    .catch(err =>
      res.status(500).json({ error: "The post could not be removed" })
    );
});
module.exports = router;
