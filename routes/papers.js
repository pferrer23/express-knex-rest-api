module.exports = (app, database) => {
  app.get('/api/v1/papers', (request, response, next) => {
    database('papers')
      .select()
      .then(papers => {
        console.log(request.user);
        response.status(200).json(papers);
      })
      .catch(error => {
        response.status(500).json({ error });
      });
  });

  app.get('/api/v1/papers/:id', (request, response, next) => {
    database('papers')
      .where('id', request.params.id)
      .select()
      .then(papers => {
        if (papers.length) {
          response.status(200).json(papers);
        } else {
          response.status(404).json({
            error: `Could not find paper with id ${request.params.id}`
          });
        }
      })
      .catch(error => {
        response.status(500).json({ error });
      });
  });

  app.post('/api/v1/papers', (request, response, next) => {
    const paper = request.body;

    for (let requiredParameter of ['title', 'author']) {
      if (!paper[requiredParameter]) {
        return response.status(422).send({
          error: `Expected format: { title: <String>, author: <String> }. You're missing a "${requiredParameter}" property.`
        });
      }
    }
    database('papers')
      .insert(paper, 'id')
      .then(paper => {
        response.status(201).json({ id: paper[0] });
      })
      .catch(error => {
        response.status(500).json({ error });
      });
  });
};
