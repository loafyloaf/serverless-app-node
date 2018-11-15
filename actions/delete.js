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
const uuid = require('uuid');

function main(args) {

  // Retreive cloudant credentials
  const cloudantURL = args['services.cloudant.url']
  const cloudantDB = args['services.cloudant.database']

  return new Promise((resolve, reject) => {
    exports.deleteEntry(cloudantURL, cloudantDB, args.id,
      (error) => {
        if (error) {
          console.log('[KO]', error);
          reject({ ok: false });
        } else {
          console.log('[OK] Entry Deleted');
          resolve({ ok: true });
        }
      }
    );
  });
}

/// Deletes the specified entry from the given database.
function deleteEntry(cloudantUrl, cloudantDatabase, entryId, callback /* err */) {

  // Ensure document ID exists
  if (entryId == null) {
    console.log('[KO] No ID specified');
    callback({ ok: false });
    return
  }

  /// Instantiate Cloudant Instance
  const cloudant = Cloudant({
    url: cloudantUrl,
    plugin: 'retry',
    retryAttempts: 5,
    retryTimeout: 500
  });

  /// Use Cloudant Database
  const db = cloudant.db.use(cloudantDatabase);

  /// Get Cloudant entry by ID
  db.get(entryId, (err, result) => {
    if (err) {
      callback(err)
    } else {
      /// Delete Entry with ID
      db.destroy(entryId, result._rev, (err, body, header) => {
        err ? callback(err) : callback(null);
      });
    }
  });
}

exports.deleteEntry = deleteEntry;
exports.main = global.main = main;
