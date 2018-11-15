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

  // Sanitize database object
  delete args['services.cloudant.url']
  delete args['services.cloudant.database']

  return new Promise((resolve, reject) => {
    exports.create(cloudantURL, cloudantDB, args,
      (error, result) => {
        if (error) {
          console.log('[KO]', error);
          reject({ ok: false });
        } else {
          console.log('[OK]', result.id);
          resolve(result);
        }
      }
    );
  });
}

/// Creates a new database entry. It assigns a uuid to the object.
function create(cloudantUrl, cloudantDatabase, entry, callback /* err, entry */) {

  /// Instantiate Cloudant Instance
  const cloudant = Cloudant({
    url: cloudantUrl,
    plugin: 'retry',
    retryAttempts: 5,
    retryTimeout: 500
  });

  /// Use Cloudant Database
  const db = cloudant.db.use(cloudantDatabase);

  /// Append a created_at property to object
  entry.created_at = new Date()

  /// Insert entry into database
  db.insert(entry, (err, result) => {
    let updated = Object.assign(result || {}, entry);
    err ? callback(err) : callback(null, updated);
  });
}

exports.create = create;
exports.main = global.main = main;
