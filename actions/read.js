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

  return new Promise((resolve, reject) => {
    exports.get(cloudantURL, cloudantDB, args.id,
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

/// Get entry from given database by ID
function get(cloudantUrl, cloudantDatabase, entryId, callback /* err, result */) {

  // Ensure Document ID exists
  if (entryId == null) {
    callback("No id specified")
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
  db.get(entryId, { include_docs: true }, (err, result) => {
    err ? callback(err) : callback(null, result);
  });
}

exports.get = get;
exports.main = global.main = main;
