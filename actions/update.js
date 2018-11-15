/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

const Cloudant = require('cloudant');

function main(args) {

  // Retreive cloudant credentials
  const cloudantURL = args['services.cloudant.url']
  const cloudantDB = args['services.cloudant.database']

  // Sanitize database object
  delete args['services.cloudant.url']
  delete args['services.cloudant.database']

  return new Promise((resolve, reject) => {
    exports.update(cloudantURL, cloudantDB, args.entry,
      (error, result) => {
        if (error) {
          console.log('[KO]', error);
          reject({ ok: false });
        } else {
          console.log('[OK]', result);
          resolve(result);
        }
      }
    );
  });
}

/// Updates the given entry with the provided values
function update(cloudantUrl, cloudantDatabase, entry, callback /* err, entry */) {

  /// Instantiate Cloudant Instance
  const cloudant = Cloudant({
    url: cloudantUrl,
    plugin: 'retry',
    retryAttempts: 5,
    retryTimeout: 500
  });

  if (entry == null || entry._id == null) {
    callback("Invalid object")
    return
  }

  /// Use Cloudant Instance
  const db = cloudant.db.use(cloudantDatabase);

  /// Get Entry From Cloudant Database
  db.get(entry._id, (err, result) => {
    if (err) {
      callback(err);
    } else {
      /// Merge database entry and updated entry
      let updated = Object.assign(result, entry);

      /// Insert updated entry into database
      db.insert(updated, (err, result) => {
        err ? callback(err) : callback(null, updated);
      });
    }
  });
}

exports.update = update;
exports.main = global.main = main;
