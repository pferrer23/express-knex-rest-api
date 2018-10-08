let papersData = [
  {
    author: 'Brittany',
    title: 'Lorem Ipsum',
    footnotes: ['one', 'two', 'three']
  },
  {
    author: 'Robbie',
    title: 'Dolor Set Amet',
    footnotes: ['four', 'five', 'six']
  }
];
const createPaper = (knex, paper) => {
  return knex('papers')
    .insert(
      {
        title: paper.title,
        author: paper.author
      },
      'id'
    )
    .then(paperId => {
      let footnotePromises = [];

      paper.footnotes.forEach(footnote => {
        footnotePromises.push(
          createFootnote(knex, {
            note: footnote,
            paper_id: paperId[0]
          })
        );
      });

      return Promise.all(footnotePromises);
    });
};

const createFootnote = (knex, footnote) => {
  return knex('footnotes').insert(footnote);
};

exports.seed = (knex, Promise) => {
  return knex('footnotes')
    .del() // delete footnotes first
    .then(() => knex('papers').del()) // delete all papers
    .then(() => {
      let paperPromises = [];

      papersData.forEach(paper => {
        paperPromises.push(createPaper(knex, paper));
      });

      return Promise.all(paperPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
