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
    exports.deleteAll(cloudantURL, cloudantDB,
      (error) => {
        if (error) {
          console.log('[KO]', error);
          reject({ ok: false });
        } else {
          console.log('[OK] All Entries Deleted');
          resolve({ ok: true });
        }
      }
    );
  });
}

/// Deletes all entries from the given database.
function deleteAll(cloudantUrl, cloudantDatabase, callback /* err */) {

  /// Instantiate Cloudant Instance
  const cloudant = Cloudant({
    url: cloudantUrl,
    plugin: 'retry',
    retryAttempts: 5,
    retryTimeout: 500
  });

  const db = cloudant.db

  /// Destroy Cloudant Database
  db.destroy(cloudantDatabase, function(err, body) {
    if (err) {
      callback(err)
    } else {
      /// Recreate Cloudant Database
      db.create(cloudantDatabase, function(err, body) {
        err ? callback(err) : callback(null)
      });
    }
  });
}

exports.deleteAll = deleteAll;
exports.main = global.main = main;
