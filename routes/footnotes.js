module.exports = (app, database) => {
  app.get('/api/v1/footnotes', (request, response, next) => {
    database('footnotes')
      .select()
      .then(footnotes => {
        response.status(200).json(footnotes);
      })
      .catch(error => {
        response.status(500).json({ error });
      });
  });
  app.post('/api/v1/footnotes', (request, response) => {
    const footnote = request.body;
    for (let requiredParameter of ['note', 'paper_id']) {
      if (!footnote[requiredParameter]) {
        return response.status(422).send({
          error: `Expected format: { note: <String>, paper_id: <String> }. You're missing a "${requiredParameter}" property.`
        });
      }
    }
    database('footnotes')
      .insert(footnote, 'id')
      .then(footnote => {
        response.status(201).json({ id: footnote[0] });
      })
      .catch(error => {
        response.status(500).json({ error });
      });
  });
};
