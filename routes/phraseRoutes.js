const express = require('express');

const phraseRouter = express.Router();

module.exports = (controller, verifyToken) => {
  phraseRouter.post(
    '/uploadphrase',
    // verifyToken(),
    controller.uploadPhrase.bind(controller),
  );

  phraseRouter.post('/getphrases', controller.getPhrasesByIdAndCategory.bind(controller));

  phraseRouter.post('/addcategorytophrase', controller.addCategoryToPhrase.bind(controller));

  phraseRouter.post('/removecategoryfromphrase', controller.removeCategoryFromPhrase.bind(controller));

  phraseRouter.post('/deletephrase', controller.deletePhrase.bind(controller));

  phraseRouter.post('/getcategories', controller.getCategories.bind(controller));

  phraseRouter.post('/addnewcategory', controller.addNewCategory.bind(controller));

  phraseRouter.post('/deletecategory', controller.deleteCategory.bind(controller));

  return phraseRouter;
};
