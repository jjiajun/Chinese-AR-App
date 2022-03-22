const fs = require('fs');
const util = require('util');
const { uploadFile } = require('../s3.js');
const BaseController = require('./baseCtrl.js');

const unlinkFile = util.promisify(fs.unlink);

class ImageController extends BaseController {
  /** Upload an image
   * @param {string} userId
   * @param {file} file
  */
  async uploadImage(req, res) {
    console.log('reqbodu',req.body)
    const { userId , result } = req.body;
    const { file } = req; // contains data about the image file that was sent over in formData
    console.log('result',result)
    const resultFile = await uploadFile(file);
    /** resultFile:  {
      ETag: '"76823f128b9a086c136a0f378a35691f"',
      // this location url can be used to directly access images
      // (if we allow public access) (we didnt though)
      Location: 'https://chinese-ar-app.s3.ap-southeast-1.amazonaws.com/16dd64db8c69c194e3b09696d8a6086b',
      key: '16dd64db8c69c194e3b09696d8a6086b',
      // This Key matches the name of the file that is on s3 bucket now (you can check it out!)
      Key: '16dd64db8c69c194e3b09696d8a6086b',
      Bucket: 'chinese-ar-app'
    } */
    // add Key to db under this user's name (to be continued)
    await this.model.updateOne(
      { _id: userId },
      // req.body.userId contains the userId of the user who submitted the form
      {
        $push: {
          images: {
            imagePath: `/${resultFile.Key}`, result
          },
        },
      },
    );

    await unlinkFile(file.path); // deletes file after it is uploaded
    res.send({ imagePath: `/${resultFile.Key}` ,result});
  }

  /** Delete an image
   * @param {string} userId
   * @param {string} imagePath
  */
  async deleteImage(req, res) {
    const { userId, imagePath } = req.body;

    await this.model.updateOne(
      { _id: userId },
      {
        $pull: {
          images: {
            imagePath: `/${imagePath}`,
          },
        },
      },
    );

    res.send('Deleted image successfully!');
  }
}

module.exports = ImageController;
