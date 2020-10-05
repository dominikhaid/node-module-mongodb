const mongoose = require('mongoose');

/**
 *
 *Find all Documents
 *
 */
module.exports.find = async (con, req) => {
  let res = new Object();


  if (req._parsedUrl.pathname.indexOf('author') !== -1) {
    res = await con.models.Person.find()
      .populate('fans', 'name email')
      .populate('stories', 'title')
      .exec()
      .catch(err => {
        return err;
      });
  }

  if (req._parsedUrl.pathname.indexOf('stories') !== -1) {
    res = await con.models.Story.find()
      .populate('fans', 'name email')
      .populate('author', 'name age')
      .exec()
      .catch(err => {
        return err;
      });
  }

  if (req._parsedUrl.pathname.indexOf('fans') !== -1) {
    res = await con.models.Fan.find()
      .populate('stories', 'title')
      .populate('author', 'name age')
      .exec()
      .catch(err => {
        return err;
      });
  }

  if (!res) return {error: 'No results'};
  return res;
};

/**
 * CREATE PERsON
 */

module.exports.createOne = async (con, req) => {
  let tempRes = new Object();
  let loopArray = [];
  const Fan = con.models.Fan;
  const Story = con.models.Story;
  const Person = con.models.Person;
  const PersonId = mongoose.Types.ObjectId();
  const FanId = mongoose.Types.ObjectId();
  const StoryId = mongoose.Types.ObjectId();

  let [queryFieldsPerson, bodyFieldsPerson] = req.xssFilter([
    'author_name',
    'author_age',
  ]);

  let [queryFieldsFan, bodyFieldsFan] = req.xssFilter([
    'fan_email',
    'fan_name',
  ]);

  let [queryFieldsStory, bodyFieldsStory] = req.xssFilter(['story_title']);

  async function prepareData() {
    let author, fan, story, tempData;

    if (queryFieldsPerson || bodyFieldsPerson) {
      tempData = queryFieldsPerson ? queryFieldsPerson : bodyFieldsPerson;

      if (queryFieldsFan || bodyFieldsFan) tempData.fans = [FanId];
      if (queryFieldsStory || bodyFieldsStory) tempData.stories = [StoryId];

      author = new Person({
        _id: PersonId,
        name: tempData.author_name,
        age: tempData.author_age,
      });

      loopArray.push({
        model: author,
        save: a => {
          tempRes.author = a;
        },
      });
    }

    if (queryFieldsFan || bodyFieldsFan) {
      tempData = queryFieldsFan ? queryFieldsFan : bodyFieldsFan;

      if (queryFieldsPerson || bodyFieldsPerson) tempData.author = [PersonId];
      if (queryFieldsStory || bodyFieldsStory) tempData.stories = [StoryId];

      fan = new Fan({
        _id: FanId,
        email: tempData.fan_email,
        name: tempData.fan_name,
      });

      loopArray.push({
        model: fan,
        save: a => {
          tempRes.fan = a;
        },
      });
    }

    if (queryFieldsStory || bodyFieldsStory) {
      tempData = queryFieldsStory ? queryFieldsStory : bodyFieldsStory;

      if (queryFieldsPerson || bodyFieldsPerson) tempData.author = PersonId;
      if (queryFieldsStory || bodyFieldsStory) tempData.stories = [StoryId];

      story = new Story({
        _id: StoryId,
        title: tempData.story_title,
      });

      loopArray.push({
        model: story,
        save: a => {
          tempRes.story = a;
        },
      });
    }

    let x = loopArray.length - 1;
    return await writeData(x);
  }

  function writeData(x) {
    if (x >= 0) {
      return (res = loopArray[x].model.save().then(e => {
        loopArray[x].save(e);
        x--;
        return writeData(x);
      })).catch(err => {
        if (err.code === 11000)
          return {
            error: 10,
            msg: `duplicated unique index ${JSON.stringify(
              err.keyValue,
            )}  already exsits`,
          };
        return {error: 10, msg: err};
      });
    } else {
      return tempRes;
    }
  }

  return await prepareData();
};

/**
 * READ PERSON
 */

module.exports.findOne = async (con, req) => {
  let res = new Object();
  let [queryFields, bodyFields] = req.xssFilter(['id']);

  if (req._parsedUrl.pathname.indexOf('author') !== -1) {
    res = await con.models.Person.findById(
      queryFields && queryFields.id ? queryFields.id : bodyFields.id,
      'name age',
    )
      .populate('fans', 'name email')
      .populate('stories', 'title')
      .exec()
      .catch(err => {
        return err;
      });
	}

	if (req._parsedUrl.pathname.indexOf('stories') !== -1) {
    res = await con.models.Story.findById(
      queryFields && queryFields.id ? queryFields.id : bodyFields.id,
      'title',
    )
      .populate('fans', 'name email')
      .populate('author', 'name age')
      .exec()
      .catch(err => {
        return err;
      });
	}

	if (req._parsedUrl.pathname.indexOf('fans') !== -1) {
    res = await con.models.Fan.findById(
      queryFields && queryFields.id ? queryFields.id : bodyFields.id,
      'name email',
    )
      .populate('stories', 'title')
      .populate('author', 'name age')
      .exec()
      .catch(err => {
        return err;
      });
  }

  if (!res) return {error: 'No results'};
  return res;
};

/**
 *SEARCH
 */
module.exports.searchOne = async (con, req) => {
  let res = new Object();

  if (req._parsedUrl.pathname.indexOf('author') !== -1) {
    let [queryFields, bodyFields] = req.xssFilter(['name']);
    res = con.models.Person.findOne(
      {
        name:
          queryFields && queryFields.name ? queryFields.name : bodyFields.name,
      },
      'name age',
    )
      .populate('fans', 'name email')
      .populate('stories', 'title')
      .exec();
	}

	if (req._parsedUrl.pathname.indexOf('stories') !== -1) {
    let [queryFields, bodyFields] = req.xssFilter(['title']);
    res = con.models.Story.findOne(
      {
        title:
          queryFields && queryFields.title
            ? queryFields.title
            : bodyFields.title,
      },
      'title',
    )
      .populate('fans', 'name email')
      .populate('author', 'name age')
      .exec();
	}

	if (req._parsedUrl.pathname.indexOf('fans') !== -1) {
    let [queryFields, bodyFields] = req.xssFilter(['email']);
    res = con.models.Fan.findOne(
      {
        email:
          queryFields && queryFields.email
            ? queryFields.email
            : bodyFields.email,
      },
      'name email',
    )
      .populate('stories', 'title')
      .populate('author', 'name age')
      .exec();
  }

  return res;
};

/**
 * UPDATE PERSON
 */
module.exports.updateOne = async function (con, req) {
  let updateRes;

  if (req._parsedUrl.pathname.indexOf('author') !== -1) {
    let [queryFields, bodyFields] = req.xssFilter([
      'author_name',
      'author_age',
      'new_author_name',
    ]);

    let personRes = await con.models.Person.findOneAndUpdate(
      {
        name:
          queryFields && queryFields.author_name
            ? queryFields.author_name
            : bodyFields.author_name,
      },
      {
        name:
          queryFields && queryFields.new_author_name
            ? queryFields.new_author_name
            : bodyFields.new_author_name,
        age:
          queryFields && queryFields.author_age
            ? Number(queryFields.author_age)
            : Number(bodyFields.author_age),
      },
    ).catch(err => {
      if (err.code === 11000)
        return {
          error: 10,
          msg: `duplicated unique index ${JSON.stringify(
            err.keyValue,
          )}  already exsits`,
        };
      return {error: 10, msg: err};
    });

    if (personRes && personRes.error) return personRes;

    if (personRes)
      updateRes = await con.models.Person.findOne({
        name:
          queryFields && queryFields.new_author_name
            ? queryFields.new_author_name
            : bodyFields.new_author_name,
      }).catch(err => {

				return { error: 10, msg: err };
      });

    return personRes ? updateRes : {error: 30, msg: 'No matching person found'};
	}

	if (req._parsedUrl.pathname.indexOf('stories') !== -1) {
    let [queryFields, bodyFields] = req.xssFilter([
      'story_title',
      'new_story_title',
    ]);

    let storyRes = await con.models.Story.findOneAndUpdate(
      {
        title:
          queryFields && queryFields.story_title
            ? queryFields.story_title
            : bodyFields.story_title,
      },
      {
        title:
          queryFields && queryFields.new_story_title
            ? queryFields.new_story_title
            : bodyFields.new_story_title,
      },
    ).catch(err => {
      if (err.code === 11000)
        return {
          error: 10,
          msg: `duplicated unique index ${JSON.stringify(
            err.keyValue,
          )}  already exsits`,
        };
      return {error: 10, msg: err};
    });

    if (storyRes && storyRes.error) return storyRes;

    if (storyRes)
      updateRes = await con.models.Story.findOne({
        title:
          queryFields && queryFields.new_story_title
            ? queryFields.new_story_title
            : bodyFields.new_story_title,
      });

    return storyRes ? updateRes : {error: 30, msg: 'No matching story found'};
	}

	if (req._parsedUrl.pathname.indexOf('fans') !== -1) {
    let [queryFields, bodyFields] = req.xssFilter([
      'new_fan_email',
      'fan_email',
      'fan_name',
    ]);

    let fanRes = await con.models.Fan.findOneAndUpdate(
      {
        email:
          queryFields && queryFields.fan_email
            ? queryFields.fan_email
            : bodyFields.fan_email,
      },
      {
        email:
          queryFields && queryFields.new_fan_email
            ? queryFields.new_fan_email
            : bodyFields.new_fan_email,
        name:
          queryFields && queryFields.fan_name
            ? queryFields.fan_name
            : bodyFields.fan_name,
      },
    ).catch(err => {
      if (err.code === 11000)
        return {
          error: 10,
          msg: `duplicated unique index ${JSON.stringify(
            err.keyValue,
          )}  already exsits`,
        };
      return {error: 10, msg: err};
    });

    if (fanRes && fanRes.error) return fanRes;

    if (fanRes)
      updateRes = await con.models.Fan.findOne({
        email:
          queryFields && queryFields.new_fan_email
            ? queryFields.new_fan_email
            : bodyFields.new_fan_email,
      });

    return fanRes ? updateRes : {error: 30, msg: 'No matching fan found'};
  }
};

/**
 *DELTE PERSON
 */

module.exports.deleteOne = async function (con, req) {
  async function updateAuthorRealated(res) {
    let stroyUpdate, fanUpate;

    if (res.stories.length > 0)
      stroyUpdate = await con.models.Story.updateMany({
        $set: {author: null},
      });

    if (res.fans.length > 0)
      fanUpate = await con.models.Fan.updateMany({
        $pull: {author: res._id},
      });

    return {updated: {stroies: stroyUpdate, fans: fanUpate}};
  }

  async function updateStoryRelated(res) {
    let authorUpdate, fanUpdate;

    if (res.fans.length > 0)
      fanUpdate = await con.models.Fan.updateMany({
        $pull: {stories: res._id},
      });

    if (res.author)
      authorUpdate = await con.models.Person.updateMany({
        $pull: {stories: res._id},
      });

    return {updated: {Persons: authorUpdate, fans: fanUpdate}};
  }

  async function updateFanRelated(res) {
    let authorUpdate, storiesUpdate;

    if (res.stories.length > 0)
      storiesUpdate = await con.models.Story.updateMany({
        $pull: {fans: res._id},
      });

    if (res.author.length > 0)
      authorUpdate = await con.models.Person.updateMany({
        $pull: {fans: res._id},
      });

    return {updated: {Persons: authorUpdate, stories: storiesUpdate}};
  }

  if (req._parsedUrl.pathname.indexOf('author') !== -1) {
    let [queryFields, bodyFields] = req.xssFilter(['author_name']);
    let personRes = await con.models.Person.findOneAndDelete({
      name:
        queryFields && queryFields.author_name
          ? queryFields.author_name
          : bodyFields.author_name,
    }).catch(err => {
      return err;
    });

    let updateRes;

    if (
      (personRes && personRes.stories && personRes.stories.length > 0) ||
      (personRes && personRes.fans && personRes.fans.length > 0)
    ) {
      updateRes = await updateAuthorRealated(personRes).catch(err => {
        return err;
      });
      return (updateRes = [personRes, updateRes]);
    } else {
      return personRes ? personRes : {error: 20, msg: 'no match'};
    }
  } else if (req._parsedUrl.pathname.indexOf('stories') !== -1) {
    let [queryFields, bodyFields] = req.xssFilter(['story_title']);
    let storyRes = await con.models.Story.findOneAndDelete({
      title:
        queryFields && queryFields.story_title
          ? queryFields.story_title
          : bodyFields.story_title,
    }).catch(err => {
      return err;
    });
    let updateRes;

    if (
      (storyRes && storyRes.author) ||
      (storyRes && storyRes.fans && storyRes.fans.length > 0)
    ) {
      updateRes = await updateStoryRelated(storyRes).catch(err => {
        return err;
      });
      return (updateRes = [storyRes, updateRes]);
    } else {
      return storyRes ? storyRes : {error: 20, msg: 'no match'};
    }
  } else if (req._parsedUrl.pathname.indexOf('fans') !== -1) {
    let [queryFields, bodyFields] = req.xssFilter(['fan_email']);
    let fanRes = await con.models.Fan.findOneAndDelete({
      email:
        queryFields && queryFields.fan_email
          ? queryFields.fan_email
          : bodyFields.fan_email,
    }).catch(err => {
      return err;
    });
    let updateRes;

    if (
      (fanRes && fanRes.stories && fanRes.stories.length > 0) ||
      (fanRes && fanRes.author && fanRes.author.length > 0)
    ) {
      updateRes = await updateFanRelated(fanRes).catch(err => {
        return err;
      });
      return (updateRes = [fanRes, updateRes]);
    } else {
      return fanRes ? fanRes : {error: 20, msg: 'no match'};
    }
  }
};
