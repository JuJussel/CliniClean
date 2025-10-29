const Person = require("../models/person.model.js");
const japUtils = require("japanese-string-utils");
const { log } = require("console");
const { rejections } = require("winston");

// Exports

exports.findMany = async (req, res) => {
  try {
    let search = req.query.query;
    let query = { $or: [] };
    let searchObject;

    // Try to parse as JSON first
    try {
      searchObject = JSON.parse(search);
    } catch (e) {
      // If parsing fails, it's a regular string search
      searchObject = null;
    }

    if (searchObject && typeof searchObject === 'object') {
      // Handle object-based search
      if (searchObject.id) {
        query.$or.push({ id: new RegExp(searchObject.id, 'i') });
      }

      // Handle kanji name match
      if (searchObject.family || searchObject.given) {
        const nameMatch = {};
        if (searchObject.family) {
          nameMatch['name.family'] = new RegExp(japUtils.toFullwidth(searchObject.family), 'i');
        }
        if (searchObject.given) {
          nameMatch['name.given'] = new RegExp(japUtils.toFullwidth(searchObject.given), 'i');
        }
        if (Object.keys(nameMatch).length > 0) {
          query.$or.push(nameMatch);
        }
      }

      // Handle kana name match
      if (searchObject.familyKana || searchObject.givenKana) {
        const kanaMatch = {};
        if (searchObject.familyKana) {
          kanaMatch['name.familyKana'] = new RegExp(japUtils.toFullwidth(searchObject.familyKana), 'i');
        }
        if (searchObject.givenKana) {
          kanaMatch['name.givenKana'] = new RegExp(japUtils.toFullwidth(searchObject.givenKana), 'i');
        }
        if (Object.keys(kanaMatch).length > 0) {
          query.$or.push(kanaMatch);
        }
      }
    } else {
      // Handle regular string search
      const searchValue = japUtils.toFullwidth(search);
      query.$or = [
        { id: new RegExp(search, 'i') },
        { 'name.family': new RegExp(searchValue, 'i') },
        { 'name.given': new RegExp(searchValue, 'i') },
        { 'name.familyKana': new RegExp(searchValue, 'i') },
        { 'name.givenKana': new RegExp(searchValue, 'i') },
        // Add concatenated name matches
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ['$name.family', '$name.given'] },
              regex: searchValue,
              options: 'i'
            }
          }
        },
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ['$name.familyKana', '$name.givenKana'] },
              regex: searchValue,
              options: 'i'
            }
          }
        }
      ];
    }
      // Handle object search with specific field matching
      if (search.id) {
        query.$or.push({ id: new RegExp(search.id, 'i') });
      }

      // Handle kanji name match
      if (search.family || search.given) {
        const nameMatch = {};
        if (search.family) {
          nameMatch['name.family'] = new RegExp(japUtils.toFullwidth(search.family), 'i');
        }
        if (search.given) {
          nameMatch['name.given'] = new RegExp(japUtils.toFullwidth(search.given), 'i');
        }
        if (Object.keys(nameMatch).length > 0) {
          query.$or.push(nameMatch);
        }
      }

      // Handle kana name match
      if (search.familyKana || search.givenKana) {
        const kanaMatch = {};
        if (search.familyKana) {
          kanaMatch['name.familyKana'] = new RegExp(japUtils.toFullwidth(search.familyKana), 'i');
        }
        if (search.givenKana) {
          kanaMatch['name.givenKana'] = new RegExp(japUtils.toFullwidth(search.givenKana), 'i');
        }
        if (Object.keys(kanaMatch).length > 0) {
          query.$or.push(kanaMatch);
        }
      }
    }

    // If no valid search criteria were provided, return empty array
    if (query.$or.length === 0) {
      return res.send([]);
    }

    const persons = await Person.find(query)
      .select('name birthDate gender type')
      .lean()
      .exec();

    res.send(persons);

  } catch (err) {
    $logger.error(err);
    res.status(500).send({ message: "Error retrieving Persons" });
  }
};

